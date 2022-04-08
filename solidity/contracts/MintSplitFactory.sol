// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165Checker.sol";
import "./MintSplitSharedLib.sol";
import "./MintSplitERC721.sol";
import "./IMintSplitERC721.sol";
import "./RevenueSplitter.sol";
import "./IRevenueSplitter.sol";

/// @author mintsplit.io

/// @title MintSplit Factory Smart Contract
contract MintSplitFactory is Ownable {
    address public immutable ERC721Implementation;
    address public immutable revenueSplitterImplementation;
    bool public paused;
    MintSplitSharedLib.Package[] public packages;
    mapping(address => bool) public waiveFee;

    event ProjectCreated(address indexed project, address indexed owner);
    event ProjectCreatedFree(address indexed project, address indexed owner);

    /**
    @dev construct a MintSplit Factory contract
    @param _ERC721Implementation address of a deployed MintSplit ERC721 smart contract
    @param _revenueSplitterImplementation address of a deployed MintSplit Revenue Splitter smart contract
    @param _package the default fee/limit package
    */
    constructor(
        address _ERC721Implementation,
        address _revenueSplitterImplementation,
        MintSplitSharedLib.Package memory _package
    ) {
        require(ERC165Checker.supportsInterface(_ERC721Implementation, type(IMintSplitERC721).interfaceId));
        require(ERC165Checker.supportsInterface(_revenueSplitterImplementation, type(IRevenueSplitter).interfaceId));
        ERC721Implementation = _ERC721Implementation;
        revenueSplitterImplementation = _revenueSplitterImplementation;
        packages.push(_package);
    }

    /**
    Create a new MintSplit NFT project
    @dev Creates a clone ERC721 contract
    @param params the parameters for the NFT project
    */
    function createProject(
        MintSplitSharedLib.ProjectParams calldata params
    ) external payable {
        require(!paused);
        MintSplitSharedLib.Package storage p = packages[params.package];
        require(msg.value == p.fee);
        MintSplitERC721 newProject = MintSplitERC721(Clones.clone(ERC721Implementation));
        newProject.initialize(msg.sender, params, p.limit);
        emit ProjectCreated(address(newProject), msg.sender);
    }

    /**
    Create a new MintSplit NFT project for free - requires waived fee
    @dev Creates a clone ERC721 contract
    @param params the parameters for the NFT project
    */
    function createProjectFree(
        MintSplitSharedLib.ProjectParams calldata params
    ) external payable {
        require(!paused);
        require(waiveFee[msg.sender]);
        waiveFee[msg.sender] = false;
        MintSplitSharedLib.Package storage p = packages[params.package];
        MintSplitERC721 newProject = MintSplitERC721(Clones.clone(ERC721Implementation));
        newProject.initialize(msg.sender, params, p.limit);
        emit ProjectCreatedFree(address(newProject), msg.sender);
    }

    /**
    Get packages
    @return p Packages
    */
    function getPackages() external view returns (MintSplitSharedLib.Package[] memory p) {
        return packages;
    }

    /// Toggle paused state
    function togglePaused() external onlyOwner {
        paused = !paused;
    }

    /**
    Update an existing package
    @param newPackage the new package data
    @param index the index of the existing package to be replaced
    */
    function setPackage(MintSplitSharedLib.Package calldata newPackage, uint index) external onlyOwner {
        packages[index] = newPackage;
    }
    
    /**
    Add a new package
    @param newPackage the new package data
    */
    function addPackage(MintSplitSharedLib.Package calldata newPackage) external onlyOwner {
        packages.push(newPackage);
    }

    /**
    Waive the deployment fee for an address
    @param addr the address to waive deployment fee
    */
    function addWaivedFee(address addr) external onlyOwner {
        waiveFee[addr] = true;
    }

    /// Withdraw contract funds
    function withdraw() external onlyOwner {
        (bool success, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(success);
    }
}