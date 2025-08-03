const fs = require("fs")
const { randomBytes, createHash } = require("crypto")

const preimage = randomBytes(32)
const secretHash = createHash("sha256").update(preimage).digest()
const swapId = createHash("sha256")
  .update(Buffer.concat([secretHash, Buffer.from(Date.now().toString())]))
  .digest()
const timelock = Math.floor(Date.now() / 1000) + 3600 // +1h

fs.writeFileSync(
  "swapData.json",
  JSON.stringify(
    {
      preimage: "0x" + preimage.toString("hex"),
      secretHash: "0x" + secretHash.toString("hex"),
      swapId: "0x" + swapId.toString("hex"),
      timelock,
    },
    null,
    2
  )
)
console.log("swapData.json generated")
