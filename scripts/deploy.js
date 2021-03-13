// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
const fs = require('fs');

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

  if (network.name === "localhost") {
    DEPLOYER_ADDRESS = BILLIONAIRE_ADDRESS;
    deployer = await ethers.provider.getSigner(DEPLOYER_ADDRESS);
    DAI_ADDRESS = DAI_MAINNET_ADDRESS;
   
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [DEPLOYER_ADDRESS]
    })
  }
  if (network.name === "kovan") {
    // DEPLOYER_ADDRESS = KOVAN_ADDRESS;
    [deployer] = await ethers.getSigners();
    DEPLOYER_ADDRESS = await deployer.getAddress();
    DAI_ADDRESS = DAI_KOVAN_ADDRESS;
  }
  console.log(
    "Deploying the contracts with the account:",
    DEPLOYER_ADDRESS 
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const INITIAL_DAI = 300000;

  const DAI = await ethers.getContractAt("IERC20", DAI_ADDRESS, deployer);

  credPoolAddress = ethers.utils.getContractAddress({
    from: DEPLOYER_ADDRESS,
    nonce: (await ethers.provider.getTransactionCount(DEPLOYER_ADDRESS))+  1,
  });

  let daiBalance = await DAI.balanceOf(DEPLOYER_ADDRESS);
  daiBalance = daiBalance.toString();
  console.log("DAI balance:", (daiBalance));
  await DAI.approve(credPoolAddress, INITIAL_DAI);

  const CredPoolV3 = await ethers.getContractFactory("CredPoolV3", deployer);
  const credPoolV3 = await CredPoolV3.deploy(DAI_ADDRESS);
  await credPoolV3.deployed();

  const CToken = await ethers.getContractFactory("CToken");
  const ctoken = await CToken.deploy(credPoolV3.address);
  await ctoken.deployed();

  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy();
  await token.deployed();

  console.log("CredPoolV3 address:", credPoolV3.address);
  console.log("CToken address:", ctoken.address);
  console.log("Token address:", token.address);

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(token, 'Token', 'Token');
  saveFrontendFiles(credPoolV3, 'Pool', 'CredPoolV3');
  saveFrontendFiles(ctoken, 'CToken', 'CToken');
}

function saveFrontendFiles(token, slug, ContractName) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../frontend/src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${slug}-contract-address.json`,
    JSON.stringify({ [slug]: token.address }, undefined, 2)
  );

  const TokenArtifact = artifacts.readArtifactSync(ContractName);

  fs.writeFileSync(
    contractsDir + `/${slug}.json`,
    JSON.stringify(TokenArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
