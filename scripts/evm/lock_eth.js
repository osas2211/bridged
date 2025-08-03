const { ethers } = require("hardhat")
const fs = require("fs")
const { TronWeb } = require("tronweb")
require("dotenv").config()

async function main() {
  const receiver58 = "TYevxJu3NYMrprKMms3a5jpAH55L94rU48"
  const tronWeb = new TronWeb({ fullHost: "https://nile.trongrid.io" })
  const receiverHex = "0x" + tronWeb.address.toHex(receiver58).slice(2)
  console.log("▶️ locking for Tron receiver:", receiver58, "→", receiverHex)
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
  const approveTx = await token.approve(
    process.env.ETH_HTLC_ADDRESS,
    ethers.utils.parseUnits("100", 18)
  )
  await approveTx.wait()

  const htlc = new ethers.Contract(
    process.env.ETH_HTLC_ADDRESS,
    ["function newSwap(bytes32,address,uint256,bytes32,uint256)"],
    signer
  )
  const tx = await htlc.newSwap(
    swapId,
    receiverHex,
    ethers.utils.parseUnits("100", 18),
    secretHash,
    timelock,
    { gasLimit: 900_000 }
  )
  await tx.wait()
  console.log("Lock ETH side tx:", tx.hash)
}
main()
