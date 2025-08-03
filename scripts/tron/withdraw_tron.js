const { TronWeb } = require("tronweb")
const fs = require("fs")
require("dotenv").config()
const art = require("../../build/contracts/TRX_HTLC.json")

;(async () => {
  const { swapId, preimage } = JSON.parse(fs.readFileSync("swapData.json"))
  const tron = new TronWeb({
    fullHost: "https://nile.trongrid.io",
    eventServer: "https://nile.trongrid.io",
    privateKey: process.env.TRON_PRIVATE_KEY,
  })
  const htlc = await tron.contract(art.abi, process.env.TRON_HTLC_ADDRESS)
  const tx = await htlc.claim(swapId, preimage).send()
  console.log("Withdraw Tron side tx:", tx)
})()
