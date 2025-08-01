"use client"
import { ArrowDownUp, ChevronDown, Eye } from "lucide-react"
import Image from "next/image"
import React, { useEffect, useState } from "react"
import { Button } from "./Button"
import { Switch, Button as AntButton } from "antd"
import {
  useActiveAccount,
  useDisconnect,
  useActiveWallet,
  useConnectModal,
  useWalletBalance,
} from "thirdweb/react"
import { truncateText } from "@/utils/truncateText"
import { thirdweb_client } from "@/lib/thirdweb_client"
import { env_vars } from "@/lib/env_vars"
import { useWallet as useTronWallet } from "@tronweb3/tronwallet-adapter-react-hooks"
import { useWalletModal as useTronWalletModal } from "@tronweb3/tronwallet-adapter-react-ui"
import { tronWeb } from "@/lib/tron_client"

export const BridgeForm = () => {
  const account = useActiveAccount()
  const { disconnect: disconnectEvmWallet } = useDisconnect()
  const { connect: connectEvmWallet } = useConnectModal()
  const wallet = useActiveWallet()
  const evmTokenBalance = useWalletBalance({
    client: thirdweb_client,
    chain: {
      rpc: env_vars.SEPOLIA_RPC,
      id: env_vars.SEPOLIA_CHAIN_ID,
    },
    address: account?.address!,
  })
  const [fromAmount, setFromAmount] = useState("")
  const {
    connected: tronIsConnected,
    connect: connectTronWallet,
    address: tronAddress,
    connecting: isConnectingTronWallet,
    disconnect: disconnectTronWallet,
    wallet: tronWallet,
  } = useTronWallet()
  console.log(tronWallet)
  const tronWalletModal = useTronWalletModal()
  const [tronBalance, setTronBalance] = useState<number | null>(null)

  useEffect(() => {
    if (tronIsConnected && tronAddress) {
      tronWeb.trx
        .getBalance(tronAddress)
        .then((sun) => setTronBalance(sun / 1e6))
        .catch(() => setTronBalance(null))
    } else {
      setTronBalance(null)
    }
  }, [tronIsConnected, tronAddress])
  return (
    <div className="max-w-[440px] md:w-[440px] mt-[4rem] font-sans">
      <div className="w-full">
        <p className="font-semibold mb-4 md:text-lg">Bridge tokens</p>
        <div className="w-full">
          <div className="">
            <div className="flex items-center justify-between text-sm font-sans mb-[2px]">
              <p className="truncate">
                {truncateText(account?.address, 5, true)}
              </p>
              {wallet ? (
                <button
                  className="cursor-pointer"
                  onClick={() => disconnectEvmWallet(wallet!)}
                >
                  Disconnect
                </button>
              ) : (
                <button
                  className="cursor-pointer"
                  onClick={() => connectEvmWallet({ client: thirdweb_client })}
                >
                  Connect wallet
                </button>
              )}
            </div>
            <div className="border-1 border-sienna/30">
              <div className="h-[80px] grid grid-cols-3 gap-x-[2px]">
                <div className="col-span-2 p-4 bg-sienna/20 flex gap-2 items-center">
                  <Image
                    src={"/tokens/eth.png"}
                    height={50}
                    width={50}
                    alt=""
                  />
                  <div>
                    <p className="text-sm">Token</p>
                    <div className="flex items-center gap-1">
                      <p className="text-xl font-semibold leading-5">ETH</p>
                      <ChevronDown />
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-sienna/20 hover:bg-sienna/30 flex flex-col justify-center">
                  <p className="text-sm">Network</p>
                  <p className="text-xl font-semibold leading-5">Ethereum</p>
                </div>
              </div>

              <div className="h-[65px] flex items-center justify-between px-4">
                <div className="w-[70%] h-full flex items-center gap-2">
                  <button
                    className="text-sm min-w-[50px] h-[30px] bg-sienna/10 text-sienna font-semibold cursor-pointer"
                    onClick={() => {
                      setFromAmount(
                        Number(evmTokenBalance?.data?.displayValue).toPrecision(
                          6
                        )
                      )
                    }}
                  >
                    Max
                  </button>
                  <input
                    className="w-[100%] outline-0 text-2xl"
                    placeholder="0"
                    type="number"
                    value={fromAmount}
                    onChange={(e) => {
                      setFromAmount(e.target.value)
                    }}
                  />
                </div>
                <div className="text-end text-sm">
                  <p>Balance</p>
                  <p className="font-semibold">
                    {Number(
                      evmTokenBalance?.data?.displayValue || 0
                    ).toPrecision(4)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="my-7 flex items-center justify-center">
          <ArrowDownUp />
        </div>
        <div className="w-full">
          <div className="">
            <div className="flex items-center justify-between text-sm font-sans mb-[2px]">
              <p>{truncateText(tronAddress || "", 5, true)}</p>
              {tronIsConnected ? (
                <button
                  className="cursor-pointer"
                  onClick={disconnectTronWallet}
                >
                  Disconnect
                </button>
              ) : (
                <button
                  className="cursor-pointer"
                  onClick={() => tronWalletModal.setVisible(true)}
                >
                  Connect wallet
                </button>
              )}
            </div>
            <div className="border-1 border-sienna/30">
              <div className="h-[80px] grid grid-cols-3 gap-x-[2px]">
                <div className="col-span-2 p-4 bg-sienna/20 flex gap-2 items-center cursor-pointer hover:bg-sienna/30">
                  <Image
                    src={"/tokens/stellar.png"}
                    height={50}
                    width={50}
                    alt=""
                  />
                  <div>
                    <p className="text-sm">Token</p>
                    <div className="flex items-center gap-1">
                      <p className="text-xl font-semibold leading-5">XLM</p>
                      <ChevronDown />
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-sienna/20 hover:bg-sienna/30 flex flex-col justify-center">
                  <p className="text-sm">Network</p>
                  <p className="text-xl font-semibold leading-5">Tron</p>
                </div>
              </div>

              <div className="h-[65px] flex items-center justify-between px-4">
                <div className="w-[70%] h-full flex items-center gap-2">
                  {/* <button className="text-sm min-w-[50px] h-[30px] bg-sienna/10 text-sienna font-semibold cursor-pointer">
                    Max
                  </button> */}
                  <input
                    className="w-[100%] outline-0 text-2xl"
                    placeholder="0"
                    type="number"
                  />
                </div>
                <div className="text-end text-sm">
                  <p>Balance</p>
                  <p className="font-semibold">{tronBalance}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="my-4">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-sm">MEV Protection</p>
            <Switch />
          </div>
          <div className="text-xs">
            Bridging with MEV protection is slower due to batching mechanism
          </div>
        </div>
        <div className="my-4">
          <Button className="w-full h-[50px]">Connect wallet</Button>
        </div>
        <AntButton
          className="!text-sienna !bg-sienna/10 hover:!bg-sienna/70 hover:!text-papaya-whip"
          type="text"
        >
          <Eye size={18} className="block" />
          <p>Show chart</p>
        </AntButton>
      </div>
    </div>
  )
}
