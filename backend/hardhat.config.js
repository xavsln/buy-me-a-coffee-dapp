require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// console.log(process.env.TEST_DOTENV);

const SEPOLIA_URL = process.env.ALCHEMY_SEPOLIA_URL;
const TEST_PRIVATE_KEY = process.env.TEST_PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: SEPOLIA_URL,
      accounts: [TEST_PRIVATE_KEY],
    },
  },
};
