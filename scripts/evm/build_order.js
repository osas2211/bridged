// scripts/evm/build_order.js
require("dotenv").config()
const fs = require("fs")
const { ethers } = require("hardhat")

async function main() {
  const RPC = process.env.SEPOLIA_RPC
  const KEY = process.env.EVM_PRIVATE_KEY
  const LOP_ADDR = process.env.LOP_ADDRESS
  if (!RPC || !KEY || !LOP_ADDR) {
    throw new Error(
      "Please set SEPOLIA_RPC, EVM_PRIVATE_KEY, LOP_ADDRESS in .env"
    )
  }

  const provider = new ethers.providers.JsonRpcProvider(RPC)
  const maker = new ethers.Wallet(KEY, provider)

  // ——— 1h Hashlock + expiry
  const secret = ethers.utils.hexlify(ethers.utils.randomBytes(32))
  const secretHash = ethers.utils.keccak256(secret)
  const expiry = Math.floor(Date.now() / 1000) + 3600

  // ——— random salt + traits
  const salt = ethers.BigNumber.from(ethers.utils.randomBytes(32)).toString()
  const makerTraits = 0

  // ——— amounts
  const makingAmt = ethers.utils
    .parseUnits("0.0000000000001", process.env.TOKEN_DECIMALS)
    .toString()
  const takingAmt = ethers.utils
    .parseUnits("0.000000000000001", process.env.TOKEN_DECIMALS)
    .toString()

  // ——— build the *12-field* v4 order for EIP-712
  const order = {
    salt, // uint256
    maker: maker.address, // address
    receiver: maker.address, // address
    makerAsset: "0x3d43314a5ade203256172e8b416c6017ca419003", // address
    takerAsset: "0xab0c0C22b3B4C3De6275E8f20Ab02763509e4Ace", // address
    makingAmount: makingAmt, // uint256
    takingAmount: takingAmt, // uint256
    makerTraits, // uint8
    predicate: process.env.PREDICATE_ADDRESS,
    predicateData: ethers.utils.defaultAbiCoder.encode(
      ["bytes32", "uint256"],
      [secretHash, expiry]
    ),
    permit: "0x",
    interaction: "0x",
  }

  // ——— domain & types must match `EIP712("1inch Limit Order Protocol","4")`
  const chainId = (await provider.getNetwork()).chainId
  const domain = {
    name: "1inch Limit Order Protocol",
    version: "4",
    chainId,
    verifyingContract: LOP_ADDR,
  }
  const types = {
    Order: [
      { name: "salt", type: "uint256" },
      { name: "maker", type: "address" },
      { name: "receiver", type: "address" },
      { name: "makerAsset", type: "address" },
      { name: "takerAsset", type: "address" },
      { name: "makingAmount", type: "uint256" },
      { name: "takingAmount", type: "uint256" },
      { name: "makerTraits", type: "uint8" },
      { name: "predicate", type: "address" },
      { name: "predicateData", type: "bytes" },
      { name: "permit", type: "bytes" },
      { name: "interaction", type: "bytes" },
    ],
  }

  // ——— sign & verify
  const signature = await maker._signTypedData(domain, types, order)
  const digest = ethers.utils._TypedDataEncoder.hash(domain, types, order)
  const recovered = ethers.utils.recoverAddress(digest, signature)
  if (recovered !== maker.address) {
    throw new Error("Recovered mismatch")
  }

  // ——— persist
  fs.writeFileSync("order.json", JSON.stringify(order, null, 2))
  fs.writeFileSync("signature.txt", signature)
  fs.writeFileSync(
    "swapData.json",
    JSON.stringify({ secret, secretHash, expiry, salt }, null, 2)
  )

  console.log("✅ order.json + signature.txt + swapData.json written")
  console.log({ salt, makerTraits, secret, secretHash, expiry })
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
