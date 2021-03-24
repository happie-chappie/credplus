const { expect } = require("chai");

describe("CredPoolV4 contract", function () {
  let CredPoolV4;
  let hardhatCredPoolV4;
  let CTokenV2;
  let hardhatCTokenV2;
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
    CredPoolV4 = await ethers.getContractFactory("CredPoolV4", billionaireSigner);
    CTokenV2 = await ethers.getContractFactory("CTokenV2", billionaireSigner);

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
    hardhatCredPoolV4 = await CredPoolV4.deploy(DAI_ADDRESS);
    await hardhatCredPoolV4.deployed();

    hardhatCTokenV2 = await CTokenV2.deploy(credPoolAddress);
    await hardhatCTokenV2.deployed();
  });

  // TODO: have to create a state specific workflow
  // credPoolDAIReserverBalance = await DAI.balanceOf(credPoolAddress);
  // credPoolDAIReserverBalance = credPoolDAIReserverBalance.toString();
  // console.log(credPoolDAIReserverBalance);
  // let credPoolAddressETHBalance = await ethers.provider.getBalance(credPoolAddress);
  // credPoolAddressETHBalance = credPoolAddressETHBalance.toString();
  // console.log(credPoolAddressETHBalance);
  describe("Deployment of CredPoolV4 & CTokenV2 & owner establishment for CredPoolV4", function () {
    it("Should set the right owner", async function () {
      expect(await hardhatCredPoolV4.owner()).to.equal(BILLIONAIRE_ADDRESS);
    });
  });

  describe("Testing the CredPoolV4 views", function () {
    it("Should get pool DAI balance and it should be equal to 300k", async function () {
      expect(await hardhatCredPoolV4.getDAIBalance()).to.equal(INITIAL_DAI);
    });

    it("Should get pool CTokenV2s balance and it should be equal to 300k", async function () {
      expect(await hardhatCredPoolV4.getCredTokenBalance(hardhatCTokenV2.address)).to.equal(INITIAL_CTOKENS);
    });

    it("Should get borrower DAI balance and it should be equal to 0", async function () {
      expect(await hardhatCredPoolV4.connect(borrower).getUserDAIBalance()).to.equal(0);
    });

    it("Should get borrower CTokenV2s balance and it should be equal to 0", async function () {
      expect(await hardhatCredPoolV4.connect(borrower).getUserCredTokenBalance(hardhatCTokenV2.address)).to.equal(0);
    });
  });

  describe("State 0: Initial state of the reserve pool", function () {
    it("Should set the initial reserve pool DAI balance to 300k", async function () {
      expect(await DAI.balanceOf(credPoolAddress)).to.equal(INITIAL_DAI);
    });

    it("Should set the initial reserve pool CTokenV2 balance to 300k", async function () {
      expect(await hardhatCTokenV2.balanceOf(credPoolAddress)).to.equal(INITIAL_CTOKENS);
    });

    it("Should set the initial supply of CTokenV2s to 300k", async function () {
      expect(await hardhatCTokenV2.totalSupply()).to.equal(INITIAL_CTOKENS);
    });

    it("Borrower should have zero DAI balance", async function (){
      expect(await DAI.balanceOf(borrower.address)).to.equal(0);
    });
  });

  describe("State 1: Borrower borrowing transactions", function () {
    before(async () => {
      // borrowing from the CredPoolV4
      await hardhatCredPoolV4.connect(borrower).borrow(BORROWING_DAI, hardhatCTokenV2.address);
    });

    it("Should record this transaction in borrowTransactionMap", async function () {
      const transactions = await hardhatCredPoolV4.connect(borrower).getUserBorrowTransactions();
      expect(transactions.length).to.equal(1);
    });

    it("Should decrease the reserve DAI pool size by 1k", async function () {
      // check the reserve DAI balance of the pool
      expect(await DAI.balanceOf(credPoolAddress)).to.equal(INITIAL_DAI - BORROWING_DAI);
    });

    it("Should increase the borrower DAI balance by 1k", async function () {
      // check the borrower DAI balance
      expect(await DAI.balanceOf(borrower.address)).to.equal(BORROWING_DAI);
      expect(await hardhatCredPoolV4.connect(borrower).getUserDAIBalance()).to.equal(BORROWING_DAI);
    });

    it("Should increase the reserve CTokenV2s balance by 1k", async function () {
      expect(await hardhatCTokenV2.balanceOf(credPoolAddress)).to.equal(INITIAL_CTOKENS + BORROWING_DAI);
      // TODO: why is the total supply not increasing ?
      // expect(await hardhatCTokenV2.totalSupply()).to.equal(INITIAL_CTOKENS);
    });
  });

  describe("State 2: Lender depositing transactions", function () {
    before(async () => {
      // tranfering DAI from billionaire to the lender
      await DAI.connect(billionaireSigner).transfer(lender.address, LENDING_DAI);
      // lender approving CredPoolV2 to spend DAI
      await DAI.connect(lender).approve(credPoolAddress, LENDING_DAI);
      // lender depositing to the CredPoolV2
      await hardhatCredPoolV4.connect(lender).approveDAITransfer(LENDING_DAI);
      await hardhatCredPoolV4.connect(lender).deposit(LENDING_DAI, hardhatCTokenV2.address);
    });

    it("Should record this transaction in depositTransactionMap", async function () {
      const transactions = await hardhatCredPoolV4.connect(lender).getUserDepositTransactions();
      expect(transactions.length).to.equal(1);
    });

    it("Lender should have zero DAI balance", async function (){
      expect(await DAI.balanceOf(lender.address)).to.equal(0);
    });

    it("Should increase the reserve DAI pool size by 1k", async function () {
      // check the reserve DAI balance of the pool
      expect(await DAI.balanceOf(credPoolAddress)).to.equal(INITIAL_DAI);
    });

    it("Should decrease the reserve CTokenV2s balance by 1k", async function () {
      expect(await hardhatCTokenV2.balanceOf(credPoolAddress)).to.equal(INITIAL_CTOKENS);
    });

    it("Should increase the lender CTokenV2s balance by 1k", async function () {
      expect(await hardhatCTokenV2.balanceOf(lender.address)).to.equal(LENDING_DAI);
      expect(await hardhatCredPoolV4.connect(lender).getUserCredTokenBalance(hardhatCTokenV2.address)).to.equal(LENDING_DAI);
    });
  });

  describe("State 3: Borrower repaying transactions", function () {
    before(async () => {
      // we approve the CredPoolV2 to move DAI funds from borrower
      await DAI.connect(borrower).approve(credPoolAddress, BORROWING_DAI);
      await hardhatCredPoolV4.connect(borrower).approveDAITransfer(LENDING_DAI);
      // TODO: have to streamline the transaction_id workflow in the tests
      await hardhatCredPoolV4.connect(borrower).repay(1, hardhatCTokenV2.address);
    });

    it("Should increase the reserve DAI pool size by 1k", async function () {
      // check the reserve DAI balance of the pool
      expect(await DAI.balanceOf(credPoolAddress)).to.equal(INITIAL_DAI+LENDING_DAI);
    });

    it("Should decrease the borrower DAI balance to zero", async function () {
      // check the borrower DAI balance
      expect(await DAI.balanceOf(borrower.address)).to.equal(0);
    });

    it("Should decrease the reserve CTokenV2s balance by 1k", async function () {
      expect(await hardhatCTokenV2.balanceOf(credPoolAddress)).to.equal(INITIAL_CTOKENS-BORROWING_DAI);
    });
  });

  describe("State 4: Lender withdrawing transactions", function () {
    before(async () => {
      // approve CTokenV2 spend to the creditPool
      await hardhatCTokenV2.connect(lender).approve(credPoolAddress, INITIAL_DAI);
      await hardhatCredPoolV4.connect(lender).approveCredTokenTransfer(LENDING_DAI, hardhatCTokenV2.address);
      // TODO: have to streamline the transaction_id workflow in the tests
      await hardhatCredPoolV4.connect(lender).withdraw(1, hardhatCTokenV2.address);
    });

    it("Lender should have 1k DAI balance", async function (){
      expect(await DAI.balanceOf(lender.address)).to.equal(LENDING_DAI);
    });

    it("Should decrease the reserve DAI pool size by 1k", async function () {
      // check the reserve DAI balance of the pool
      expect(await DAI.balanceOf(credPoolAddress)).to.equal(INITIAL_DAI);
    });

    it("Should increase the reserve CTokenV2s balance by 1k", async function () {
      expect(await hardhatCTokenV2.balanceOf(credPoolAddress)).to.equal(INITIAL_CTOKENS);
    });

    it("Should decrease the lender CTokenV2 balance to zero", async function () {
      // check the lender CTokenV2 balance
      expect(await hardhatCTokenV2.balanceOf(borrower.address)).to.equal(0);
    });
  });
});
