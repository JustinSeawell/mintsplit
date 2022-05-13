const MintSplitERC721 = artifacts.require("MintSplitERC721");
const MintSplitFactory = artifacts.require("MintSplitFactory");
const MintSplit = artifacts.require("MintSplit");

module.exports = function (_deployer) {
  _deployer.deploy(MintSplit);

  _deployer
    .deploy(MintSplitERC721)
    .then(() => _deployer.deploy(MintSplitFactory, MintSplitERC721.address));
};
