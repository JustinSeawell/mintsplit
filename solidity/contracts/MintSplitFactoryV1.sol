// contracts/MintSplitFactoryV1.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "./MintSplitSharedLibV1.sol";
import "./MintSplitERC721.sol";
import "./RevenueSplitter.sol";

contract MintSplitFactoryV1 is Ownable {
    address public immutable erc721Implementation;
    address public immutable revenueSplitterImplementation;
    uint public deploymentFee;
    bool public isPaused = false;

    address[] public projects;
    mapping(address => address[]) public userProjects;

    event ProjectCreated(address indexed project, address indexed payment, address indexed owner);

    constructor(address _erc721Implementation, address _revenueSplitterImplementation, uint _deploymentFee) {
        erc721Implementation = _erc721Implementation;
        revenueSplitterImplementation = _revenueSplitterImplementation;
        deploymentFee = _deploymentFee;
    }

    // External
    function createProject(
        MintSplitSharedLibV1.ProjectParams calldata _params,
        MintSplitSharedLibV1.PaymentSplitConfig[] calldata _splitConfigs
    )
        external
        payable
    {
        require(!isPaused);
        require(msg.value == deploymentFee);
        MintSplitERC721 newProject = MintSplitERC721(Clones.clone(erc721Implementation));
        RevenueSplitter newRevenueSplitter = RevenueSplitter(Clones.clone(revenueSplitterImplementation));
        
        address newProjectAddr = address(newProject);
        address newRevenueSplitterAddr = address(newRevenueSplitter);
        
        newProject.initialize(msg.sender, newRevenueSplitterAddr, _params);
        newRevenueSplitter.initialize(msg.sender, newProjectAddr, _splitConfigs);

        projects.push(newProjectAddr);
        userProjects[msg.sender].push(newProjectAddr);
        
        emit ProjectCreated(newProjectAddr, newRevenueSplitterAddr, msg.sender);
    }

    function getProjects() external view returns (address[] memory) {
        return projects;
    }

    function getUserProjects(address user) external view returns (address[] memory) {
        return userProjects[user];
    }

    // Owner
    function setIsPaused(bool _isPaused) public onlyOwner {
        isPaused = _isPaused;
    }

    function setDeploymentFee(uint _newDeploymentFee) public onlyOwner {
        deploymentFee = _newDeploymentFee;
    }

    function withdraw() public payable onlyOwner {
        (bool success, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(success);
    }
}