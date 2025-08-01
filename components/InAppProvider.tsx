"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"

import { ThirdwebProvider } from "thirdweb/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

interface AppLayoutProps {
  children: React.ReactNode
}

const queryClient = new QueryClient()

export default function InAppLayout({ children }: AppLayoutProps) {
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <ThirdwebProvider>
          <main>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className=""
            >
              {children}
            </motion.div>
          </main>
        </ThirdwebProvider>
      </QueryClientProvider>
    </div>
  )
}
