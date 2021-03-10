const { expect } = require("chai");


describe("CredPoolV2 contract", function () {
  let CredPoolV2;
  let hardhatCredPoolV2;
  let DAI;
  let billionaireSigner;
  let credPoolAddress;
  let borrower;
  let lender;
  let balances;

  const BILLIONAIRE_ADDRESS = "0x564286362092D8e7936f0549571a803B203aAceD";
  const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const INITIAL_DAI = 100000;
  const BORROWING_DAI = 10000;
  const LENDING_DAI = 10000;
  // depositAmount = 1000;
  // depositAmount = ethers.utils.parseEther("500");

  // TODO: Check that billionaire has enough money
  // TODO: move the global consts to a seperate module
  // three accounts/signers
  before(async function () {

    // gettting signers
    [borrower, lender, ...addrs] = await ethers.getSigners();

    // impersonating the billionaire
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [BILLIONAIRE_ADDRESS]
    })

    billionaireSigner = await ethers.provider.getSigner(BILLIONAIRE_ADDRESS);
    DAI = await ethers.getContractAt("IERC20", DAI_ADDRESS, billionaireSigner);
    CredPoolV2 = await ethers.getContractFactory("CredPoolV2", billionaireSigner);

    credPoolAddress = ethers.utils.getContractAddress({
      from: BILLIONAIRE_ADDRESS,
      nonce: (await ethers.provider.getTransactionCount(BILLIONAIRE_ADDRESS))+  1,
    });

    // approve INITIAL_DAI to the creditPool
    await DAI.approve(credPoolAddress, INITIAL_DAI);

    // approve LENDING_DAI to the lender
    // await DAI.approve(lender.address, LENDING_DAI);
    // transfer 10K DAI to lender
    // await DAI.connect(billionaireSigner).transfer(lender.address, LENDING_DAI);

    hardhatCredPoolV2 = await CredPoolV2.deploy();
    await hardhatCredPoolV2.deployed();
  });

  // credPoolDAIReserverBalance = await DAI.balanceOf(credPoolAddress);
  // credPoolDAIReserverBalance = credPoolDAIReserverBalance.toString();
  // console.log(credPoolDAIReserverBalance);
  describe("Deployment & owner establishment", function () {
    it("Should set the right owner", async function () {
      expect(await hardhatCredPoolV2.owner()).to.equal(BILLIONAIRE_ADDRESS);
    });
  });

  describe("Initial state of the reserve pool", function () {
    it("Should set the initial reserve pool to 100k", async function () {
      expect(await DAI.balanceOf(credPoolAddress)).to.equal(INITIAL_DAI);
    });

    it("Borrower should have zero DAI balance", async function (){
      expect(await DAI.balanceOf(borrower.address)).to.equal(0);
    });

  });

  describe("Borrower borrowing transactions", function () {
    before(async () => {
      // borrowing from the CredPoolV2
      await hardhatCredPoolV2.connect(borrower).borrow(BORROWING_DAI);
    });

    it("Should decrease the reserve DAI pool size by 10k", async function () {
      // check the reserve DAI balance of the pool
      expect(await DAI.balanceOf(credPoolAddress)).to.equal(INITIAL_DAI - BORROWING_DAI);
    });

    it("Should increase the borrower DAI balance by 10k", async function () {
      // check the borrower DAI balance
      expect(await DAI.balanceOf(borrower.address)).to.equal(BORROWING_DAI);
    });
  });

  describe("Borrower repaying transactions", function () {
    before(async () => {
      // we approve the CredPoolV2 to move DAI funds from borrower
      await DAI.connect(borrower).approve(credPoolAddress, BORROWING_DAI);
      await hardhatCredPoolV2.connect(borrower).repay(BORROWING_DAI);
    });

    it("Should increase the reserve DAI pool size by 10k", async function () {
      // check the reserve DAI balance of the pool
      expect(await DAI.balanceOf(credPoolAddress)).to.equal(INITIAL_DAI);
    });

    it("Should decrease the borrower DAI balance to zero", async function () {
      // check the borrower DAI balance
      expect(await DAI.balanceOf(borrower.address)).to.equal(0);
    });
  });

  /*
      balances = await DAI.balanceOf(lender.address);
      balances = balances.toString();
      console.log(balances);
  */
  describe("Lender depositing transactions", function () {
    before(async () => {
      // tranfering DAI from billionaire to the lender
      await DAI.connect(billionaireSigner).transfer(lender.address, LENDING_DAI);
      // borrowing from the CredPoolV2
      await DAI.connect(lender).approve(credPoolAddress, LENDING_DAI);
      await hardhatCredPoolV2.connect(lender).deposit(LENDING_DAI);
    });

    it("Lender should have zero DAI balance", async function (){
      expect(await DAI.balanceOf(lender.address)).to.equal(0);
    });

    it("Should increase the reserve DAI pool size by 10k", async function () {
      // check the reserve DAI balance of the pool
      expect(await DAI.balanceOf(credPoolAddress)).to.equal(INITIAL_DAI + LENDING_DAI);
    });
  });

  describe("Lender withdrawing transactions", function () {
    before(async () => {
      await hardhatCredPoolV2.connect(lender).withdraw(LENDING_DAI);
    });

    it("Lender should have 10k DAI balance", async function (){
      expect(await DAI.balanceOf(lender.address)).to.equal(LENDING_DAI);
    });

    it("Should decrease the reserve DAI pool size by 10k", async function () {
      // check the reserve DAI balance of the pool
      expect(await DAI.balanceOf(credPoolAddress)).to.equal(INITIAL_DAI);
    });
  });
});
