// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "./MintSplitSharedLib.sol";
import "./IRevenueSplitter.sol";

/// @author mintsplit.io

/// @title MintSplit Revenue Splitter Smart Contract
contract RevenueSplitter is ERC165, OwnableUpgradeable, ReentrancyGuardUpgradeable, IRevenueSplitter {
    uint public totalBalance;
    MintSplitSharedLib.PaymentSplit defaultMintSplit;
    MintSplitSharedLib.PaymentSplit defaultRoyaltySplit;
    mapping (uint => MintSplitSharedLib.PaymentSplit) private contentMintSplits;
    mapping (uint => MintSplitSharedLib.PaymentSplit) private contentRoyalties;
    mapping (address => uint) public balance;

    event SplitsSet(address indexed owner, MintSplitSharedLib.PaymentSplitConfig[] configs);
    event DefaultSplitSet(address indexed owner, MintSplitSharedLib.PaymentSplitConfig config);
    event PaymentReleased(address indexed owner, address indexed to, uint amount);

    /**
    @dev Automatically mark the implementation
    contract as initialized when it is deployed
    */
    constructor() initializer {}

    /**
    Initialize a new revenue splitter
    @param owner the address that initialized the revenue splitter clone
    @param configs data for configuring mint and royalty split overrides
    @param defaultMint data for configuring default mint split
    @param defaultRoyalty data for configuring default royalty split
    */
    function initialize(
        address owner,
        MintSplitSharedLib.PaymentSplitConfig[] calldata configs,
        MintSplitSharedLib.PaymentSplit calldata defaultMint,
        MintSplitSharedLib.PaymentSplit calldata defaultRoyalty
    )
        initializer public
    {
        __Context_init_unchained();
        __ReentrancyGuard_init_unchained();
        _transferOwnership(owner);

        if (defaultMint.recipients.length == 0) {
            defaultMintSplit.recipients.push(payable(owner));
            defaultMintSplit.bps.push(10000); // 100%
        } else {
            defaultMintSplit = defaultMint;
        }

        if (defaultRoyalty.recipients.length == 0) {
            defaultRoyaltySplit.recipients.push(payable(owner));
            defaultRoyaltySplit.bps.push(1100); // 11%
        } else {
            defaultRoyaltySplit = defaultRoyalty;
        }
        
        if (configs.length == 0) return;
        
        _setSplits(configs);
    }

    /**
    Set revenue splits - internal
    @param configs data for configuring mint and royalty splits
    */
    function _setSplits(MintSplitSharedLib.PaymentSplitConfig[] calldata configs) internal {
        for (uint i = 0; i < configs.length; i++) {
            MintSplitSharedLib.PaymentSplitConfig calldata config = configs[i];
            if (config.isMint) {
                contentMintSplits[config.contentId] = config.split;
            } else {
                contentRoyalties[config.contentId] = config.split;
            }
        }
        emit SplitsSet(owner(), configs);
    }

    /**
    @dev See {IERC165-supportsInterface}.
    */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
        return interfaceId == type(IRevenueSplitter).interfaceId || super.supportsInterface(interfaceId);
    }

    /**
    @dev See {IRevenueSplitter-receiveMint}
    */
    function receiveMint(uint cid) external payable {
        totalBalance += msg.value;
        MintSplitSharedLib.PaymentSplit storage split = contentMintSplits[cid].recipients.length == 0 ? defaultMintSplit : contentMintSplits[cid];
        for (uint i = 0; i < split.recipients.length; i++) {
            balance[split.recipients[i]] += (msg.value*split.bps[i]/10000);
        }
    }

    /**
    @dev See {IRevenueSplitter-receiveMintBatch}
    */
    function receiveMintBatch(uint[] calldata contentIds) external payable {
        totalBalance += msg.value;
        uint valuePerToken = msg.value / contentIds.length;
        for (uint i = 0; i < contentIds.length; i++) {
            MintSplitSharedLib.PaymentSplit storage split = contentMintSplits[contentIds[i]].recipients.length == 0 ? defaultMintSplit : contentMintSplits[contentIds[i]];
            for (uint j = 0; j < split.recipients.length; j++) {
                balance[split.recipients[j]] += (valuePerToken*split.bps[j]/10000);
            }
        }
    }

    /**
    @dev See {IRevenueSplitter-getMintSplits}
    */
    function getMintSplits(uint cid) external view returns(address payable[] memory recipients_, uint256[] memory bps) {
        MintSplitSharedLib.PaymentSplit storage split = contentMintSplits[cid];
        if (split.recipients.length == 0) return (defaultMintSplit.recipients, defaultMintSplit.bps);
        return (split.recipients, split.bps);
    }

    /**
    @dev See {IRevenueSplitter-getRoyaltySplits}
    */
    function getRoyaltySplits(uint cid) external view returns(address payable[] memory recipients_, uint256[] memory bps) {
        MintSplitSharedLib.PaymentSplit storage split = contentRoyalties[cid];
        if (split.recipients.length == 0) return (defaultRoyaltySplit.recipients, defaultRoyaltySplit.bps);
        return (split.recipients, split.bps);
    }

    /**
    Get the default revenue splits
    @return mint the default mint split
    @return royalty the default royalty split
    */
    function getDefaultSplits() external view returns(MintSplitSharedLib.PaymentSplit memory mint, MintSplitSharedLib.PaymentSplit memory royalty) {
        return (defaultMintSplit, defaultRoyaltySplit);
    }

    /**
    @dev See {IRevenueSplitter-release}
    */
    function release(address payable account) external nonReentrant {
        uint payment = balance[account];
        require(payment > 0);
        balance[account] = 0;
        totalBalance -= payment;
        AddressUpgradeable.sendValue(account, payment);
        emit PaymentReleased(owner(), account, payment);
    }

    /**
    @dev See {IRevenueSplitter-setSplits}
    */
    function setSplits(MintSplitSharedLib.PaymentSplitConfig[] calldata configs) external onlyOwner {
        require(configs.length > 0);
        _setSplits(configs);
    }

    /**
    @dev See {IRevenueSplitter-setDefaultSplit}
    */
    function setDefaultSplit(MintSplitSharedLib.PaymentSplitConfig calldata config) external onlyOwner {
        if (config.isMint) {
            defaultMintSplit = config.split;
        } else {
            defaultRoyaltySplit = config.split;
        }
        emit DefaultSplitSet(owner(), config);
    }

    /// Withdraw contract funds
    function withdraw() public payable onlyOwner {
        (bool success, ) = payable(msg.sender).call{
            value: (address(this).balance - totalBalance)
        }("");
        require(success);
    }
}