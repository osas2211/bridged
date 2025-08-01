import { env_vars } from "@/lib/env_vars"
import { thirdweb_client } from "@/lib/thirdweb_client"
import { ConnectButton } from "thirdweb/react"
import { createWallet, inAppWallet } from "thirdweb/wallets"

const wallets = [
  inAppWallet(),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
]

export function ConnectEVMWallet() {
  return (
    <div>
      <ConnectButton
        client={thirdweb_client}
        chains={[
          {
            rpc: env_vars.SEPOLIA_RPC,
            id: env_vars.SEPOLIA_CHAIN_ID,
            testnet: true,
          },
          {
            rpc: env_vars.TRON_RPC,
            id: env_vars.TRON_CHAIN_ID,
            testnet: true,
          },
        ]}
        wallets={wallets}
        connectButton={{
          className:
            "min-w-[170px] h-[45px] py-2 px-4 !bg-sienna !text-papaya-whip font-semibold cursor-pointer",
        }}
        detailsButton={{
          className:
            "min-w-[170px] h-[45px] py-2 px-4 *:!text-sienna !bg-papaya-whip font-semibold cursor-pointer !border-none",
        }}
      />
    </div>
  )
}
