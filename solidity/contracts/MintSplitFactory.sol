// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "./MintSplit.sol";
import "./MintSplitERC721.sol";

/// @author mintsplit.io

/// @title MintSplit Factory Smart Contract
contract MintSplitFactory is Ownable {
    event ProjectCreated(address indexed project, address indexed owner);

    address public immutable erc721;
    uint public baseTokenFee;
    uint divider;
    uint discount;
    bool public paused;

     /**
    Construct a MintSplit factory
    @param _erc721 address of a deployed MintSplitERC721 smart contract implementation
    */
    constructor (address _erc721) {
        erc721 = _erc721;
        baseTokenFee = 950000000000000; // 0.00095 eth
        divider = 1000;
        discount = 500000000000000000; // 0.5 ether
    }

    /**
    Create a new MintSplit project
    @dev clone a MintSplit ERC721 smart contract implementation
    @param params the parameters for the ERC721 contract
    @param editions the editions for each piece of content
    */
    function createProject(
        MintSplit.Params calldata params,
        uint256[] calldata editions
    ) external payable {
        require(!paused);
        require(msg.value == tokenFee(_sumArray(editions)));
        MintSplitERC721 newProject = MintSplitERC721(Clones.clone(erc721));
        newProject.initialize(msg.sender, address(this), params, editions);
        emit ProjectCreated(address(newProject), msg.sender);
    }

    /**
    Add content to the MintSplit project
    @param existingProject the address of an existing MintSplit ERC721 clone
    @param content the content data to be added
    */
    function addContent(address existingProject, MintSplit.Content calldata content) external payable {
        MintSplitERC721 project = MintSplitERC721(existingProject);
        require(project.owner() == _msgSender());
        require(msg.value == tokenFee(content.editions));
        project.addContent(content);
    }
    
    /**
    Update content on the MintSplit project
    @param existingProject the address of an existing MintSplit ERC721 clone
    @param content the content data for updating
    */
    function setContent(address existingProject, MintSplit.Content calldata content) external payable {
        require(content.id > 0);
        MintSplitERC721 project = MintSplitERC721(existingProject);
        require(project.owner() == _msgSender());
        require(content.editions >= project.contentSupply(content.id));   
        uint256 current = project.editions(content.id-1);
        if (content.editions > current) require(msg.value == tokenFee(content.editions - current));
        project.setContent(content);
    }

    /**
    Calculates the fee for creating tokens
    @param qty the quantity of tokens to be created
    @return fee the fee for creating the tokens
    */
    function tokenFee(uint256 qty) public view returns (uint256) {
        if (qty == 0) return 0;
        return (qty * baseTokenFee) - ((qty / divider) * discount);
    }

    /// Toggle paused state
    function togglePaused() external onlyOwner {
        paused = !paused;
    }

    /**
    Set new base token fee
    @param newBaseTokenFee the new base token fee to be multiplied by the quantity
    */
    function setBaseTokenFee(uint newBaseTokenFee) external onlyOwner {
        baseTokenFee = newBaseTokenFee;
    }

    /**
    Set new divider
    @param newDivider the new divider used to determine the tier per token qty
    */
    function setDivider(uint newDivider) external onlyOwner {
        divider = newDivider;
    }

    /**
    Set new discount
    @param newDiscount the new discount value to be multiplied by tier
    */
    function setDiscount(uint newDiscount) external onlyOwner {
        discount = newDiscount;
    }

    /// Withdraw contract funds
    function withdraw() external onlyOwner {
        (bool success, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(success);
    }

    /**
    Sum an array of numbers
    @return result the sum of the numbers in the array
    */
    function _sumArray(uint256[] calldata arr) internal pure returns (uint256) {
        uint256 sum;
        for (uint256 i; i < arr.length; i++) {
            sum += arr[i];
        }
        return sum;
    }
}