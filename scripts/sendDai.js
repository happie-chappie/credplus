// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

async function main() {
  // This is just a convenience check
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  let deployer;
  let DEPLOYER_ADDRESS;
  let DAI_ADDRESS;
  const BILLIONAIRE_ADDRESS = "0x564286362092D8e7936f0549571a803B203aAceD";
  // const KOVAN_ADDRESS = "0xD0A16a95669B14161B09dafFa20B24575b77b731";
  const DAI_MAINNET_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const DAI_KOVAN_ADDRESS = "0xff795577d9ac8bd7d90ee22b6c1703490b6512fd";  // kovan
  // const deployer = await ethers.provider.getSigner(BILLIONAIRE_ADDRESS);

  DEPLOYER_ADDRESS = BILLIONAIRE_ADDRESS;
  deployer = await ethers.provider.getSigner(DEPLOYER_ADDRESS);
  DAI_ADDRESS = DAI_MAINNET_ADDRESS;
 
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [DEPLOYER_ADDRESS]
  })

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const INITIAL_DAI = 300000;

  const DAI = await ethers.getContractAt("IERC20", DAI_ADDRESS, deployer);

  let daiBalance = await DAI.balanceOf(DEPLOYER_ADDRESS);
  daiBalance = daiBalance.toString();
  console.log("DAI balance:", (daiBalance));
  const TESTER_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  const foo = ethers.utils.parseUnits("2");
  await DAI.approve(TESTER_ADDRESS, foo);
  await DAI.transfer(TESTER_ADDRESS, foo);
  daiBalance = await DAI.balanceOf(TESTER_ADDRESS);
  daiBalance = daiBalance.toString();
  console.log("DAI balance:", (daiBalance));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
