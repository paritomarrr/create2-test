require("@nomiclabs/hardhat-ethers");
require("dotenv").config();
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const { task } = require("hardhat/config");
const {
  API_URL_GOERLI,
  API_URL_POLYGON,
  PRIVATE_KEY,
} = process.env;


const web3Goerli = createAlchemyWeb3(API_URL_GOERLI);
const web3Mumbai = createAlchemyWeb3(API_URL_POLYGON);

task("account", "returns nonce and balance for specified address on multiple networks")
  .addParam("address")
  .setAction(async address => {
    const web3Goerli = createAlchemyWeb3(API_URL_GOERLI);
    const web3Mumbai = createAlchemyWeb3(API_URL_POLYGON);

    const networkIDArr = ["Ethereum Goerli:", "Polygon  Mumbai:", "Arbitrum Rinkby:", "Optimism Goerli:"]
    const providerArr = [web3Goerli, web3Mumbai];
    const resultArr = [];
    
    for (let i = 0; i < providerArr.length; i++) {
      const nonce = await providerArr[i].eth.getTransactionCount(address.address, "latest");
      const balance = await providerArr[i].eth.getBalance(address.address)
      resultArr.push([networkIDArr[i], nonce, parseFloat(providerArr[i].utils.fromWei(balance, "ether")).toFixed(2) + "ETH"]);
    }
    resultArr.unshift(["  |NETWORK|   |NONCE|   |BALANCE|  "])
    console.log(resultArr);
  });

module.exports = {
  solidity: "0.8.9",
  networks: {
    hardhat: {},
    goerli: {
      url: API_URL_GOERLI,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    polygon: {
      url: API_URL_POLYGON,
      accounts: [`0x${PRIVATE_KEY}`],
    }
  },
};

