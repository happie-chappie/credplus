const { expect } = require("chai");

describe("CredPoolV5 contract", function () {
  let CredPoolV5;
  let hardhatCredPoolV5;
  let CTokenV3;
  let hardhatCTokenV3;
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
    CredPoolV5 = await ethers.getContractFactory("CredPoolV5", billionaireSigner);
    CTokenV3 = await ethers.getContractFactory("CTokenV3", billionaireSigner);

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
    hardhatCredPoolV5 = await CredPoolV5.deploy(DAI_ADDRESS);
    await hardhatCredPoolV5.deployed();

    hardhatCTokenV3 = await CTokenV3.deploy(credPoolAddress);
    await hardhatCTokenV3.deployed();
  });

  // TODO: have to create a state specific workflow
  // credPoolDAIReserverBalance = await DAI.balanceOf(credPoolAddress);
  // credPoolDAIReserverBalance = credPoolDAIReserverBalance.toString();
  // console.log(credPoolDAIReserverBalance);
  // let credPoolAddressETHBalance = await ethers.provider.getBalance(credPoolAddress);
  // credPoolAddressETHBalance = credPoolAddressETHBalance.toString();
  // console.log(credPoolAddressETHBalance);
  describe("Deployment of CredPoolV5 & CTokenV3 & owner establishment for CredPoolV5", function () {
    it("Should set the right owner", async function () {
      expect(await hardhatCredPoolV5.owner()).to.equal(BILLIONAIRE_ADDRESS);
    });
  });

  describe("Testing the CredPoolV5 views", function () {
    it("Should get pool DAI balance and it should be equal to 300k", async function () {
      expect(await hardhatCredPoolV5.getDAIBalance()).to.equal(INITIAL_DAI);
    });

    it("Should get pool CTokenV3s balance and it should be equal to 300k", async function () {
      expect(await hardhatCredPoolV5.getCredTokenBalance(hardhatCTokenV3.address)).to.equal(INITIAL_CTOKENS);
    });

    it("Should get borrower DAI balance and it should be equal to 0", async function () {
      expect(await hardhatCredPoolV5.connect(borrower).getUserDAIBalance()).to.equal(0);
    });

    it("Should get borrower CTokenV3s balance and it should be equal to 0", async function () {
      expect(await hardhatCredPoolV5.connect(borrower).getUserCredTokenBalance(hardhatCTokenV3.address)).to.equal(0);
    });

    it("Should set the current interest rate to 10", async function (){
      expect(await hardhatCredPoolV5.getCurrentInterestRateView()).to.equal(10);
    });

    it("Should set the pool start date and end date", async function (){
      const [startdate, enddate] = await hardhatCredPoolV5.getPoolMaturityDates();
      expect(startdate.toNumber()).to.be.a('number');
    });
  });

  describe("State 0: Initial state of the reserve pool", function () {
    it("Should set the initial reserve pool DAI balance to 300k", async function () {
      expect(await DAI.balanceOf(credPoolAddress)).to.equal(INITIAL_DAI);
    });

    it("Should set the initial reserve pool CTokenV3 balance to 300k", async function () {
      expect(await hardhatCTokenV3.balanceOf(credPoolAddress)).to.equal(INITIAL_CTOKENS);
    });

    it("Should set the initial supply of CTokenV3s to 300k", async function () {
      expect(await hardhatCTokenV3.totalSupply()).to.equal(INITIAL_CTOKENS);
    });

    it("Borrower should have zero DAI balance", async function (){
      expect(await DAI.balanceOf(borrower.address)).to.equal(0);
    });
  });

  describe("State 1: Borrower borrowing transactions", function () {
    before(async () => {
      // borrowing from the CredPoolV5
      await hardhatCredPoolV5.connect(borrower).borrow(BORROWING_DAI, hardhatCTokenV3.address);
    });

    it("Should record this transaction in borrowTransactionMap", async function () {
      const transactions = await hardhatCredPoolV5.connect(borrower).getUserBorrowTransactions();
      // console.log(transactions[0].totalAmount.toString());
      expect(transactions.length).to.equal(1);
    });

    it("Should decrease the reserve DAI pool size by 1k", async function () {
      // check the reserve DAI balance of the pool
      expect(await DAI.balanceOf(credPoolAddress)).to.equal(INITIAL_DAI - BORROWING_DAI);
    });

    it("Should increase the borrower DAI balance by 1k", async function () {
      // check the borrower DAI balance
      expect(await DAI.balanceOf(borrower.address)).to.equal(BORROWING_DAI);
      expect(await hardhatCredPoolV5.connect(borrower).getUserDAIBalance()).to.equal(BORROWING_DAI);
    });

    it("Should increase the reserve CTokenV3s balance by 1k", async function () {
      expect(await hardhatCTokenV3.balanceOf(credPoolAddress)).to.equal(INITIAL_CTOKENS + BORROWING_DAI);
      // TODO: why is the total supply not increasing ?
      // expect(await hardhatCTokenV3.totalSupply()).to.equal(INITIAL_CTOKENS);
    });
  });

  describe("State 2: Lender depositing transactions", function () {
    before(async () => {
      // tranfering DAI from billionaire to the lender
      await DAI.connect(billionaireSigner).transfer(lender.address, LENDING_DAI);
      // lender approving CredPoolV2 to spend DAI
      await DAI.connect(lender).approve(credPoolAddress, LENDING_DAI);
      // lender depositing to the CredPoolV2
      await hardhatCredPoolV5.connect(lender).approveDAITransfer(LENDING_DAI);
      await hardhatCredPoolV5.connect(lender).deposit(LENDING_DAI, hardhatCTokenV3.address);
    });

    it("Should record this transaction in depositTransactionMap", async function () {
      const transactions = await hardhatCredPoolV5.connect(lender).getUserDepositTransactions();
      expect(transactions.length).to.equal(1);
    });

    it("Lender should have zero DAI balance", async function (){
      expect(await DAI.balanceOf(lender.address)).to.equal(0);
    });

    it("Should increase the reserve DAI pool size by 1k", async function () {
      // check the reserve DAI balance of the pool
      expect(await DAI.balanceOf(credPoolAddress)).to.equal(INITIAL_DAI);
    });

    it("Should decrease the reserve CTokenV3s balance by 1k", async function () {
      expect(await hardhatCTokenV3.balanceOf(credPoolAddress)).to.equal(INITIAL_CTOKENS);
    });

    it("Should increase the lender CTokenV3s balance by 1k", async function () {
      expect(await hardhatCTokenV3.balanceOf(lender.address)).to.equal(LENDING_DAI);
      expect(await hardhatCredPoolV5.connect(lender).getUserCredTokenBalance(hardhatCTokenV3.address)).to.equal(LENDING_DAI);
    });
  });

  describe("State 3: Borrower repaying transactions", function () {
    before(async () => {
      // moving time by 10 days
      const tenDays = 10 * 24 * 60 * 60;
      await hre.network.provider.request({
	  method: "evm_increaseTime",
	  params: [tenDays]
      });
      // we approve the CredPoolV2 to move DAI funds from borrower
      await DAI.connect(borrower).approve(credPoolAddress, BORROWING_DAI);
      await hardhatCredPoolV5.connect(borrower).approveDAITransfer(LENDING_DAI);
      // TODO: have to streamline the transaction_id workflow in the tests
      await hardhatCredPoolV5.connect(borrower).repay(1, hardhatCTokenV3.address);
    });

    it("Should increase the reserve DAI pool size by 1k", async function () {
      // check the reserve DAI balance of the pool
      expect(await DAI.balanceOf(credPoolAddress)).to.equal(INITIAL_DAI+LENDING_DAI);
    });

    it("Should decrease the borrower DAI balance to zero", async function () {
      // check the borrower DAI balance
      expect(await DAI.balanceOf(borrower.address)).to.equal(0);
    });

    it("Should decrease the reserve CTokenV3s balance by 1k", async function () {
      expect(await hardhatCTokenV3.balanceOf(credPoolAddress)).to.equal(INITIAL_CTOKENS-BORROWING_DAI);
    });
  });

  describe("State 4: Lender withdrawing transactions", function () {
    before(async () => {
      // approve CTokenV3 spend to the creditPool
      await hardhatCTokenV3.connect(lender).approve(credPoolAddress, INITIAL_DAI);
      await hardhatCredPoolV5.connect(lender).approveCredTokenTransfer(LENDING_DAI, hardhatCTokenV3.address);
      // TODO: have to streamline the transaction_id workflow in the tests
      await hardhatCredPoolV5.connect(lender).withdraw(1, hardhatCTokenV3.address);
    });

    it("Lender should have 1k DAI balance", async function (){
      expect(await DAI.balanceOf(lender.address)).to.equal(LENDING_DAI);
    });

    it("Should decrease the reserve DAI pool size by 1k", async function () {
      // check the reserve DAI balance of the pool
      expect(await DAI.balanceOf(credPoolAddress)).to.equal(INITIAL_DAI);
    });

    it("Should increase the reserve CTokenV3s balance by 1k", async function () {
      expect(await hardhatCTokenV3.balanceOf(credPoolAddress)).to.equal(INITIAL_CTOKENS);
    });

    it("Should decrease the lender CTokenV3 balance to zero", async function () {
      // check the lender CTokenV3 balance
      expect(await hardhatCTokenV3.balanceOf(borrower.address)).to.equal(0);
    });
  });
});
