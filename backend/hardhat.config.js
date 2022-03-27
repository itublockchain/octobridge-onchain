require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
const private_key = require("./keys/privatekey.json");

const PRIVATE_KEY = private_key.key;

module.exports = {
  solidity: { version: "0.8.13", optimizer: { enabled: true, runs: 200 } },
  networks: {
    fuji: {
      url: `https://api.avax-test.network/ext/bc/C/rpc`,
      accounts: [`${PRIVATE_KEY}`]
    }
  }
};