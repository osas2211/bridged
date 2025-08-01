"use client"

import type React from "react"

import { ThirdwebProvider } from "thirdweb/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "react-hot-toast"
import { WalletProvider } from "@tronweb3/tronwallet-adapter-react-hooks"
import { WalletModalProvider } from "@tronweb3/tronwallet-adapter-react-ui"
import "@tronweb3/tronwallet-adapter-react-ui/style.css"
import {
  WalletDisconnectedError,
  WalletError,
  WalletNotFoundError,
} from "@tronweb3/tronwallet-abstract-adapter"
import toast from "react-hot-toast"

interface AppLayoutProps {
  children: React.ReactNode
}

const queryClient = new QueryClient()

export default function InAppLayout({ children }: AppLayoutProps) {
  function onError(e: WalletError) {
    if (e instanceof WalletNotFoundError) {
      toast.error(e.message)
    } else if (e instanceof WalletDisconnectedError) {
      toast.error(e.message)
    } else toast.error(e.message)
  }
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <ThirdwebProvider>
          <WalletProvider onError={onError}>
            <WalletModalProvider>
              <main>{children}</main>
            </WalletModalProvider>
          </WalletProvider>

          <Toaster />
        </ThirdwebProvider>
      </QueryClientProvider>
    </div>
  )
}
