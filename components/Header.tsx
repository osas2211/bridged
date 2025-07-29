"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React from "react"
import { Button } from "./Button"

const links = [
  { pathname: "Bridge", route: "/bridge" },
  { pathname: "Swap", route: "/swap" },
  { pathname: "Transactions", route: "/" },
  { pathname: "Docs", route: "/doc" },
]

export const Header = () => {
  const pathname = usePathname()
  return (
    <header className="fixed top-0 left-0 h-[90px] w-full border-[1px] border-tan bg-papaya-whip/30 z-[10]">
      <div className="w-full h-full flex items-center justify-between mx-auto p-4 max-w-[1300px]">
        <p className="font-veneer text-[40px]">Bridged</p>
        <div>
          <div className="flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.route}
                href={link.route}
                className={`hover:font-medium ${
                  pathname === link.route ? "font-semibold underline" : ""
                }`}
              >
                {link.pathname}
              </Link>
            ))}
            <Button>Connect wallet</Button>
          </div>
        </div>
      </div>
    </header>
  )
}
