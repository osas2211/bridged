import type { Metadata } from "next"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
// import "../globals.css"

export const metadata: Metadata = {
  title: "Brigded App",
  description: "Brigded App",
}

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      <Header />
      <Sidebar />
      <div className="mt-[100px] ml-[100px] p-4">{children}</div>
    </div>
  )
}
