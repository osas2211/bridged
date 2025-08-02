// packages/bot/index.ts
import dotenv from "dotenv"
dotenv.config()

import { providers, Wallet, Contract } from "ethers"
import { TronWeb } from "tronweb"
import fs from "fs"
import path from "path"

const {
  EVM_RPC_URL,
  EVM_CHAIN_ID,
  EVM_PRIVATE_KEY,
  ETH_HTLC_ADDRESS,
  TRON_FULLNODE,
  TRON_EVENTSERVER,
  TRON_PRIVATE_KEY,
  TRX_HTLC_ADDRESS,
} = process.env as Record<string, string>

// --- EVM Setup (ethers v5) ---
const provider = new providers.JsonRpcProvider(
  EVM_RPC_URL,
  parseInt(EVM_CHAIN_ID!)
)
const wallet = new Wallet(EVM_PRIVATE_KEY!, provider)

// load ABI
const ethHtlcJson = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../evm/artifacts/ETH_HTLC.json"),
    "utf8"
  )
)
const ethHtlcAbi = ethHtlcJson.abi as any[]
const ethHtlc = new Contract(ETH_HTLC_ADDRESS!, ethHtlcAbi, wallet)

// --- Tron Setup (TronWeb) ---
const tron = new TronWeb({
  fullHost: TRON_FULLNODE!,
  eventServer: TRON_EVENTSERVER!,
  privateKey: TRON_PRIVATE_KEY,
})
const trxHtlcJson = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../tron/artifacts/TRX_HTLC.json"),
    "utf8"
  )
)
const trxHtlcAbi = trxHtlcJson.abi as any[]
const trxHtlc = tron.contract(trxHtlcAbi, TRX_HTLC_ADDRESS!)

console.log("[BOT] Resolver started")

// to prevent double-processing
const seenEvm = new Set<string>()
const seenTron = new Set<string>()

// --- Listen for ETH_HTLC.Claimed → relay to TRX_HTLC.claim() ---
ethHtlc.on(
  "Claimed",
  async (swapId: string, preimage: string, amount: any, event: any) => {
    const txHash = event.transactionHash
    if (seenEvm.has(txHash)) return
    seenEvm.add(txHash)

    console.log(
      `[BOT][EVM] Claimed on ETH_HTLC: swapId=${swapId}, preimage=${preimage}`
    )
    try {
      const receipt = await trxHtlc.methods.claim(swapId, preimage).send()
      console.log(`[BOT][TRON] Relayed claim to TRX_HTLC, tx: ${receipt}`)
    } catch (e) {
      console.error("[BOT][TRON] claim() failed:", e)
    }
  }
)

// --- Poll TRX_HTLC.Claimed → relay to ETH_HTLC.claim() ---
async function pollTron() {
  try {
    const events = await tron.event.getEventsByContractAddress(
      TRX_HTLC_ADDRESS!,
      {
        eventName: "Claimed",
        // size: 100,
      }
    )
    for (const ev of events?.data!) {
      const txId = ev.transaction_id
      if (seenTron.has(txId)) continue
      seenTron.add(txId)

      const { swapId, preimage } = ev.result as any
      const hexPre = "0x" + preimage.replace(/^0x/, "")
      console.log(
        `[BOT][TRON] Claimed on TRX_HTLC: swapId=${swapId}, preimage=${hexPre}`
      )

      // now relay to EVM
      try {
        const tx = await ethHtlc.claim(swapId, hexPre)
        await tx.wait()
        console.log(`[BOT][EVM] Relayed claim to ETH_HTLC, txHash: ${tx.hash}`)
      } catch (err) {
        console.error("[BOT][EVM] claim() failed:", err)
      }
    }
  } catch (err) {
    console.error("[BOT][TRON] polling error:", err)
  }
  setTimeout(pollTron, 5000)
}

// start polling
pollTron()
