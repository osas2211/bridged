import "dotenv/config"
import { ethers } from "ethers"
import { TronWeb } from "tronweb"
import { EventLog } from "ethers"
import ETH_HTLC_ABI from "../artifacts/contracts/evm/ETH_HTLC.sol/ETH_HTLC.json"
import TRX_HTLC_ABI from "../artifacts/contracts/tron/TRX_HTLC.sol/TRX_HTLC.json"

const {
  EVM_RPC_URL,
  EVM_CHAIN_ID,
  EVM_PRIVATE_KEY: EVM_KEY,
  ETH_HTLC_ADDRESS,
  TRON_FULLNODE,
  TRON_EVENTSERVER,
  TRON_PRIVATE_KEY,
  TRX_HTLC_ADDRESS,
} = process.env as Record<string, string>

// --- Setup EVM provider & wallet ---
const evmProvider = new ethers.JsonRpcProvider(
  EVM_RPC_URL,
  EVM_CHAIN_ID ? parseInt(EVM_CHAIN_ID) : undefined
)
const evmWallet = new ethers.Wallet(EVM_KEY!, evmProvider)
const ethHtlc = new ethers.Contract(
  ETH_HTLC_ADDRESS!,
  ETH_HTLC_ABI.abi,
  evmWallet
)

// --- Setup TronWeb & contract ---
const tron = new TronWeb({
  fullHost: TRON_FULLNODE,
  privateKey: TRON_PRIVATE_KEY,
  eventServer: TRON_EVENTSERVER,
})

const trxHtlc = tron.contract(TRX_HTLC_ABI.abi, TRX_HTLC_ADDRESS!)

console.log("[BOT] Started. Watching HTLCs...")

// Keep track of processed events
const seenEvm: Set<string> = new Set()
const seenTron: Set<string> = new Set()

// Poll EVM for Claimed (TRX→ETH flow)
async function pollEvm() {
  const filter = ethHtlc.filters.Claimed()
  const events = await ethHtlc.queryFilter(filter, "latest")
  for (const ev of events) {
    const id = ev.transactionHash
    if (seenEvm.has(id)) continue
    seenEvm.add(id)

    if (!("args" in ev) || !ev.args) {
      continue
    }

    const { swapId, preimage } = (ev as EventLog).args
    console.log(
      `[BOT][EVM] Claimed on ETH_HTLC ${swapId}, preimage = ${preimage}`
    )
    // Now claim on Tron:
    try {
      const tx = await trxHtlc.methods.claim(swapId, preimage).send()
      console.log("[BOT][TRON] claim() called on TRX_HTLC, tx:", tx)
    } catch (err) {
      console.error("[BOT][TRON] claim() failed:", err)
    }
  }
  setTimeout(pollEvm, 5000)
}

// Poll Tron for Claimed (ETH→TRX flow)
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
      const txid = ev.transaction_id
      if (seenTron.has(txid)) continue
      seenTron.add(txid)

      const { swapId, preimage } = ev.result as any
      const prehex = "0x" + preimage.replace(/^0x/, "")
      console.log(
        `[BOT][TRON] Claimed on TRX_HTLC ${swapId}, preimage = ${prehex}`
      )

      // Now claim on Ethereum:
      try {
        const tx = await ethHtlc.claim(swapId, prehex)
        await tx.wait()
        console.log("[BOT][EVM] claim() called on ETH_HTLC, tx hash:", tx.hash)
      } catch (err) {
        console.error("[BOT][EVM] claim() failed:", err)
      }
    }
  } catch (err) {
    console.error("[BOT][TRON] polling error:", err)
  }
  setTimeout(pollTron, 5000)
}

pollEvm()
pollTron()
