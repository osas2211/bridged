const TronWeb = require("tronweb")
const fs = require("fs")
require("dotenv").config()
;(async () => {
  const { swapId, preimage } = JSON.parse(fs.readFileSync("swapData.json"))
  const tron = new TronWeb({
    fullHost: process.env.TRON_RPC,
    eventServer: process.env.TRON_EVENTSERVER,
    privateKey: process.env.TRON_PRIVATE_KEY,
  })
  const htlc = await tron.contract().at(process.env.TRON_HTLC_ADDRESS)
  const tx = await htlc.withdraw(swapId, preimage).send()
  console.log("Withdraw Tron side tx:", tx)
})()
