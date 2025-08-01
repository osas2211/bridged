import { useWallet } from "@tronweb3/tronwallet-adapter-react-hooks"
import { WalletActionButton } from "@tronweb3/tronwallet-adapter-react-ui"
import "@tronweb3/tronwallet-adapter-react-ui/style.css"

export function ConnectTronWallet() {
  return (
    <>
      <ConnectComponent></ConnectComponent>
      <Profile></Profile>
    </>
  )
}
function ConnectComponent() {
  const { connect, disconnect, select, connected } = useWallet()
  return <WalletActionButton />
}
function Profile() {
  const { address, connected, wallet } = useWallet()
  return (
    <div>
      <p>
        <span>Connection Status:</span>{" "}
        {connected ? "Connected" : "Disconnected"}
      </p>
      <p>
        <span>Your selected Wallet:</span> {wallet?.adapter.name}
      </p>
      <p>
        <span>Your Address:</span> {address}
      </p>
    </div>
  )
}
