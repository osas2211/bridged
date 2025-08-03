const { ethers } = require("hardhat")
const fs = require("fs")
require("dotenv").config()
;(async () => {
  const { swapId, preimage } = JSON.parse(fs.readFileSync("swapData.json"))
  const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC)
  const signer = new ethers.Wallet(process.env.EVM_PRIVATE_KEY, provider)
  const htlc = new ethers.Contract(
    process.env.ETH_HTLC_ADDRESS,
    ["function withdraw(bytes32,bytes32)"],
    signer
  )
  const tx = await htlc.withdraw(swapId, preimage)
  console.log("Withdraw ETH side tx:", tx.hash)
})()
