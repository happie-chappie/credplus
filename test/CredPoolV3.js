const { expect } = require("chai");

describe("CredPoolV3 contract", function () {
  let CredPoolV3;
  let hardhatCredPoolV3;
  let CToken;
  let hardhatCToken;
  let DAI;
  let billionaireSigner;
  let credPoolAddress;
  let borrower;
  let lender;
  let balances;

  const BILLIONAIRE_ADDRESS = "0x564286362092D8e7936f0549571a803B203aAceD";
  const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const INITIAL_DAI = 300000;
  const INITIAL_CTOKENS = 330000;
  const BORROWING_DAI = 1000;
  const LENDING_DAI = 1000;
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
    CredPoolV3 = await ethers.getContractFactory("CredPoolV3", billionaireSigner);
    CToken = await ethers.getContractFactory("CToken", billionaireSigner);

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
    hardhatCredPoolV3 = await CredPoolV3.deploy();
    await hardhatCredPoolV3.deployed();

    hardhatCToken = await CToken.deploy(credPoolAddress);
    await hardhatCToken.deployed();
  });

  // TODO: have to create a state specific workflow
  // credPoolDAIReserverBalance = await DAI.balanceOf(credPoolAddress);
  // credPoolDAIReserverBalance = credPoolDAIReserverBalance.toString();
  // console.log(credPoolDAIReserverBalance);
  // let credPoolAddressETHBalance = await ethers.provider.getBalance(credPoolAddress);
  // credPoolAddressETHBalance = credPoolAddressETHBalance.toString();
  // console.log(credPoolAddressETHBalance);
  describe("Deployment of CredPoolV3 & CToken & owner establishment for CredPoolV3", function () {
    it("Should set the right owner", async function () {
      expect(await hardhatCredPoolV3.owner()).to.equal(BILLIONAIRE_ADDRESS);
    });
  });

  describe("State 0: Initial state of the reserve pool", function () {
    it("Should set the initial reserve pool DAI balance to 300k", async function () {
      expect(await DAI.balanceOf(credPoolAddress)).to.equal(INITIAL_DAI);
    });

    it("Should set the initial reserve pool CToken balance to 300k", async function () {
      expect(await hardhatCToken.balanceOf(credPoolAddress)).to.equal(INITIAL_CTOKENS);
    });

    it("Should set the initial supply of CTokens to 330k", async function () {
      expect(await hardhatCToken.totalSupply()).to.equal(INITIAL_CTOKENS);
    });

    it("Borrower should have zero DAI balance", async function (){
      expect(await DAI.balanceOf(borrower.address)).to.equal(0);
    });
  });

  describe("State 1: Borrower borrowing transactions", function () {
    before(async () => {
      // borrowing from the CredPoolV3
      await hardhatCredPoolV3.connect(borrower).borrow(BORROWING_DAI, hardhatCToken.address);
    });

    it("Should decrease the reserve DAI pool size by 1k", async function () {
      // check the reserve DAI balance of the pool
      expect(await DAI.balanceOf(credPoolAddress)).to.equal(INITIAL_DAI - BORROWING_DAI);
    });

    it("Should increase the borrower DAI balance by 1k", async function () {
      // check the borrower DAI balance
      expect(await DAI.balanceOf(borrower.address)).to.equal(BORROWING_DAI);
    });

    it("Should increase the reserve CTokens balance by 1k", async function () {
      expect(await hardhatCToken.balanceOf(credPoolAddress)).to.equal(INITIAL_CTOKENS + BORROWING_DAI);
      // TODO: why is the total supply not increasing ?
      // expect(await hardhatCToken.totalSupply()).to.equal(INITIAL_CTOKENS);
    });
  });

  describe("State 2: Lender depositing transactions", function () {
    before(async () => {
      // tranfering DAI from billionaire to the lender
      await DAI.connect(billionaireSigner).transfer(lender.address, LENDING_DAI);
      // lender approving CredPoolV2 to spend DAI
      await DAI.connect(lender).approve(credPoolAddress, LENDING_DAI);
      // lender depositing to the CredPoolV2
      await hardhatCredPoolV3.connect(lender).deposit(LENDING_DAI, hardhatCToken.address);
    });

    it("Lender should have zero DAI balance", async function (){
      expect(await DAI.balanceOf(lender.address)).to.equal(0);
    });

    it("Should increase the reserve DAI pool size by 1k", async function () {
      // check the reserve DAI balance of the pool
      expect(await DAI.balanceOf(credPoolAddress)).to.equal(INITIAL_DAI);
    });

    it("Should decrease the reserve CTokens balance by 1k", async function () {
      expect(await hardhatCToken.balanceOf(credPoolAddress)).to.equal(INITIAL_CTOKENS);
    });

    it("Should increase the lender CTokens balance by 1k", async function () {
      expect(await hardhatCToken.balanceOf(lender.address)).to.equal(LENDING_DAI);
    });
  });

});
