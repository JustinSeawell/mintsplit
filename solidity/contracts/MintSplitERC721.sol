// contracts/MintSplitERC721.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@manifoldxyz/royalty-registry-solidity/contracts/specs/IManifold.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./RevenueSplitter.sol";

// TODO: Consider using ERC721 fork to optimize gas
contract MintSplitERC721 is IManifold, ERC721EnumerableUpgradeable, OwnableUpgradeable, ReentrancyGuardUpgradeable {
    using Counters for Counters.Counter;
    using Strings for uint;

    uint public contentCount;
    uint[] public supplyLimits;
    uint public mintPrice;
    uint public mintLimit;
    uint public allowMintingAfter = 0;
    uint public timeDeployed;
    string public baseURI;
    RevenueSplitter public revenueSplitter;
    bool public isPaused = false;

    Counters.Counter private tokenIds;
    mapping (uint => Counters.Counter) public contentSupplies;
    mapping (uint => uint[2]) private tokenSubjects; // [content id, edition #]
    mapping (uint => string) public contentUriOverrides;

    constructor() initializer {}

    function initialize(
        address _owner,
        address _revenueSplitter,
        MintSplitSharedLibV1.ProjectParams calldata _params
    ) initializer public {
        require(_params.supplyLimits.length == _params.contentCount);

        __ERC721_init(_params.projectName, _params.symbol);
        _transferOwnership(_owner);
        revenueSplitter = RevenueSplitter(_revenueSplitter);

        contentCount = _params.contentCount;
        supplyLimits = _params.supplyLimits;
        mintPrice = _params.mintPrice;
        mintLimit = _params.mintLimit;
        baseURI = _params.baseURI;

        if (_params.releaseTime > block.timestamp) {
            allowMintingAfter = _params.releaseTime - block.timestamp;
        }

        timeDeployed = block.timestamp;
    }

    // Internal
    function _baseURI(uint contentId) internal view virtual returns (string memory) {
        if (bytes(contentUriOverrides[contentId]).length == 0) return baseURI;

        return contentUriOverrides[contentId];
    }

    // External
    function mint(uint[] calldata contentIds) external payable nonReentrant {
        require(!isPaused);
        require(block.timestamp >= timeDeployed + allowMintingAfter);
        require(contentIds.length > 0);
        
        if (mintLimit > 0) {
            require((balanceOf(msg.sender) + contentIds.length) <= mintLimit);
        }

        if (msg.sender != owner()) {
            require(msg.value == (contentIds.length * mintPrice));
        }

        revenueSplitter.receiveMint{value: msg.value}(contentIds);

        for (uint i = 0; i < contentIds.length; i++) {
            uint contentId = contentIds[i];
            require(contentId > 0 && contentId <= contentCount);

            Counters.Counter storage contentSupply = contentSupplies[contentId];

            // The supply limit for content id 1 is found at supplyLimits[0]
            require((contentSupply.current() + 1) <= supplyLimits[contentId - 1]);

            contentSupply.increment();
            tokenIds.increment();

            uint newTokenId = tokenIds.current();
            _mint(msg.sender, newTokenId);
            tokenSubjects[newTokenId] = [contentId, contentSupply.current()];
        }
    }

    function getRoyalties(uint256 tokenId) external view returns (address payable[] memory, uint256[] memory) {
        uint[2] storage subject = tokenSubjects[tokenId];
        return revenueSplitter.getContentRoyalties(subject[0]);
    }

    function getSecondsUntilMinting() external view returns (uint256) {
        if (block.timestamp < timeDeployed + allowMintingAfter) {
            return (timeDeployed + allowMintingAfter) - block.timestamp;
        } else {
            return 0;
        }
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(_exists(tokenId));

        uint[2] memory subject = tokenSubject(tokenId);
        string memory currentBaseURI = _baseURI(subject[0]);
        return
            bytes(currentBaseURI).length > 0
                ? string(
                    abi.encodePacked(
                        currentBaseURI,
                        subject[0].toString(), // content id
                        '-',
                        subject[1].toString(), // edition #
                        ".json"
                    )
                )
                : "";
    }

    // Public
    function tokenSubject(uint tokenId) public view returns (uint[2] memory) {
        require(_exists(tokenId), "token does not exist");

        return tokenSubjects[tokenId];
    }

    function getSupplyLimits() public view returns (uint[] memory) {
        return supplyLimits;
    }

    // Only Owner
    function setIsPaused(bool _state) public onlyOwner {
        isPaused = _state;
    }

    function addContent(uint[] calldata newSupplyLimits) external onlyOwner {
        require(newSupplyLimits.length > 0);
        contentCount += newSupplyLimits.length;
        for (uint i = 0; i < newSupplyLimits.length; i++) {
            supplyLimits.push(newSupplyLimits[i]);
        }
    }

    function setBaseURI(string calldata newBaseURI) public onlyOwner {
        baseURI = newBaseURI;
    }
    
    function setContentURI(string calldata newURI, uint contentId) public onlyOwner {
        require(contentId > 0 && contentId <= contentCount);
        contentUriOverrides[contentId] = newURI;
    }
}