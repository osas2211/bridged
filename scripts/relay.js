const fs = require("fs")
;(async () => {
  const { swapId, preimage } = JSON.parse(fs.readFileSync("swapData.json"))
  console.log("Relaying preimage:", preimage)
  // No on-chain action here: your UI or bot just passes this to withdraw scripts
})()
