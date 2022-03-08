const { assert } = require("chai");
const {
  MINT_PRICE,
  createProject,
  getProjectAddress,
  getSplitterAddress,
  getTimestamp,
  advanceTimeAndBlock,
} = require("./utils");
const MintSplitFactoryV1 = artifacts.require("./MintSplitFactoryV1");
const MintSplitERC721 = artifacts.require("./MintSplitERC721");
require("chai").use(require("chai-as-promised")).should();

contract("MintSplitERC721", ([deployer, userA, userB, userC, userD, userE]) => {
  describe("Context: Proxies", () => {
    let erc721Proxy, revenueSplitterAddr, mintSplitFactory;

    before(async () => {
      mintSplitFactory = await MintSplitFactoryV1.deployed();
      const response = await createProject(mintSplitFactory, userA);
      erc721Proxy = await MintSplitERC721.at(getProjectAddress(response));
      revenueSplitterAddr = getSplitterAddress(response);
    });

    it("should be owned by the creator", async () => {
      const owner = await erc721Proxy.owner();

      assert.equal(owner, userA);
      assert.notEqual(owner, deployer);
    });

    describe("#initialize()", () => {
      it("should not be callable from the proxy contract", async () => {
        await erc721Proxy.initialize(
          userA,
          revenueSplitterAddr,
          {
            projectName: "Test Project",
            symbol: "AAA",
            contentCount: 3,
            supplyLimits: [100, 100, 100],
            mintPrice: web3.utils.toWei(".08", "ether"),
            mintLimit: 5,
            releaseTime: 0,
          },
          2000,
          {
            from: userA,
          }
        ).should.be.rejected;
      });
    });

    describe("#mint()", () => {
      it("should batch mint tokens to the caller", async () => {
        await erc721Proxy.mint([2, 2, 2], {
          from: userA,
          value: MINT_PRICE * 3,
        });
        const balance = await erc721Proxy.balanceOf(userA);

        assert.equal(balance, 3);
      });

      it("should increment the token id", async () => {
        const totalSupply = await erc721Proxy.totalSupply();
        const token1 = await erc721Proxy.tokenByIndex(0);
        const token2 = await erc721Proxy.tokenByIndex(1);
        const token3 = await erc721Proxy.tokenByIndex(2);

        assert.equal(totalSupply, 3);
        assert.equal(token1, 1);
        assert.equal(token2, 2);
        assert.equal(token3, 3);
      });

      it("should count content supply", async () => {
        const supply = await erc721Proxy.contentSupplies(2);

        assert.equal(supply, 3);
      });

      it("should assign content id and edition # to each token", async () => {
        const token1 = await erc721Proxy.tokenOfOwnerByIndex(userA, 0);
        const token2 = await erc721Proxy.tokenOfOwnerByIndex(userA, 1);
        const token3 = await erc721Proxy.tokenOfOwnerByIndex(userA, 2);

        const [token1Content, token1Edition] = await erc721Proxy.tokenSubject(
          token1
        );
        const [token2Content, token2Edition] = await erc721Proxy.tokenSubject(
          token2
        );
        const [token3Content, token3Edition] = await erc721Proxy.tokenSubject(
          token3
        );

        assert.equal(token1Content, 2);
        assert.equal(token2Content, 2);
        assert.equal(token3Content, 2);

        assert.equal(token1Edition, 1);
        assert.equal(token2Edition, 2);
        assert.equal(token3Edition, 3);
      });

      it("should require valid content ids", async () => {
        await erc721Proxy.mint([], {
          from: userA,
          value: MINT_PRICE,
        }).should.be.rejected;

        await erc721Proxy.mint([0], {
          from: userA,
          value: MINT_PRICE,
        }).should.be.rejected;

        await erc721Proxy.mint([10], {
          from: userA,
          value: MINT_PRICE,
        }).should.be.rejected;
      });

      it("should not allow minting more than the mint limit", async () => {
        // mint limit is 5
        await erc721Proxy.mint([3, 2, 1, 3, 2, 1], {
          from: userB,
          value: MINT_PRICE * 6,
        }).should.be.rejected;
      });

      it("should not require the owner to pay mint price", async () => {
        await erc721Proxy.mint([1], { from: userA }); // No value sent
        const balance = await erc721Proxy.balanceOf(userA);

        assert.equal(balance, 4);
      });

      it("should not allow minting more than the supply limit", async () => {
        // content 1 has supply limit of 1, and we already minted qty 1
        await erc721Proxy.mint([1], { from: userB, value: MINT_PRICE }).should
          .be.rejected;

        // content 2 has supply limit of 10, and we already minted 3
        await erc721Proxy.mint([2, 2, 2, 2, 2], {
          from: userB,
          value: MINT_PRICE * 5,
        });

        await erc721Proxy.mint([2, 2, 2, 2, 2], {
          from: userC,
          value: MINT_PRICE * 5,
        }).should.be.rejected;
      });

      it("should require the cost * mint amount", async () => {
        await erc721Proxy.mint([3, 3], {
          from: userB,
          // no value
        }).should.be.rejected;

        await erc721Proxy.mint([3, 3], {
          from: userB,
          value: MINT_PRICE,
        }).should.be.rejected;

        await erc721Proxy.mint([3, 3], {
          from: userB,
          value: MINT_PRICE * 20,
        }).should.be.rejected;

        await erc721Proxy.mint([3, 3], {
          from: userD,
          value: MINT_PRICE * 2,
        });
      });

      it("should not allow minting if the contract is paused", async () => {
        await erc721Proxy.setIsPaused(true, { from: userA });

        await erc721Proxy.mint([2, 2], {
          from: userB,
          value: MINT_PRICE * 2,
        }).should.be.rejected;

        await erc721Proxy.setIsPaused(false, { from: userA });
      });

      it("should forward value to the revenue splitter contract", async () => {
        const erc721Addr = await erc721Proxy.address;
        const erc721Balance = await web3.eth.getBalance(erc721Addr);
        const revenueSplitterBalance = await web3.eth.getBalance(
          revenueSplitterAddr
        );

        assert.equal(erc721Balance, 0);
        assert.equal(revenueSplitterBalance, MINT_PRICE * 10); // 10 mints so far
      });

      it("should not allow minting until after the release time", async () => {
        const now = await getTimestamp();
        mintSplitFactory = await MintSplitFactoryV1.deployed();
        const response = await createProject(mintSplitFactory, userA, {
          releaseTime: now + 1000,
        });
        const erc721 = await MintSplitERC721.at(getProjectAddress(response));

        const secondsRemainingStart = await erc721.getSecondsUntilMinting();

        await erc721.mint([3], {
          from: userE,
          value: MINT_PRICE,
        }).should.be.rejected;

        await advanceTimeAndBlock(2000); // Time passes

        const secondsRemainingEnd = await erc721.getSecondsUntilMinting();

        await erc721.mint([3], {
          from: userE,
          value: MINT_PRICE,
        });

        assert.closeTo(secondsRemainingStart.toNumber(), 1000, 10);
        assert.equal(secondsRemainingEnd, 0);
      });
    });

    describe("#maxLimit", () => {
      it("should have a max limit", async () => {
        const maxLimit = await erc721Proxy.maxLimit();
        assert.equal(maxLimit, 2000);
      });
    });

    describe("#tokenURI()", () => {
      it("should return the URI with the content id and edition #", async () => {
        const [contentId, edition] = await erc721Proxy.tokenSubject(2);
        const uri = await erc721Proxy.tokenURI(2);

        assert.equal(uri, `ipfs://aaaaaaaaaa/${contentId}-${edition}.json`);
      });
    });

    describe("#tokenSubject()", () => {
      it("should return the content id and edition # of the token", async () => {
        const [contentId, edition] = await erc721Proxy.tokenSubject(1);

        assert.equal(contentId, 2);
        assert.equal(edition, 1);
      });
    });

    describe("#getSupplyLimits()", () => {
      it("should return supply limits", async () => {
        const supplyLimits = await erc721Proxy.getSupplyLimits();
        const [limit1, limit2, limit3] = supplyLimits;

        assert.equal(supplyLimits.length, 3);
        assert.equal(limit1, 1);
        assert.equal(limit2, 10);
        assert.equal(limit3, 100);
      });
    });

    describe("#getRoyalties()", () => {
      it("should return royalties", async () => {
        const royalties = await erc721Proxy.getRoyalties(1);
        const recipients = royalties["0"];
        const bps = royalties["1"];

        assert.equal(recipients.length, 1);
        assert.equal(recipients[0], userA);
        assert.equal(bps.length, 1);
        assert.equal(bps[0], 10000);
      });
    });

    describe("#addContent()", () => {
      it("should add content", async () => {
        const newContentSupply = [100, 200, 300];
        const contentCountOld = await erc721Proxy.contentCount();

        await erc721Proxy.mint([6], {
          from: userD,
          value: MINT_PRICE,
        }).should.be.rejected;

        await erc721Proxy.addContent(newContentSupply, { from: userA });

        await erc721Proxy.mint([6], {
          from: userD,
          value: MINT_PRICE,
        });

        const contentCountNew = await erc721Proxy.contentCount();

        assert.equal(
          contentCountNew.toNumber(),
          contentCountOld.toNumber() + 3
        );
      });

      it("should only be callable by the owner", async () => {
        const newContentSupply = [100];
        await erc721Proxy.addContent(newContentSupply, { from: userB }).should
          .be.rejected;
        await erc721Proxy.addContent(newContentSupply, { from: userA });
      });
    });

    describe("#setBaseURI()", () => {
      it("should update the base URI", async () => {
        const oldUri = await erc721Proxy.tokenURI(2);

        await erc721Proxy.setBaseURI("ipfs://bbbbbbbbbb/", { from: userA });

        const newUri = await erc721Proxy.tokenURI(2);
        assert.equal(oldUri, `ipfs://aaaaaaaaaa/2-2.json`);
        assert.equal(newUri, `ipfs://bbbbbbbbbb/2-2.json`);
      });

      it("should only be callable by the owner", async () => {
        await erc721Proxy.setBaseURI("ipfs://bbbbbbbbbb/", { from: userC })
          .should.be.rejected;
        await erc721Proxy.setBaseURI("ipfs://bbbbbbbbbb/", { from: userB })
          .should.be.rejected;
        await erc721Proxy.setBaseURI("ipfs://aaaaaaaaaa/", { from: userA });
      });
    });

    describe("#setContentURI()", () => {
      it("should override the content URI", async () => {
        const token_10_uri_OLD = await erc721Proxy.tokenURI(10);
        const token_2_uri_OLD = await erc721Proxy.tokenURI(2);

        await erc721Proxy.setContentURI("ipfs://bbbbbbbbbb/", 3, {
          from: userA,
        });

        const token_10_uri_NEW = await erc721Proxy.tokenURI(10);
        const token_2_uri_NEW = await erc721Proxy.tokenURI(2);

        // Content 3 updated
        assert.equal(token_10_uri_OLD, `ipfs://aaaaaaaaaa/3-1.json`);
        assert.equal(token_10_uri_NEW, `ipfs://bbbbbbbbbb/3-1.json`);
        // Content 2 NOT updated
        assert.equal(token_2_uri_OLD, `ipfs://aaaaaaaaaa/2-2.json`);
        assert.equal(token_2_uri_NEW, `ipfs://aaaaaaaaaa/2-2.json`);
      });

      it("should revert to the base URI when setting as a blank string", async () => {
        const token_10_uri_OLD = await erc721Proxy.tokenURI(10);

        await erc721Proxy.setContentURI("", 3, {
          from: userA,
        });

        const token_10_uri_NEW = await erc721Proxy.tokenURI(10);

        assert.equal(token_10_uri_OLD, `ipfs://bbbbbbbbbb/3-1.json`); // Left over from previous test
        assert.equal(token_10_uri_NEW, `ipfs://aaaaaaaaaa/3-1.json`);
      });
    });
  });
});
