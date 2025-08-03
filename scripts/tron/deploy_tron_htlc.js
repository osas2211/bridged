const { TronWeb } = require("tronweb")
const art = require("../../artifacts/contracts/tron/TRX_HTLC.sol/TRX_HTLC.json")
require("dotenv").config()
async function main() {
  const tron = new TronWeb({
    fullHost: "https://nile.trongrid.io",
    privateKey: process.env.TRON_PRIVATE_KEY,
  })
  const contract = await tron
    .contract()
    .new({ abi: art.abi, bytecode: art.bytecode })
  console.log("TronHTLC deployed at:", contract.address)
}
main()
