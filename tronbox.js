require("dotenv").config()

console.log("🔧 Loading tronbox.js from:", __filename)
module.exports = {
  // Where your TRON contracts live
  contracts_directory: "./contracts/tron",

  // **This** must match your compile output
  contracts_build_directory: "./build/contracts",

  // Your migrations folder
  migrations_directory: "./migrations/tron",

  networks: {
    nile: {
      privateKey: process.env.TRON_PRIVATE_KEY, // no 0x prefix
      fullHost: "https://nile.trongrid.io",
      network_id: "*", // allow any
      feeLimit: 1_000_000_000,
    },
  },

  compilers: {
    solc: {
      version: "0.8.20",
      optimizer: { enabled: true, runs: 200 },
      evmVersion: "istanbul",
    },
  },
}
