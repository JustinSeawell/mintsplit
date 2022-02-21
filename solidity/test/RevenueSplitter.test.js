const { assert } = require("chai");
const {
  MINT_PRICE,
  createProject,
  getProjectAddress,
  getSplitterAddress,
  foundResponseType,
} = require("./utils");
const MintSplitFactoryV1 = artifacts.require("./MintSplitFactoryV1");
const MintSplitERC721 = artifacts.require("./MintSplitERC721");
const RevenueSplitter = artifacts.require("./RevenueSplitter");
require("chai").use(require("chai-as-promised")).should();
const BN = web3.utils.BN;

contract("RevenueSplitter", ([deployer, userA, userB, userC, userD]) => {
  let SPLIT_CONFIGS;

  before(async () => {
    SPLIT_CONFIGS = [
      // Mint
      {
        contentId: 1,
        isMint: true,
        split: {
          recipients: [userA],
          bps: [10000],
        },
      },
      {
        contentId: 2,
        isMint: true,
        split: {
          recipients: [userA, userB],
          bps: [5000, 5000],
        },
      },
      // Royalties
      {
        contentId: 1,
        isMint: false,
        split: {
          recipients: [userA],
          bps: [10000],
        },
      },
      {
        contentId: 2,
        isMint: false,
        split: {
          recipients: [userA, userB],
          bps: [5000, 5000],
        },
      },
    ];
  });

  describe("Context: Proxies", () => {
    let splitterProxy, erc721, mintSplitFactory;

    before(async () => {
      mintSplitFactory = await MintSplitFactoryV1.deployed();
      const response = await createProject(
        mintSplitFactory,
        userA,
        {},
        SPLIT_CONFIGS
      );
      splitterProxy = await RevenueSplitter.at(getSplitterAddress(response));
      erc721 = await MintSplitERC721.at(getProjectAddress(response));
    });

    it("should be owned by the creator", async () => {
      const owner = await splitterProxy.owner();

      assert.equal(owner, userA);
      assert.notEqual(owner, deployer);
    });

    describe("#initialize()", () => {
      it("should not be callable from the proxy contract", async () => {
        const erc721Addr = await erc721.address;
        await splitterProxy.initialize(userA, erc721Addr, SPLIT_CONFIGS, {
          from: userA,
        }).should.be.rejected;
      });

      it("should require split config recipient & bps lengths to be equal", async () => {
        const splitConfigs = [
          {
            contentId: 2,
            isMint: false,
            split: {
              recipients: [userA], // length = 1
              bps: [5000, 5000], // length = 2
            },
          },
        ];

        await createProject(mintSplitFactory, userA, {}, splitConfigs).should.be
          .rejected;
      });
    });

    describe("#getContentRoyalties()", () => {
      it("should return the correct royalties per content id", async () => {
        const royalties_1 = await splitterProxy.getContentRoyalties(1);
        const royalties_2 = await splitterProxy.getContentRoyalties(2);

        const recipients_1 = royalties_1["0"];
        const bps_1 = royalties_1["1"];
        const recipients_2 = royalties_2["0"];
        const bps_2 = royalties_2["1"];

        // Content 1
        assert.equal(recipients_1.length, 1);
        assert.equal(bps_1.length, 1);
        assert.equal(recipients_1[0], userA);
        assert.equal(bps_1[0], 10000);
        // Content 2
        assert.equal(recipients_2.length, 2);
        assert.equal(bps_2.length, 2);
        assert.equal(recipients_2[0], userA);
        assert.equal(recipients_2[1], userB);
        assert.equal(bps_2[0], 5000);
        assert.equal(bps_2[1], 5000);
      });
    });

    describe("#receiveMint()", () => {
      it("should receive funds when tokens are minted", async () => {
        const splitterAddr = await splitterProxy.address;
        const balanceBefore = await web3.eth.getBalance(splitterAddr);

        // receiveMint() is called by the ERC721 sibling contract
        await erc721.mint([2], {
          from: userC,
          value: MINT_PRICE,
        });

        const balanceAfter = await web3.eth.getBalance(splitterAddr);

        assert.equal(balanceBefore, 0);
        assert.equal(balanceAfter, MINT_PRICE);
      });

      it("should increase the balance of the recipient by the correct amount", async () => {
        await erc721.mint([1, 2, 2, 2], {
          from: userC,
          value: MINT_PRICE * 4,
        });

        const balanceA = await splitterProxy.balance(userA);
        const balanceB = await splitterProxy.balance(userB);

        /**
         * - Minted content #2 x 1 in the previous test case = .5 for each
         * - Minted content #1 x 1 in this test case = 1 for userA
         * - Minted content #2 x 3 in this test case = 1.5 for each
         *
         * - User A: .5 + 1 + 1.5 = 3
         * - User B: .5 + 1.5 = 2
         */
        assert.equal(balanceA, MINT_PRICE * 3);
        assert.equal(balanceB, MINT_PRICE * 2);
      });

      // TODO: Figure out how to capture these events
      // it("should emit a payment received event", async () => {});

      it("should only be called by the ERC721 contract", async () => {
        await splitterProxy.receiveMint([2, 2, 2], { from: userC }).should.be
          .rejected;
      });

      describe("#release()", () => {
        it("should release funds to recipients", async () => {
          const oldBalanceA = await web3.eth.getBalance(userA);
          const oldBalanceB = await web3.eth.getBalance(userB);

          await erc721.mint([2, 2, 2, 2], {
            from: userD,
            value: MINT_PRICE * 4,
          });

          await splitterProxy.release(userA);
          await splitterProxy.release(userB);

          const newBalanceA = await web3.eth.getBalance(userA);
          const newBalanceB = await web3.eth.getBalance(userB);

          const contractBalanceA = await splitterProxy.balance(userA);
          const contractBalanceB = await splitterProxy.balance(userB);

          assert.isTrue(newBalanceA > oldBalanceA);
          assert.isTrue(newBalanceB > oldBalanceB);
          assert.equal(contractBalanceA, 0);
          assert.equal(contractBalanceB, 0);
        });

        it("should emit a payment released event", async () => {
          const response = await splitterProxy.release(userA);
          const eventFound = foundResponseType(response, "PaymentReleased");
          assert.isTrue(eventFound);
        });
      });

      describe("#setRevenueSplits()", () => {
        it("should update revenue splits (case 1)", async () => {
          const mintSplits_OLD = await splitterProxy.getContentMintSplits(1);
          const mintRecipients_OLD = mintSplits_OLD["0"];
          const mintBps_OLD = mintSplits_OLD["1"];

          const royalties_OLD = await splitterProxy.getContentRoyalties(1);
          const royaltyRecipients_OLD = royalties_OLD["0"];
          const royaltyBps_OLD = royalties_OLD["1"];

          assert.equal(mintRecipients_OLD.length, 1);
          assert.equal(mintBps_OLD.length, 1);
          assert.equal(royaltyRecipients_OLD.length, 1);
          assert.equal(royaltyBps_OLD.length, 1);

          await splitterProxy.setRevenueSplits(
            [
              {
                contentId: 1,
                isMint: true,
                split: {
                  recipients: [userA, userB, userC],
                  bps: [3400, 3300, 3300],
                },
              },
              {
                contentId: 1,
                isMint: false,
                split: {
                  recipients: [userA, userB],
                  bps: [5000, 5000],
                },
              },
            ],
            { from: userA }
          );

          const mintSplits_NEW = await splitterProxy.getContentMintSplits(1);
          const mintRecipients_NEW = mintSplits_NEW["0"];
          const mintBps_NEW = mintSplits_NEW["1"];

          const royalties_NEW = await splitterProxy.getContentRoyalties(1);
          const royaltyRecipients_NEW = royalties_NEW["0"];
          const royaltyBps_NEW = royalties_NEW["1"];

          assert.equal(mintRecipients_NEW.length, 3);
          assert.sameOrderedMembers(mintRecipients_NEW, [userA, userB, userC]);
          assert.equal(mintBps_NEW.length, 3);
          assert.sameOrderedMembers(
            mintBps_NEW.map((n) => n.toNumber()),
            [3400, 3300, 3300]
          );
          assert.equal(royaltyRecipients_NEW.length, 2);
          assert.sameOrderedMembers(royaltyRecipients_NEW, [userA, userB]);
          assert.equal(royaltyBps_NEW.length, 2);
          assert.sameOrderedMembers(
            royaltyBps_NEW.map((n) => n.toNumber()),
            [5000, 5000]
          );
        });

        it("should update revenue splits (case 2)", async () => {
          const mintSplits_OLD = await splitterProxy.getContentMintSplits(2);
          const mintRecipients_OLD = mintSplits_OLD["0"];
          const mintBps_OLD = mintSplits_OLD["1"];

          const royalties_OLD = await splitterProxy.getContentRoyalties(2);
          const royaltyRecipients_OLD = royalties_OLD["0"];
          const royaltyBps_OLD = royalties_OLD["1"];

          assert.equal(mintRecipients_OLD.length, 2);
          assert.equal(mintBps_OLD.length, 2);
          assert.equal(royaltyRecipients_OLD.length, 2);
          assert.equal(royaltyBps_OLD.length, 2);

          await splitterProxy.setRevenueSplits(
            [
              {
                contentId: 2,
                isMint: true,
                split: {
                  recipients: [userA],
                  bps: [10000],
                },
              },
              {
                contentId: 2,
                isMint: false,
                split: {
                  recipients: [userA],
                  bps: [10000],
                },
              },
            ],
            { from: userA }
          );

          const mintSplits_NEW = await splitterProxy.getContentMintSplits(2);
          const mintRecipients_NEW = mintSplits_NEW["0"];
          const mintBps_NEW = mintSplits_NEW["1"];

          const royalties_NEW = await splitterProxy.getContentRoyalties(2);
          const royaltyRecipients_NEW = royalties_NEW["0"];
          const royaltyBps_NEW = royalties_NEW["1"];

          assert.equal(mintRecipients_NEW.length, 1);
          assert.sameOrderedMembers(mintRecipients_NEW, [userA]);
          assert.equal(mintBps_NEW.length, 1);
          assert.sameOrderedMembers(
            mintBps_NEW.map((n) => n.toNumber()),
            [10000]
          );
          assert.equal(royaltyRecipients_NEW.length, 1);
          assert.sameOrderedMembers(royaltyRecipients_NEW, [userA]);
          assert.equal(royaltyBps_NEW.length, 1);
          assert.sameOrderedMembers(
            royaltyBps_NEW.map((n) => n.toNumber()),
            [10000]
          );
        });

        it("should update revenue splits (case 3)", async () => {
          const mintSplits_OLD = await splitterProxy.getContentMintSplits(3);
          const mintRecipients_OLD = mintSplits_OLD["0"];
          const mintBps_OLD = mintSplits_OLD["1"];

          const royalties_OLD = await splitterProxy.getContentRoyalties(3);
          const royaltyRecipients_OLD = royalties_OLD["0"];
          const royaltyBps_OLD = royalties_OLD["1"];

          assert.equal(mintRecipients_OLD.length, 0);
          assert.equal(mintBps_OLD.length, 0);
          assert.equal(royaltyRecipients_OLD.length, 0);
          assert.equal(royaltyBps_OLD.length, 0);

          await splitterProxy.setRevenueSplits(
            [
              {
                contentId: 3,
                isMint: true,
                split: {
                  recipients: [userA, userB],
                  bps: [5000, 5000],
                },
              },
              {
                contentId: 3,
                isMint: false,
                split: {
                  recipients: [userA],
                  bps: [10000],
                },
              },
            ],
            { from: userA }
          );

          const mintSplits_NEW = await splitterProxy.getContentMintSplits(3);
          const mintRecipients_NEW = mintSplits_NEW["0"];
          const mintBps_NEW = mintSplits_NEW["1"];

          const royalties_NEW = await splitterProxy.getContentRoyalties(3);
          const royaltyRecipients_NEW = royalties_NEW["0"];
          const royaltyBps_NEW = royalties_NEW["1"];

          assert.equal(mintRecipients_NEW.length, 2);
          assert.sameOrderedMembers(mintRecipients_NEW, [userA, userB]);
          assert.equal(mintBps_NEW.length, 2);
          assert.sameOrderedMembers(
            mintBps_NEW.map((n) => n.toNumber()),
            [5000, 5000]
          );
          assert.equal(royaltyRecipients_NEW.length, 1);
          assert.sameOrderedMembers(royaltyRecipients_NEW, [userA]);
          assert.equal(royaltyBps_NEW.length, 1);
          assert.sameOrderedMembers(
            royaltyBps_NEW.map((n) => n.toNumber()),
            [10000]
          );
        });

        it("should only be callable by the owner", async () => {
          const newSplits = [
            {
              contentId: 3,
              isMint: true,
              split: {
                recipients: [userA, userB],
                bps: [5000, 5000],
              },
            },
            {
              contentId: 3,
              isMint: false,
              split: {
                recipients: [userA],
                bps: [10000],
              },
            },
          ];

          await splitterProxy.setRevenueSplits(newSplits, { from: userC })
            .should.be.rejected;
          await splitterProxy.setRevenueSplits(newSplits, { from: userB })
            .should.be.rejected;
          await splitterProxy.setRevenueSplits(newSplits, { from: userA });
        });
      });

      describe("#withdraw()", () => {
        it("should only be callable by the owner", async () => {
          await splitterProxy.withdraw({ from: userC }).should.be.rejected;
          await splitterProxy.withdraw({ from: userB }).should.be.rejected;
          await splitterProxy.withdraw({ from: userA });
        });
      });
    });
  });
});
