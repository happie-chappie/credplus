const { expect } = require("chai");


describe("CredPool contract", function () {
  let CredPoolV1;
  let hardhatCredPoolV1;
  let depositAmount;
  let DAI;
  let billionaireSigner;

  const BILLIONAIRE_ADDRESS = "0x564286362092D8e7936f0549571a803B203aAceD";
  const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const INITIAL_DAI = 100000;
  // depositAmount = 1000;
  depositAmount = ethers.utils.parseEther("500");

  // TODO: Check that billionaire has enough money
  // TODO: move the global consts to a seperate module
  // three accounts/signers
  beforeEach(async function () {
    
    // gettting signers
    [contractOwner, liquidityProvider, borrower, ...addrs] = await ethers.getSigners();

    // impersonating the billionaire
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [BILLIONAIRE_ADDRESS]
    })

    billionaireSigner = await ethers.provider.getSigner(BILLIONAIRE_ADDRESS);
    DAI = await ethers.getContractAt("IERC20", DAI_ADDRESS, billionaireSigner);
    CredPoolV1 = await ethers.getContractFactory("CredPoolV1", billionaireSigner);

    const credPoolAddress = ethers.utils.getContractAddress({
      from: BILLIONAIRE_ADDRESS,
      nonce: (await ethers.provider.getTransactionCount(BILLIONAIRE_ADDRESS))+  1,
    });

    hardhatCredPoolV1 = await CredPoolV1.deploy();
    await hardhatCredPoolV1.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await hardhatCredPoolV1.owner()).to.equal(BILLIONAIRE_ADDRESS);
    });
  });

  describe("Liquidity Provider Transactions", function () {
    before(async () => {
      // await DAI.transfer(billionaireAddress, liquidityProvider.address, depositAmount);
    });

    it("Liquidity provider should have depositAmount DAI balance", async function () {
      // expect(await DAI.balanceOf(liquidityProvider.address).to.equal(depositAmount));
    });

    it("Liquidity provider should be able to deposit DAI", async function () {
      // expect(await hardhatCredPool.owner()).to.equal(contractOwner.address);
      // await hardhatCredPool.connect(billionaireSigner).deposit(depositAmount);
      // const data = await hardhatCredPool.deposit(billionaireAddress, depositAmount);
      // assert(data.totalDebtETH.gt(ethers.utils.parseEther("1")));
    });

    it("Liquidity provider should be able to withdraw DAI", async function () {
      // expect(await hardhatCredPool.owner()).to.equal(contractOwner.address);
    });

  });
});
