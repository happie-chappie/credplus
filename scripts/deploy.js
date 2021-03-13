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

  const [deployer] = await ethers.getSigners();
  const DEPLOYER_ADDRESS = await deployer.getAddress();
  console.log(
    "Deploying the contracts with the account:",
    DEPLOYER_ADDRESS 
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const BILLIONAIRE_ADDRESS = "0x564286362092D8e7936f0549571a803B203aAceD";
  const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const INITIAL_DAI = 300000;
 
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [BILLIONAIRE_ADDRESS]
  })

  const billionaireSigner = await ethers.provider.getSigner(BILLIONAIRE_ADDRESS);
  const DAI = await ethers.getContractAt("IERC20", DAI_ADDRESS, billionaireSigner);

  credPoolAddress = ethers.utils.getContractAddress({
    from: BILLIONAIRE_ADDRESS,
    nonce: (await ethers.provider.getTransactionCount(BILLIONAIRE_ADDRESS))+  1,
  });

  let daiBalance = await DAI.balanceOf(BILLIONAIRE_ADDRESS);
  daiBalance = daiBalance.toString();
  console.log("DAI balance:", (daiBalance));
  await DAI.approve(credPoolAddress, INITIAL_DAI);

  const CredPoolV3 = await ethers.getContractFactory("CredPoolV3", billionaireSigner);
  const credPoolV3 = await CredPoolV3.deploy();
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
