require("dotenv").config()
const { TronWeb } = require("tronweb")
const fs = require("fs")
const path = require("path")

async function main() {
  // 1) Setup TronWeb pointing at Nile
  const fullHost = "https://nile.trongrid.io"
  const privateKey = process.env.TRON_PRIVATE_KEY // no 0x
  const tronWeb = new TronWeb({ fullHost, privateKey })

  // 2) Load ABI & bytecode from your build
  // const artifactPath = path.join(__filename, "build/contracts/TRX_HTLC.json")
  // if (!fs.existsSync(artifactPath)) {
  //   throw new Error(`Missing artifact at ${artifactPath}`)
  // }
  const { abi, bytecode } = require("../../build/contracts/TRX_HTLC.json")

  // 3) Deploy
  console.log("Deploying TRX_HTLC...")
  const contract = await tronWeb.contract().new({
    abi,
    bytecode: bytecode.startsWith("0x") ? bytecode : "0x" + bytecode,
    feeLimit: 1_000_000_000, // max SUN to pay for bandwidth/energy
    callValue: 0, // sending no TRX on deploy
    parameters: [], // constructor args if any
  })

  console.log("✅ Deployed!")
  console.log(" hex address:", contract.address)
  console.log(" base58:", tronWeb.address.fromHex(contract.address))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
