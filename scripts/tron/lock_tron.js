const TronWeb = require("tronweb")
const fs = require("fs")
require("dotenv").config()
;(async () => {
  const { swapId, secretHash, timelock } = JSON.parse(
    fs.readFileSync("swapData.json")
  )
  const tron = new TronWeb({
    fullHost: process.env.TRON_RPC,
    eventServer: process.env.TRON_EVENTSERVER,
    privateKey: process.env.TRON_PRIVATE_KEY,
  })
  const htlc = await tron.contract().at(process.env.TRON_HTLC_ADDRESS)
  const tx = await htlc
    .newSwap(
      swapId,
      process.env.TRC20_ADDRESS,
      Number(process.env.AMOUNT) * 10 ** 18,
      secretHash,
      timelock
    )
    .send()
  console.log("Lock Tron side tx:", tx)
})()
