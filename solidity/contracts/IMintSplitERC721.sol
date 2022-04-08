// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "./MintSplitSharedLib.sol";

/// @author mintsplit.io

/// @title Mint Split ERC721 Interface
interface IMintSplitERC721 is IERC165 {
    /**
    Mint one NFT
    @param cid the content id to be minted
    */
    function mint(uint cid) external payable;

    /**
    Batch Mint NFTs
    @param contentIds an array of content ids to be minted
    */
    function mintBatch(uint[] calldata contentIds) external payable;

    /**
    Add a revenue splitter contract to this contract
    @param implementation the address of a revenue splitter implementation
    @param configs data for configuring mint and royalty splits
    @param defaultMint data for configuring default mint split
    @param defaultRoyalty data for configuring default royalty split
    */
    function addRevenueSplitter(
        address implementation,
        MintSplitSharedLib.PaymentSplitConfig[] calldata configs,
        MintSplitSharedLib.PaymentSplit calldata defaultMint,
        MintSplitSharedLib.PaymentSplit calldata defaultRoyalty
    ) external;

    /**
    Set the base URI
    @param uri the default URI for all tokens
    */
    function setBaseURI(string calldata uri) external;

    /**
    Override the base URI for a specific content
    @param uri the override URI
    @param contentId the content id for the URI override
    */
    function setContentURI(string calldata uri, uint contentId) external;

    /**
    Get the params for the project
    @return params the params for the project
    */
    function getParams() external view returns (MintSplitSharedLib.ProjectParams memory params);

    /**
    Update the params for the project
    @param newParams the new project parameters
    */
    function setParams(MintSplitSharedLib.ProjectParams calldata newParams) external;
}