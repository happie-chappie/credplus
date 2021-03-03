const { expect } = require("chai");


describe("CredPool contract", function () {
  let CredPool;
  let hardhatCredPool;
  let depositAmount;
  let USDT;
  let contractOwner;
  let liquidityProvider;
  let addr1;
  let addr2;
  let addrs;
  let billionaireSigner;

  const billionaireAddress = "0x564286362092D8e7936f0549571a803B203aAceD";
  const USDTAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
  // depositAmount = 1000;
  depositAmount = ethers.utils.parseEther("500");

  // three accounts/signers
  // contractOwner
  // liquidityProvider
  // borrower
  beforeEach(async function () {
    // random
    // fetch the contract
    // fetching the USDT
    

    // gettting signers
    [contractOwner, liquidityProvider, borrower, ...addrs] = await ethers.getSigners();

    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [billionaireAddress]
    })

    // pulling the USDT balance of the billionaire
    // const usdtBalance = await USDT.balanceOf(billionaireAddress);
    // console.log("============");
    // console.log(usdtBalance.toString());
    billionaireSigner = await ethers.provider.getSigner(billionaireAddress);
    USDT = await ethers.getContractAt("IERC20", USDTAddress, billionaireSigner);
    CredPoolV1 = await ethers.getContractFactory("CredPoolV1", billionaireSigner);
    // const Escrow = await ethers.getContractFactory("Escrow", depositorSigner);
    // console.log(billionaireSigner);
    const credPoolAddress = ethers.utils.getContractAddress({
      from: billionaireAddress,
      nonce: (await ethers.provider.getTransactionCount(billionaireAddress))+  1,
    });
    // await USDT.connect(billionaireSigner).approve(credPoolAddress, depositAmount);
    await USDT.approve(credPoolAddress, depositAmount);

    // DOUBT: deploy vs deployed ?
    hardhatCredPoolV1 = await CredPoolV1.deploy();
    await hardhatCredPoolV1.deployed();

    // await USDT.approve(escrowAddress, deposit);

  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      // expect(await hardhatCredPool.owner()).to.equal(contractOwner.address);
      expect(await hardhatCredPoolV1.owner()).to.equal(billionaireAddress);
    });
  });

  describe("Liquidity Provider Transactions", function () {
    before(async () => {
      // await USDT.transfer(billionaireAddress, liquidityProvider.address, depositAmount);
    });

    it("Liquidity provider should have depositAmount USDT balance", async function () {
      // expect(await USDT.balanceOf(liquidityProvider.address).to.equal(depositAmount));
    });

    it("Liquidity provider should be able to deposit USDT", async function () {
      // expect(await hardhatCredPool.owner()).to.equal(contractOwner.address);
      // await hardhatCredPool.connect(billionaireSigner).deposit(depositAmount);
      // const data = await hardhatCredPool.deposit(billionaireAddress, depositAmount);
      // assert(data.totalDebtETH.gt(ethers.utils.parseEther("1")));
    });

    it("Liquidity provider should be able to withdraw USDT", async function () {
      // expect(await hardhatCredPool.owner()).to.equal(contractOwner.address);
    });

  });
  /*
  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
  // Transfer 50 tokens from owner to addr1
      await hardhatToken.transfer(addr1.address, 50);
      const addr1Balance = await hardhatToken.balanceOf(
	addr1.address
      );
      expect(addr1Balance).to.equal(50);

  // Transfer 50 tokens from addr1 to addr2
  // We use .connect(signer) to send a transaction from another account
      await hardhatToken.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await hardhatToken.balanceOf(
	addr2.address
      );
      expect(addr2Balance).to.equal(50);
    });

    it("Should fail if sender doesn’t have enough tokens", async function () {
      const initialOwnerBalance = await hardhatToken.balanceOf(
	owner.address
      );

  // Try to send 1 token from addr1 (0 tokens) to owner (1000 tokens).
  // `require` will evaluate false and revert the transaction.
      await expect(
	hardhatToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("Not enough tokens");

  // Owner balance shouldn't have changed.
      expect(await hardhatToken.balanceOf(owner.address)).to.equal(
	initialOwnerBalance
      );
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await hardhatToken.balanceOf(
	owner.address
      );

  // Transfer 100 tokens from owner to addr1.
      await hardhatToken.transfer(addr1.address, 100);

  // Transfer another 50 tokens from owner to addr2.
      await hardhatToken.transfer(addr2.address, 50);

  // Check balances.
      const finalOwnerBalance = await hardhatToken.balanceOf(
	owner.address
      );
      expect(finalOwnerBalance).to.equal(initialOwnerBalance - 150);

      const addr1Balance = await hardhatToken.balanceOf(
	addr1.address
      );
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await hardhatToken.balanceOf(
	addr2.address
      );
      expect(addr2Balance).to.equal(50);
    });
  });
  */
    /*
    const liquidityProviderAddress = ethers.utils.getContractAddress({
      from: liquidityProvider.address,
      nonce: (await ethers.provider.getTransactionCount(liquidityProvider.address))
    });
    // USDT.connect(billionaireSigner).approve(liquidityProviderAddress, depositAmount);
    let usdtBalance = await USDT.balanceOf(liquidityProvider.address);
    console.log("============");
    console.log(usdtBalance.toString());
    await USDT.transferFrom(billionaireAddress, liquidityProviderAddress, depositAmount);
    usdtBalance = await USDT.balanceOf(liquidityProvider.address);
    console.log(usdtBalance.toString());
    */
    /*
    USDT.approve(liquidityProvider.address, depositAmount);
    */
});
