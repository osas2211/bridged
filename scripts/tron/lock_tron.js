const { TronWeb } = require("tronweb")
const fs = require("fs")
const art = require("../../build/contracts/TRX_HTLC.json")

require("dotenv").config()
;(async () => {
  const { swapId, secretHash, timelock } = JSON.parse(
    fs.readFileSync("swapData.json")
  )
  const tron = new TronWeb({
    fullHost: "https://nile.trongrid.io",
    eventServer: "https://nile.trongrid.io",
    privateKey: process.env.TRON_PRIVATE_KEY,
  })
  const htlc = await tron.contract(art.abi, process.env.TRON_HTLC_ADDRESS)
  const tx = await htlc
    .lock(swapId, process.env.TRC20_ADDRESS, secretHash, timelock)
    .send({
      feeLimit: 1_000_000_000, // adjust if you need more bandwidth
      callValue: Number("10") * 10 ** 6, // in SUN (1 TRX = 1e6 sun)
    })
  console.log("Lock Tron side tx:", tx)
})()
