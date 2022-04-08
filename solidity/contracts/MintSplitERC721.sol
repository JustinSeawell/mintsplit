// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165Checker.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "@manifoldxyz/royalty-registry-solidity/contracts/specs/IManifold.sol";
import "./MintSplitSharedLib.sol";
import "./RevenueSplitter.sol";
import "./IMintSplitERC721.sol";

/// @author mintsplit.io

/// @title MintSplit ERC721 Smart Contract
contract MintSplitERC721 is ERC165, ERC721Upgradeable, OwnableUpgradeable, IManifold, IMintSplitERC721 {
    using Counters for Counters.Counter;
    using Strings for uint;

    MintSplitSharedLib.ProjectParams private projectParams;
    RevenueSplitter public revenueSplitter;
    mapping (uint => Counters.Counter) public supplies; // content id => supply count
    mapping (uint => uint) public tokenContent; // token id => content id
    mapping (uint => uint) public tokenEdition; // token id => edition #
    mapping (uint => string) public contentUriOverrides;
    uint public tokenLimit;
    Counters.Counter private tokens;
    bool public paused;
    bool private hasSplitter;

    /**
    @dev Automatically mark the implementation
    contract as initialized when it is deployed
    */
    constructor() initializer {}

    /**
    Initialize a new project
    @dev Initialize a new ERC721 clone
    @param owner the address that initialized the ERC721 clone
    @param params the project settings configured by the user
    @param maxLimit the max token count for this contract
    */
    function initialize(
        address owner,
        MintSplitSharedLib.ProjectParams calldata params,
        uint maxLimit
    ) initializer public {
        require(_checkSum(maxLimit, params.editions));
        __ERC721_init(params.projectName, params.symbol);
        _transferOwnership(owner);
        projectParams = params;
        tokenLimit = maxLimit;
    }

    /**
    Get the base URI for a specific content id
    @param contentId the content for which to get the URI
    */
    function _baseURI(uint contentId) internal view virtual returns (string memory) {
        string storage overrideURI = contentUriOverrides[contentId];
        if (bytes(overrideURI).length == 0) return projectParams.baseURI;
        return overrideURI;
    }

    /**
    Check that the sum of an array of numbers is less than the provided limit
    @param limit the limit to check the sum against
    @param numbers the array of numbers to sum
    */
    function _checkSum(uint limit, uint[] calldata numbers) internal pure returns (bool) {
        uint sum;
        for (uint i = 0; i < numbers.length; i++) {
            sum += numbers[i];
        }
        return (sum - numbers.length) < limit;
    }

    /**
    @dev See {IERC165-supportsInterface}.
    */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165, ERC721Upgradeable) returns (bool) {
        return interfaceId == type(IMintSplitERC721).interfaceId || super.supportsInterface(interfaceId);
    }

    /**
    @dev See {IMintSplitERC721-mint}
    */
    function mint(uint cid) external payable {
        require(!paused);
        if (msg.sender != owner()) {
            require(block.timestamp > projectParams.releaseTime);
            require(msg.value == projectParams.mintPrice);
        }
        Counters.Counter storage supply = supplies[cid];
        require(supply.current() < projectParams.editions[cid-1]);
        supply.increment();
        tokens.increment();
        uint tid = tokens.current();
        _mint(msg.sender, tid);
        tokenContent[tid] = cid;
        tokenEdition[tid] = supply.current();
        if (hasSplitter) {
            revenueSplitter.receiveMint{value: msg.value}(cid);
        }
    }

    /**
    @dev See {IMintSplitERC721-mintBatch}
    */
    function mintBatch(uint[] calldata contentIds) external payable {
        require(!paused);
        if (msg.sender != owner()) {
            require(block.timestamp > projectParams.releaseTime);
            require(msg.value == (contentIds.length * projectParams.mintPrice));
        }
        for (uint i = 0; i < contentIds.length; i++) {
            uint cid = contentIds[i];
            Counters.Counter storage supply = supplies[cid];
            require(supply.current() < projectParams.editions[cid-1]);
            supply.increment();
            tokens.increment();
            uint tid = tokens.current();
            _mint(msg.sender, tid);
            tokenContent[tid] = cid;
            tokenEdition[tid] = supply.current();
        }
        if (hasSplitter) {
            revenueSplitter.receiveMintBatch{value: msg.value}(contentIds);
        }
    }

    /**
    @dev Get royalites of a token.
    @return recipients_ addresses of the split recipients
    @return bps basis points of split recipients
    */
    function getRoyalties(uint tokenId) external view returns(address payable[] memory recipients_, uint256[] memory bps) {
        require(_exists(tokenId));
        require(hasSplitter);
        return revenueSplitter.getRoyaltySplits(tokenContent[tokenId]);
    }

    /**
    Get the URI for the token
    @param tokenId the token id for which to get the URI
    */
    function tokenURI(uint tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId));
        uint contentId = tokenContent[tokenId];
        string memory baseUri = _baseURI(tokenId);
        if (bytes(baseUri).length == 0) return "";
        return string(abi.encodePacked(baseUri, contentId.toString(), "-", tokenEdition[tokenId].toString(), ".json"));
    }

    /**
    @dev See {IMintSplitERC721-getParams}
    */
    function getParams() external view returns (MintSplitSharedLib.ProjectParams memory params) {
        return projectParams;
    }

    /**
    @dev See {IMintSplitERC721-addRevenueSplitter}
    */
    function addRevenueSplitter(
        address implementation,
        MintSplitSharedLib.PaymentSplitConfig[] calldata configs,
        MintSplitSharedLib.PaymentSplit calldata defaultMint,
        MintSplitSharedLib.PaymentSplit calldata defaultRoyalty
    ) external onlyOwner {
        require(ERC165Checker.supportsInterface(implementation, type(IRevenueSplitter).interfaceId));
        revenueSplitter = RevenueSplitter(Clones.clone(implementation));
        revenueSplitter.initialize(msg.sender, configs, defaultMint, defaultRoyalty);
        hasSplitter = true;
    }

    /// Toggle paused state
    function togglePaused() external onlyOwner {
        paused = !paused;
    }

    /**
    @dev See {IMintSplitERC721-setBaseURI}
    */
    function setBaseURI(string calldata uri) external onlyOwner {
        projectParams.baseURI = uri;
    }

    /**
    @dev See {IMintSplitERC721-setContentURI}
    */
    function setContentURI(string calldata uri, uint contentId) external onlyOwner {
        contentUriOverrides[contentId] = uri;
    }

    /**
    @dev See {IMintSplitERC721-setParams}
    */
    function setParams(MintSplitSharedLib.ProjectParams calldata newParams) external onlyOwner {
        require(_checkSum(tokenLimit, newParams.editions));
        projectParams = newParams;
    }

    /// Withdraw contract funds
    function withdraw() external onlyOwner {
        (bool success, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(success);
    }
}