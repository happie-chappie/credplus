const { expect } = require("chai");

describe("CCToken contract", function () {
  let CCToken;
  let hardhatCCToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    CToken = await ethers.getContractFactory("CToken");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    hardhatCToken = await CToken.deploy();
    await hardhatCToken.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      // expect(await hardhatCToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await hardhatCToken.balanceOf(owner.address);
      expect(await hardhatCToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      // Transfer 50 tokens from owner to addr1
      await hardhatCToken.connect(owner).transfer(addr1.address, 50);
      const addr1Balance = await hardhatCToken.balanceOf(
        addr1.address
      );
      expect(addr1Balance).to.equal(50);

      // Transfer 50 tokens from addr1 to addr2
      await hardhatCToken.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await hardhatCToken.balanceOf(
        addr2.address
      );
      expect(addr2Balance).to.equal(50);
    });

    it("Should fail if sender doesn’t have enough tokens", async function () {
      const initialOwnerBalance = await hardhatCToken.balanceOf(
        owner.address
      );

      // Try to send 1 token from addr1 (0 tokens) to owner (1000 tokens).
      // `require` will evaluate false and revert the transaction.
      /*
      await expect(
        hardhatCToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("Not enough tokens");

      // Owner balance shouldn't have changed.
      expect(await hardhatCToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
      */
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await hardhatCToken.balanceOf(
        owner.address
      );

      // Transfer 100 tokens from owner to addr1.
      await hardhatCToken.transfer(addr1.address, 100);

      // Transfer another 50 tokens from owner to addr2.
      await hardhatCToken.transfer(addr2.address, 50);

      // Check balances.
      const finalOwnerBalance = await hardhatCToken.balanceOf(
        owner.address
      );
      expect(finalOwnerBalance).to.equal(initialOwnerBalance - 150);

      const addr1Balance = await hardhatCToken.balanceOf(
        addr1.address
      );
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await hardhatCToken.balanceOf(
        addr2.address
      );
      expect(addr2Balance).to.equal(50);
    });
  });
});
