import { HardhatUserConfig } from "hardhat/config"
import "@nomiclabs/hardhat-ethers"
import "@nomicfoundation/hardhat-verify"
import * as dotenv from "dotenv"

dotenv.config()

const config = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: { optimizer: { enabled: true, runs: 200 } },
      },
      {
        version: "0.8.23",
        settings: { optimizer: { enabled: true, runs: 200 }, viaIR: true },
      },
    ],
  },
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC,
      accounts: process.env.EVM_PRIVATE_KEY
        ? [process.env.EVM_PRIVATE_KEY]
        : [],
    },
    ghostnet: {
      chainId: 128123,
      url: "https://node.ghostnet.etherlink.com",
      accounts: process.env.EVM_PRIVATE_KEY
        ? [process.env.EVM_PRIVATE_KEY]
        : [],
    },
    "etherlink-testnet": {
      url: "https://node.ghostnet.etherlink.com",
    },
  },
  etherscan: {
    apiKey: {
      "etherlink-testnet": process.env.ETHERSCAN_API_KEY,
    },
    customChains: [
      {
        network: "etherlink-testnet",
        chainId: 128123,
        urls: {
          apiURL: "https://testnet.explorer.etherlink.com/api",
          browserURL: "https://testnet.explorer.etherlink.com",
        },
      },
    ],
  },
}

export default config
