const BN = web3.utils.BN;

exports.DEPLOYMENT_FEE = web3.utils.toWei(".19", "ether");
exports.MINT_PRICE = web3.utils.toWei(".08", "ether");

exports.createProject = async (
  factory,
  from,
  params = {},
  splits = [],
  value = this.DEPLOYMENT_FEE
) => {
  const _params = {
    projectName: "Test Project",
    symbol: "AAA",
    contentCount: 3,
    supplyLimits: [1, 10, 100],
    mintPrice: this.MINT_PRICE,
    mintLimit: 5,
    releaseTime: 0,
    baseURI: "ipfs://aaaaaaaaaa/",
    package: 0,
    ...params,
  };

  const _splitConfigs = [
    {
      contentId: 1,
      isMint: true,
      split: {
        recipients: [from],
        bps: [10000],
      },
    },
    {
      contentId: 1,
      isMint: false,
      split: {
        recipients: [from],
        bps: [10000],
      },
    },
    {
      contentId: 2,
      isMint: true,
      split: {
        recipients: [from],
        bps: [10000],
      },
    },
    {
      contentId: 2,
      isMint: false,
      split: {
        recipients: [from],
        bps: [10000],
      },
    },
  ];

  const _splits = splits.length > 0 ? splits : _splitConfigs;

  return await factory.createProject(_params, _splits, {
    from,
    value,
  });
};

exports.getProjectAddress = (response) =>
  response.logs.find(({ event }) => event == "ProjectCreated").args.project;

exports.getSplitterAddress = (response) =>
  response.logs.find(({ event }) => event == "ProjectCreated").args.payment;

exports.foundResponseType = (response, type) =>
  !!response.logs.find(({ event }) => event == type);

exports.getTimestamp = async () => {
  const blockNumber = await web3.eth.getBlockNumber();
  const block = await web3.eth.getBlock(blockNumber);

  return block.timestamp;
};

exports.advanceTime = (time) => {
  return new Promise((resolve, reject) => {
    web3.currentProvider.send(
      {
        jsonrpc: "2.0",
        method: "evm_increaseTime",
        params: [time],
        id: new Date().getTime(),
      },
      (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      }
    );
  });
};

exports.advanceBlock = () => {
  return new Promise((resolve, reject) => {
    web3.currentProvider.send(
      {
        jsonrpc: "2.0",
        method: "evm_mine",
        id: new Date().getTime(),
      },
      (err, result) => {
        if (err) {
          return reject(err);
        }
        const newBlockHash = web3.eth.getBlock("latest").hash;

        return resolve(newBlockHash);
      }
    );
  });
};

exports.advanceTimeAndBlock = async (time) => {
  await this.advanceTime(time);
  await this.advanceBlock();
  return Promise.resolve(web3.eth.getBlock("latest"));
};
