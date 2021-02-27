require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

// The next line is part of the sample project, you don't need it in your
// project. It imports a Hardhat task definition, that can be used for
// testing the frontend.
require("./tasks/faucet");

module.exports = {
  solidity: "0.7.3",
  networks: {
    hardhat: {
      forking: {
	url: process.env.FORKING_URL,
	blockNumber: 11941398
      },
      // gas: 95000000,
      // blockGasLimit: 950000000
    }
  },
  mocha: {
    timeout: 2000000
  },
};
