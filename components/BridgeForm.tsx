"use client"
import { ArrowDownUp, ChevronDown, Eye } from "lucide-react"
import Image from "next/image"
import React from "react"
import { Button } from "./Button"
import { Switch, Button as AntButton } from "antd"

export const BridgeForm = () => {
  return (
    <div className="max-w-[440px] md:w-[440px] mt-[4rem] font-sans">
      <div className="w-full">
        <p className="font-semibold mb-4 md:text-lg">Bridge tokens</p>
        <div className="w-full">
          <div className="">
            <div className="flex items-center justify-between text-sm font-sans mb-[2px]">
              <p>0x155...5c92C</p>
              <button className="cursor-pointer">Disconnect</button>
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
                  <button className="text-sm min-w-[50px] h-[30px] bg-sienna/10 text-sienna font-semibold cursor-pointer">
                    Max
                  </button>
                  <input
                    className="w-[100%] outline-0 text-2xl"
                    placeholder="0"
                    type="number"
                  />
                </div>
                <div className="text-end text-sm">
                  <p>Balance</p>
                  <p className="font-semibold">0</p>
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
              <p>0x155...5c92C</p>
              <button className="cursor-pointer">Disconnect</button>
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
                  <p className="font-semibold">0</p>
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
