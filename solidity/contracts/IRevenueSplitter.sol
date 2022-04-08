// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "./MintSplitSharedLib.sol";

/// @author mintsplit.io

/// @title Revenue Splitter interface
interface IRevenueSplitter is IERC165 {
    /**
    Receive mint funds and split by content id
    @param cid content id that was minted    
    */
    function receiveMint(uint cid) external payable;

    /**
    Receive batch mint funds and split by content id
    @param contentIds content ids that were minted    
    */
    function receiveMintBatch(uint[] calldata contentIds) external payable;

    /**
    Get mint splits
    @param cid id of content for getting mint split data
    @return recipients_ addresses of the split recipients
    @return bps basis points of split recipients
    */
    function getMintSplits(uint cid) external view returns(address payable[] memory recipients_, uint256[] memory bps);

    /**
    Get mint splits
    @param cid id of content for getting royalty split data
    @return recipients_ addresses of the split recipients
    @return bps basis points of split recipients
    */
    function getRoyaltySplits(uint cid) external view returns(address payable[] memory recipients_, uint256[] memory bps);

    /**
    Release funds to user
    @param account address of user whom to release funds    
    */
    function release(address payable account) external;

    /**
    Set revenue splits
    @param configs data for configuring mint and royalty splits
    */
    function setSplits(MintSplitSharedLib.PaymentSplitConfig[] calldata configs) external;

    /**
    Set default revenue splits
    @dev config.contentId is ignored here
    @param config data for configuring default mint and royalty splits
    */
    function setDefaultSplit(MintSplitSharedLib.PaymentSplitConfig calldata config) external;
}