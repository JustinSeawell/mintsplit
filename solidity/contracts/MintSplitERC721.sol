// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165Checker.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "@manifoldxyz/royalty-registry-solidity/contracts/specs/IManifold.sol";
import "./MintSplit.sol";
import "./MintSplitFactory.sol";

/// @author mintsplit.io

/// @title MintSplit ERC721 Smart Contract
contract MintSplitERC721 is ERC721Upgradeable, OwnableUpgradeable, ReentrancyGuardUpgradeable, IManifold {
    using Counters for Counters.Counter;
    using Strings for uint;

    uint256[] public editions;
    address factory;
    uint256 public totalBalance;
    bool public isPaused;
    MintSplit.Params private params;
    MintSplit.PaymentSplit defaultMintSplit;
    MintSplit.PaymentSplit defaultRoyaltySplit;
    Counters.Counter public tokens;

    mapping (uint => string) public contentURI;
    mapping (uint256 => Counters.Counter) public contentSupply;
    mapping (uint256 => uint256) public tokenContent;
    mapping (uint256 => uint256) public tokenEdition;
    mapping (address => uint256) public balance;
    mapping (uint256 => bool) mintSplitOverride;
    mapping (uint256 => MintSplit.PaymentSplit) mintSplits;
    mapping (uint256 => MintSplit.PaymentSplit) royaltySplits;

    modifier onlyFactory() {
        require(factory == _msgSender());
        _;
    }

    /**
    @dev Automatically mark the implementation
    contract as initialized when it is deployed
    */
    constructor() initializer {}

    /**
    Initialize a new project
    @dev Initialize a new ERC721 clone
    @param _owner the address that initialized the ERC721 clone
    @param _factory the address of the MintSplitFactory that initialized the ERC721 clone
    @param _params the project settings configured by the user
    @param _editions the editions of the initial content
    */
    function initialize(address _owner, address _factory, MintSplit.Params calldata _params, uint256[] calldata _editions) initializer public {
        __ERC721_init(_params.name, _params.symbol);
        _transferOwnership(_owner);
        factory = _factory;
        params = _params;
        editions = _editions;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721Upgradeable) returns (bool) {
        return
            interfaceId == type(IManifold).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    /**
    Mint NFTs
    @param contentIds an array of content ids to be minted
    */
    function mint(uint256[] calldata contentIds) external payable nonReentrant {
        require(!isPaused);
        if (msg.sender != owner()) {
            require(params.mintPrice * contentIds.length == msg.value);
            require(block.timestamp > params.releaseTime);
        }
        for(uint256 i; i < contentIds.length; i++) {
            uint cid = contentIds[i];
            require(cid > 0);
            require(cid <= editions.length);
            Counters.Counter storage supply = contentSupply[cid];
            uint256 currentSupply = supply.current();
            require(currentSupply < editions[cid-1]);
            supply.increment();
            tokens.increment();
            uint tid = tokens.current();
            tokenContent[tid] = cid;
            tokenEdition[tid] = currentSupply+1;
            _mint(msg.sender, tid);
            if (defaultMintSplit.recipients.length > 0 || mintSplitOverride[cid]) _updateBalance(cid);
        }
    }

    /**
    Release funds to the user
    @param account the account whom to release funds
    */
    function release(address payable account) external nonReentrant {
        require(!isPaused);
        uint payment = balance[account];
        require(payment > 0);
        balance[account] = 0;
        totalBalance -= payment;
        AddressUpgradeable.sendValue(account, payment);
    }

    /**
    Get the URI for the token
    @param tokenId the token id for which to get the URI
    */
    function tokenURI(uint tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId));
        uint cid = tokenContent[tokenId];
        string storage cURI = contentURI[cid];
        string memory uri = (bytes(cURI).length == 0) ? params.baseURI : cURI;
        return string(abi.encodePacked(uri, cid.toString(), "-", tokenEdition[tokenId].toString(), ".json"));
    }

    /**
    @dev Get royalites of a token.
    @return recipients_ addresses of the split recipients
    @return bps basis points of split recipients
    */
    function getRoyalties(uint tokenId) external view returns(address payable[] memory recipients_, uint256[] memory bps) {
        require(_exists(tokenId));
        MintSplit.PaymentSplit storage results = royaltySplits[tokenContent[tokenId]];
        return (results.recipients, results.bps);
    }

    /**
    Get editions
    @return editions the list of content editions
    */
    function getEditions() external view returns(uint[] memory) {
        return editions;
    }
    
    /**
    Get project params
    @return params the active params for this contract
    */
    function getParams() external view returns(MintSplit.Params memory) {
        return params;
    }
    
    /**
    Get default splits
    @return mintSplit the default mint splits
    @return royaltySplit the default royalty splits
    */
    function getDefaultSplits() external view returns(MintSplit.PaymentSplit memory mintSplit, MintSplit.PaymentSplit memory royaltySplit) {
        return (defaultMintSplit, defaultRoyaltySplit);
    }
    
    /**
    Get splits for a specific content
    @param cid the id for the content to retrieve splits
    @param isMint flag for determining split type
    @return split the splits for this content
    */
    function getContentSplits(uint256 cid, bool isMint) external view returns(MintSplit.PaymentSplit memory split) {
        return isMint ? mintSplits[cid] : royaltySplits[cid];
    }

    /**
    Add content
    @dev only the factory can use this function
    @param content the data for adding content
    */
    function addContent(MintSplit.Content calldata content) external onlyFactory {
        editions.push(content.editions);
        contentURI[editions.length] = content.uri;
    }
    
    /**
    Update content
    @dev only the factory can use this function
    @param content the data for updating content
    */
    function setContent(MintSplit.Content calldata content) external onlyFactory {
        uint256 cid = content.id;
        editions[cid-1] = content.editions;
        contentURI[cid] = content.uri;
    }

    /**
    Set split
    @param config the data for configuring the content split
    @param isDefault flag for setting default splits
    */
    function setSplit(MintSplit.PaymentSplitConfig calldata config, bool isDefault) external onlyOwner {
        MintSplit.PaymentSplit calldata split = config.split;
        require(split.recipients.length < 6);
        require(split.recipients.length == split.bps.length);
        if (isDefault) {
            config.isMint ? (defaultMintSplit = split) : (defaultRoyaltySplit = split);
            return;
        }
        uint cid = config.contentId;
        require(cid > 0);
        if (config.isMint) {
            mintSplitOverride[cid] = (split.recipients.length > 0);
            mintSplits[cid] = split;
        } else {
            royaltySplits[cid] = split;
        }
    }

    /// Toggle paused state
    function togglePaused() external onlyOwner {
        isPaused = !isPaused;
    }

    /**
    Update project params
    @param newParams the data for updating project params
    */
    function setParams(MintSplit.Params calldata newParams) external onlyOwner {
        params = newParams;
    }

    /// Withdraw contract funds
    function withdraw() external onlyOwner {
        (bool success, ) = payable(msg.sender).call{
            value: (address(this).balance - totalBalance)
        }("");
        require(success);
    }

    /**
    Update balance
    @param cid the id of content for which to update the contract balance
    */
    function _updateBalance(uint256 cid) internal {
        MintSplit.PaymentSplit storage split = mintSplitOverride[cid] ? mintSplits[cid] : defaultMintSplit;
        totalBalance += params.mintPrice;
        for(uint256 i; i < split.recipients.length; i++) {
            balance[split.recipients[i]] += (params.mintPrice*split.bps[i])/10000;
        }
    }
}