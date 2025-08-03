// scripts/evm/build_order.js
require("dotenv").config()
const fs = require("fs")
const path = require("path")
const { ethers, network } = require("hardhat")

// 1) Load the compiled LOP artifact from Hardhat’s build
const LOP_ARTIFACT = require("../../artifacts/contracts/1inch/LimitOrderProtocol.sol/LimitOrderProtocol.json")

// 2) Define the EIP-712 types for v4 orders
const types = {
  Order: [
    { name: "makerAsset", type: "address" },
    { name: "takerAsset", type: "address" },
    { name: "maker", type: "address" },
    { name: "receiver", type: "address" },
    { name: "makingAmount", type: "uint256" },
    { name: "takingAmount", type: "uint256" },
    { name: "predicate", type: "address" },
    { name: "predicateData", type: "bytes" },
    { name: "permit", type: "bytes" },
    { name: "interaction", type: "bytes" },
  ],
}

async function main() {
  // a) Signer
  const [maker] = await ethers.getSigners()

  // b) Build secret+hash+expiry
  const secret = ethers.utils.hexlify(ethers.utils.randomBytes(32))
  const secretHash = ethers.utils.keccak256(secret)
  const expiry = Math.floor(Date.now() / 1000) + 3600 // 1h

  // c) Order parameters from .env
  const makingAmt = ethers.utils.parseUnits(
    process.env.MAKING_AMOUNT,
    process.env.TOKEN_DECIMALS
  )
  const takingAmt = ethers.utils.parseUnits(
    process.env.TAKING_AMOUNT,
    process.env.TOKEN_DECIMALS
  )

  const order = {
    makerAsset: "0x3D43314A5adE203256172e8b416c6017CA419003",
    takerAsset: ethers.constants.AddressZero,
    maker: maker.address,
    receiver: maker.address,
    makingAmount: makingAmt.toString(),
    takingAmount: takingAmt.toString(),
    predicate: process.env.PREDICATE_ADDRESS,
    predicateData: ethers.utils.defaultAbiCoder.encode(
      ["bytes32", "uint256"],
      [secretHash, expiry]
    ),
    permit: "0x",
    interaction: "0x",
  }

  // d) Domain for EIP-712
  const chainId = (await maker.provider.getNetwork()).chainId
  const domain = {
    name: "1inch Limit Order Protocol",
    version: "4",
    chainId,
    verifyingContract: process.env.LOP_ADDRESS,
  }

  // e) Sign typed data
  const signature = await maker._signTypedData(domain, types, order)

  // f) Persist
  fs.writeFileSync(
    path.join(__dirname, "../../order.json"),
    JSON.stringify(order, null, 2)
  )
  fs.writeFileSync(path.join(__dirname, "../../signature.txt"), signature)
  fs.writeFileSync(
    path.join(__dirname, "../../swapData.json"),
    JSON.stringify({ secret, secretHash, expiry }, null, 2)
  )

  console.log("✅ order.json + signature.txt + swapData.json written")
  console.log(`   → secret:     ${secret}`)
  console.log(`   → secretHash: ${secretHash}`)
  console.log(`   → expiry:     ${expiry}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
