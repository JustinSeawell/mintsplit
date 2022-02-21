// contracts/RevenueSplitter.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "./MintSplitSharedLibV1.sol";

contract RevenueSplitter is OwnableUpgradeable, ReentrancyGuardUpgradeable {
    event RoyaltyRemoved(uint contentId, address recipient, bool isMint);
    event RoyaltyAdded(uint contentId, address recipient, uint bps, bool isMint);
    event RoyaltyUpdated(uint contentId, address recipient, uint bps, bool isMint);
    event PaymentReleased(address to, uint amount);
    event PaymentReceived(uint[] contentIds, uint amount);

    address private erc721;

    mapping (uint => MintSplitSharedLibV1.PaymentSplit) private _contentMintSplits;
    mapping (uint => MintSplitSharedLibV1.PaymentSplit) private _contentRoyalties;

    uint public totalBalance;
    mapping (address => uint) public balance;
    
    constructor() initializer {}

    function initialize(address _owner, address _erc721, MintSplitSharedLibV1.PaymentSplitConfig[] calldata _splitConfigs) initializer public {
        require(_splitConfigs.length > 0);

        __Context_init_unchained();
        __ReentrancyGuard_init_unchained();
        _transferOwnership(_owner); // Owner address forwarded from factory.createProject

        erc721 = _erc721; // Address of the sibling erc721 contract

        /**
            TODO:
            x require split configs length > 0
            - default config ??
            - require bps < 10000 ??
         */

        for (uint i = 0; i < _splitConfigs.length; i++) {
            MintSplitSharedLibV1.PaymentSplitConfig calldata splitConfig = _splitConfigs[i];
            require(splitConfig.split.recipients.length == splitConfig.split.bps.length);
            if (splitConfig.isMint) {
                _contentMintSplits[splitConfig.contentId] = splitConfig.split;
            } else {
                _contentRoyalties[splitConfig.contentId] = splitConfig.split;
            }
        }
    }

    // External
    function getContentRoyalties(uint256 contentId) external view returns (address payable[] memory, uint256[] memory) {
        MintSplitSharedLibV1.PaymentSplit storage royalties = _contentRoyalties[contentId];
        return (royalties.recipients, royalties.bps);
    }
    
    function getContentMintSplits(uint256 contentId) external view returns (address payable[] memory, uint256[] memory) {
        MintSplitSharedLibV1.PaymentSplit storage mintSplits = _contentMintSplits[contentId];
        return (mintSplits.recipients, mintSplits.bps);
    }

    function receiveMint(uint[] calldata contentIds) external payable {
        require(msg.sender == erc721);
        require(contentIds.length > 0);

        totalBalance += msg.value;
        uint valuePerToken = msg.value / contentIds.length;
        for (uint i = 0; i < contentIds.length; i++) {
            MintSplitSharedLibV1.PaymentSplit storage mintSplit = _contentMintSplits[contentIds[i]];

            // TODO: Nested loops are bad. Look for another way to do this
            for (uint j = 0; j < mintSplit.recipients.length; j++) {
                address recipient = mintSplit.recipients[j];
                uint bps = mintSplit.bps[j];
                balance[recipient] += (valuePerToken*bps/10000);
            }
        }

        emit PaymentReceived(contentIds, msg.value);
    }

    function release(address payable account) external nonReentrant {
        uint payment = balance[account];
        balance[account] = 0;
        totalBalance -= payment;
        AddressUpgradeable.sendValue(account, payment);
        emit PaymentReleased(account, payment);
    }

    // Owner
    function setRevenueSplits(MintSplitSharedLibV1.PaymentSplitConfig[] calldata splitConfigs) external onlyOwner {
        for (uint i = 0; i < splitConfigs.length; i++) {
            MintSplitSharedLibV1.PaymentSplitConfig calldata splitConfig = splitConfigs[i];
            MintSplitSharedLibV1.PaymentSplit calldata newSplit = splitConfig.split;
            require(newSplit.recipients.length == newSplit.bps.length);
            MintSplitSharedLibV1.PaymentSplit storage currentSplit;
            if (splitConfig.isMint) {
                currentSplit = _contentMintSplits[splitConfig.contentId];
            } else {
                currentSplit = _contentRoyalties[splitConfig.contentId];
            }
            currentSplit.recipients = newSplit.recipients;
            currentSplit.bps = newSplit.bps;
        }
    }

    function withdraw() public payable onlyOwner {
        (bool success, ) = payable(msg.sender).call{
            value: (address(this).balance - totalBalance)
        }("");
        require(success);
    }
}