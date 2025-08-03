const { ethers } = require("hardhat")
const fs = require("fs")
require("dotenv").config()

async function main() {
  const { swapId, secretHash, timelock } = JSON.parse(
    fs.readFileSync("swapData.json")
  )
  const [signer] = await ethers.getSigners()
  const token = new ethers.Contract(
    process.env.ERC20_ADDRESS,
    [
      "function approve(address,uint256)",
      "function transferFrom(address,address,uint256)",
    ],
    signer
  )
  await token.approve(
    process.env.ETH_HTLC_ADDRESS,
    ethers.utils.parseUnits(process.env.AMOUNT, 18)
  )
  const htlc = new ethers.Contract(
    process.env.ETH_HTLC_ADDRESS,
    ["function newSwap(bytes32,address,uint256,bytes32,uint256)"],
    signer
  )
  const tx = await htlc.newSwap(
    swapId,
    process.env.ERC20_ADDRESS,
    ethers.utils.parseUnits(process.env.AMOUNT, 18),
    secretHash,
    timelock
  )
  console.log("Lock ETH side tx:", tx.hash)
}
main()
