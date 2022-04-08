const MintSplitERC721 = artifacts.require("MintSplitERC721");
const RevenueSplitter = artifacts.require("RevenueSplitter");
const MintSplitFactory = artifacts.require("MintSplitFactory");
const MintSplitSharedLib = artifacts.require("MintSplitSharedLib");

module.exports = function (_deployer) {
  const DEPLOYMENT_FEE = web3.utils.toWei(".19", "ether");
  const LIMIT = 2001;

  const defaultPackage = {
    fee: DEPLOYMENT_FEE,
    limit: LIMIT,
  };

  // TODO: Figure out why this doesn't work in async mode

  _deployer.deploy(MintSplitSharedLib);

  // NOTE: You have to return the promises or it doesn't work :/
  // #1
  _deployer.deploy(MintSplitERC721).then(() =>
    // #2
    _deployer.deploy(RevenueSplitter).then(() =>
      // #3
      _deployer.deploy(
        MintSplitFactory,
        MintSplitERC721.address,
        RevenueSplitter.address,
        defaultPackage
      )
    )
  );
};
