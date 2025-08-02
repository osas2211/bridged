const { TronWeb } = require("tronweb")
const dotenv = require("dotenv")
const art = require("../../artifacts/contracts/tron/TestTRC20.sol/TestTRC20.json")
dotenv.config()
const { TRON_PRIVATE_KEY, TRON_RPC, TRON_EVENTSERVER } = process.env
if (!TRON_PRIVATE_KEY) throw new Error("SET TRON_PRIVATE_KEY")
const tokens = ["USDC", "USDT", "DAI"]

const tron = new TronWeb({
  fullHost: TRON_RPC,
  eventServer: TRON_EVENTSERVER,
  privateKey: TRON_PRIVATE_KEY,
})
async function main() {
  for (const token of tokens) {
    const contract = await tron.contract().new({
      abi: art.abi,
      bytecode: art.bytecode,
      parameters: [`Test t${token}`, `t${token}`, 6, "1000000000000"],
    })
    console.log(`t${token} deployed: `, contract.address)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
