const { assert } = require("chai");
const { createProject, getProjectAddress } = require("./utils");
const MintSplitFactoryV1 = artifacts.require("./MintSplitFactoryV1");
const MintSplitERC721 = artifacts.require("./MintSplitERC721");
require("chai").use(require("chai-as-promised")).should();
const BN = web3.utils.BN;

// Tests
contract("MintSplitFactoryV1", ([deployer, userA, userB, userC]) => {
  let mintSplitFactoryV1;

  before(async () => {
    mintSplitFactoryV1 = await MintSplitFactoryV1.deployed();
  });

  describe("deployment", () => {
    it("should deploy successfully", async () => {
      const address = await mintSplitFactoryV1.address;

      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it("should set the deployer as the owner", async () => {
      const owner = await mintSplitFactoryV1.owner();

      assert.equal(owner, deployer);
    });
  });

  describe("#createProject()", () => {
    it("should create a new project", async () => {
      await createProject(mintSplitFactoryV1, userA, {
        projectName: "Project 1",
      });

      const [addr1] = await mintSplitFactoryV1.getProjects();
      const project1 = await MintSplitERC721.at(addr1);
      const name1 = await project1.name();
      assert.equal(name1, "Project 1");
    });

    it("should set the owner of a new project as the caller", async () => {
      const response = await createProject(mintSplitFactoryV1, userB);
      const project = await MintSplitERC721.at(getProjectAddress(response));
      const owner = await project.owner();
      assert.equal(owner, userB);
    });

    it("should require a deployment fee", async () => {
      const value = 0;
      await createProject(mintSplitFactoryV1, userA, {}, [], value).should.be
        .rejected;
      const value2 = web3.utils.toWei(".01", "ether");
      await createProject(mintSplitFactoryV1, userA, {}, [], value2).should.be
        .rejected;
    });

    it("should emit a ProjectCreated event", async () => {
      const response = await createProject(mintSplitFactoryV1, userA);
      const eventFound = !!response.logs.find(
        ({ event }) => event == "ProjectCreated"
      );
      assert.isTrue(eventFound);
    });

    it("should fail when the contract is paused", async () => {
      mintSplitFactoryV1.setIsPaused(true, { from: deployer });
      await createProject(mintSplitFactoryV1, userA).should.be.rejected;
      mintSplitFactoryV1.setIsPaused(false, { from: deployer });
    });
  });

  describe("#getProjects", () => {
    it("should return a list of project contract addresses", async () => {
      const projects = await mintSplitFactoryV1.getProjects();

      projects.forEach(async (projectAddress) => {
        assert.ok(projectAddress);

        const project = await MintSplitERC721.at(projectAddress);
        const name = await project.name();

        assert.ok(name);
      });
    });
  });

  describe("#getUserProjects()", () => {
    it("should return a list of project addresses created by the user", async () => {
      await createProject(mintSplitFactoryV1, userC);

      const userCProjects = await mintSplitFactoryV1.getUserProjects(userC);
      const invalidUserProjects = await mintSplitFactoryV1.getUserProjects(
        deployer
      );

      assert.equal(userCProjects.length, 1);
      assert.equal(invalidUserProjects.length, 0);
    });
  });

  describe("#setPackages()", () => {
    it("should update the packages", async () => {
      const oldPackages = await mintSplitFactoryV1.getPackages();

      const [oldPackage_1] = oldPackages;
      const [oldLimit, oldFee] = oldPackage_1;
      const oldFeeEth = web3.utils.fromWei(oldFee, "ether");

      await mintSplitFactoryV1.setPackages(
        [
          [2000, web3.utils.toWei(".19", "ether")],
          [4000, web3.utils.toWei(".29", "ether")],
        ],
        { from: deployer }
      );

      const newPackages = await mintSplitFactoryV1.getPackages();
      const [newPackage_1, newPackage_2] = newPackages;
      const [newLimit_1, newFee_1] = newPackage_1;
      const [newLimit_2, newFee_2] = newPackage_2;
      const newFeeEth_1 = web3.utils.fromWei(newFee_1, "ether");
      const newFeeEth_2 = web3.utils.fromWei(newFee_2, "ether");

      assert.equal(oldPackages.length, 1);
      assert.equal(oldLimit, 2000);
      assert.equal(oldFeeEth, "0.19");

      assert.equal(newPackages.length, 2);
      assert.equal(newLimit_1, 2000);
      assert.equal(newLimit_2, 4000);
      assert.equal(newFeeEth_1, "0.19");
      assert.equal(newFeeEth_2, "0.29");
    });

    it("should only be callable by the owner", async () => {
      await mintSplitFactoryV1.setPackages(
        [
          [2000, web3.utils.toWei(".19", "ether")],
          [4000, web3.utils.toWei(".29", "ether")],
        ],
        {
          from: userA,
        }
      ).should.be.rejected;
    });
  });

  describe("#withdraw()", () => {
    it("should withdraw funds to the caller's account", async () => {
      const oldContractBalance = await web3.eth.getBalance(
        await mintSplitFactoryV1.address
      );
      const oldDeployerBalance = new BN(await web3.eth.getBalance(deployer));

      await mintSplitFactoryV1.withdraw({ from: deployer });

      const newContractBalance = await web3.eth.getBalance(
        await mintSplitFactoryV1.address
      );
      const newDeployerBalance = new BN(await web3.eth.getBalance(deployer));

      // Money moved from contract => deployer
      assert(newDeployerBalance.gt(oldDeployerBalance)); // deployer balance increases
      assert(newContractBalance < oldContractBalance); // contract balance decreases
      assert.equal(newContractBalance, 0);
    });

    it("should only be callable by the owner", async () => {
      await mintSplitFactoryV1.withdraw({ from: userA }).should.be.rejected;
      await mintSplitFactoryV1.withdraw({ from: userB }).should.be.rejected;
      await mintSplitFactoryV1.withdraw({ from: deployer });
    });
  });
});
