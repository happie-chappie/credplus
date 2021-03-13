require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;
const ROPSTEN_PRIVATE_KEY = process.env.ROPSTEN_PRIVATE_KEY;

// The next line is part of the sample project, you don't need it in your
// project. It imports a Hardhat task definition, that can be used for
// testing the frontend.
require("./tasks/faucet");

module.exports = {
  solidity: "0.8.2",
  networks: {
    hardhat: {
      forking: {
	url: process.env.FORKING_URL,
	blockNumber: 11941398
	// gas: 95000000,
	// blockGasLimit: 950000000
      },
    },
    kovan: {
      url: `https://kovan.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [`0x${ROPSTEN_PRIVATE_KEY}`]
    }
  },
  mocha: {
    timeout: 2000000
  },
};
