const MintSplitERC721 = artifacts.require("MintSplitERC721");
const RevenueSplitter = artifacts.require("RevenueSplitter");
const MintSplitFactoryV1 = artifacts.require("MintSplitFactoryV1");
const MintSplitSharedLibV1 = artifacts.require("MintSplitSharedLibV1");

module.exports = function (_deployer) {
  const DEPLOYMENT_FEE = web3.utils.toWei(".19", "ether");

  // TODO: Figure out why this doesn't work in async mode

  _deployer.deploy(MintSplitSharedLibV1);

  // NOTE: You have to return the promises or it doesn't work :/
  // #1
  _deployer.deploy(MintSplitERC721).then(() =>
    // #2
    _deployer.deploy(RevenueSplitter).then(() =>
      // #3
      _deployer.deploy(
        MintSplitFactoryV1,
        MintSplitERC721.address,
        RevenueSplitter.address,
        DEPLOYMENT_FEE
      )
    )
  );
};
