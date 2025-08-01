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
import gsap from "gsap"

const nativeTokens: Record<
  "ETH" | "TRON",
  {
    symbol: string
    name: string
    icon: string
  }
> = {
  ETH: {
    symbol: "ETH",
    name: "Ethereum",
    icon: "/tokens/eth.png",
  },
  TRON: {
    symbol: "TRX",
    name: "TRON",
    icon: "/tokens/tron.png",
  },
}

export const BridgeForm = () => {
  const [fromNetwork, setFromNetWork] = useState<"ETH" | "TRON">("ETH")
  const [toNetwork, setToNetWork] = useState<"ETH" | "TRON">("TRON")

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
  const [toAmount, setToAmount] = useState("")

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
  const [tronBalance, setTronBalance] = useState<number | null>(0)

  const connectFromWallet = () => {
    if (fromNetwork === "ETH") {
      connectEvmWallet({ client: thirdweb_client })
    } else {
      connectTronWallet()
    }
  }

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

  const fromIsConnected =
    fromNetwork === "ETH"
      ? Boolean(wallet)
      : fromNetwork === "TRON"
      ? tronIsConnected
      : false
  const toIsConnected =
    toNetwork === "ETH"
      ? Boolean(wallet)
      : toNetwork === "TRON"
      ? tronIsConnected
      : false
  const fromBalance =
    fromNetwork === "ETH" ? evmTokenBalance?.data?.displayValue! : tronBalance
  const toBalance =
    toNetwork === "ETH" ? evmTokenBalance?.data?.displayValue! : tronBalance
  const switchNetworkPosition = () => {
    if (fromNetwork === "ETH") {
      setFromNetWork("TRON")
      setToNetWork("ETH")
    } else {
      setToNetWork("TRON")
      setFromNetWork("ETH")
    }
    let fromPrevAmount = fromAmount
    setFromAmount(toAmount)
    setToAmount(fromPrevAmount)

    gsap.fromTo(".fromNetwork", { y: 200, rotate: 180 }, { y: 0, rotate: 0 })
    gsap.fromTo(".toNetwork", { y: -200, rotate: -180 }, { y: 0, rotate: 0 })
    gsap.fromTo(".switch-icon", { rotate: -180 }, { rotate: 0 })
  }

  return (
    <div className="max-w-[440px] md:w-[440px] mt-[4rem] font-sans">
      <div className="w-full">
        <p className="font-semibold mb-4 md:text-lg">Bridge tokens</p>
        <div className="w-full fromNetwork">
          <div className="">
            <div className="flex items-center justify-between text-sm font-sans mb-[2px]">
              <p className="truncate">
                {fromNetwork === "ETH"
                  ? truncateText(account?.address, 5, true)
                  : truncateText(tronAddress || "", 5, true)}
              </p>
              {fromIsConnected ? (
                <button
                  className="cursor-pointer"
                  onClick={() => {
                    fromNetwork === "ETH"
                      ? disconnectEvmWallet(wallet!)
                      : disconnectTronWallet()
                  }}
                >
                  Disconnect
                </button>
              ) : (
                <button
                  className="cursor-pointer"
                  onClick={() => {
                    fromNetwork === "ETH"
                      ? connectEvmWallet({ client: thirdweb_client })
                      : tronWalletModal.setVisible(true)
                  }}
                >
                  Connect wallet
                </button>
              )}
            </div>
            <div className="border-1 border-sienna/30">
              <div className="h-[80px] grid grid-cols-3 gap-x-[2px]">
                <div className="col-span-2 p-4 bg-sienna/20 flex gap-2 items-center">
                  <Image
                    src={nativeTokens[fromNetwork].icon}
                    height={50}
                    width={50}
                    alt=""
                  />
                  <div>
                    <p className="text-sm">Token</p>
                    <div className="flex items-center gap-1">
                      <p className="text-xl font-semibold leading-5">
                        {nativeTokens[fromNetwork].symbol}
                      </p>
                      <ChevronDown />
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-sienna/20 hover:bg-sienna/30 flex flex-col justify-center">
                  <p className="text-sm">Network</p>
                  <p className="text-xl font-semibold leading-5">
                    {nativeTokens[fromNetwork].name}
                  </p>
                </div>
              </div>

              <div className="h-[65px] flex items-center justify-between px-4">
                <div className="w-[70%] h-full flex items-center gap-2">
                  <button
                    className="text-sm min-w-[50px] h-[30px] bg-sienna/10 text-sienna font-semibold cursor-pointer"
                    onClick={() => {
                      setFromAmount(Number(fromBalance).toPrecision(6))
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
                    {Number(fromBalance || 0).toPrecision(4)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DIVIDERRRRRRRRRRRR */}
        <div className="my-7 flex items-center justify-center relative z-[100]">
          <ArrowDownUp
            className="cursor-pointer switch-icon"
            onClick={switchNetworkPosition}
          />
        </div>
        {/* DIVIDERRRRRRRRRRRR */}

        <div className="w-full toNetwork">
          <div className="">
            <div className="flex items-center justify-between text-sm font-sans mb-[2px]">
              <p>
                {toNetwork === "ETH"
                  ? truncateText(account?.address, 5, true)
                  : truncateText(tronAddress || "", 5, true)}
              </p>
              {toIsConnected ? (
                <button
                  className="cursor-pointer"
                  onClick={() => {
                    {
                      toNetwork === "ETH"
                        ? disconnectEvmWallet(wallet!)
                        : disconnectTronWallet()
                    }
                  }}
                >
                  Disconnect
                </button>
              ) : (
                <button
                  className="cursor-pointer"
                  onClick={() => {
                    toNetwork === "ETH"
                      ? connectEvmWallet({ client: thirdweb_client })
                      : tronWalletModal.setVisible(true)
                  }}
                >
                  Connect wallet
                </button>
              )}
            </div>
            <div className="border-1 border-sienna/30">
              <div className="h-[80px] grid grid-cols-3 gap-x-[2px]">
                <div className="col-span-2 p-4 bg-sienna/20 flex gap-2 items-center cursor-pointer hover:bg-sienna/30">
                  <Image
                    src={nativeTokens[toNetwork].icon}
                    height={50}
                    width={50}
                    alt=""
                  />
                  <div>
                    <p className="text-sm">Token</p>
                    <div className="flex items-center gap-1">
                      <p className="text-xl font-semibold leading-5">
                        {nativeTokens[toNetwork].symbol}
                      </p>
                      <ChevronDown />
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-sienna/20 hover:bg-sienna/30 flex flex-col justify-center">
                  <p className="text-sm">Network</p>
                  <p className="text-xl font-semibold leading-5">
                    {nativeTokens[toNetwork].name}
                  </p>
                </div>
              </div>

              <div className="h-[65px] flex items-center justify-between px-4">
                <div className="w-[70%] h-full flex items-center gap-2">
                  <input
                    className="w-[100%] outline-0 text-2xl"
                    placeholder="0"
                    type="number"
                    disabled
                    value={toAmount}
                  />
                </div>
                <div className="text-end text-sm">
                  <p>Balance</p>
                  <p className="font-semibold">
                    {Number(toBalance || 0).toPrecision(4)}
                  </p>
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
          {fromIsConnected ? (
            <Button className="w-full h-[50px]">Swap Token</Button>
          ) : (
            <Button className="w-full h-[50px]" onClick={connectFromWallet}>
              Connect wallet
            </Button>
          )}
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
