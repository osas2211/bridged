"use client"
import { Github, Share, Twitter } from "lucide-react"
import React from "react"

export const Sidebar = () => {
  return (
    <aside className="fixed top-[90px] left-0 h-full w-[100px] border-r-[1px] border-tan pt-[46px] p-4">
      <div className="w-full flex flex-col items-center justify-center gap-10">
        <div className="w-[2.5rem] h-[2.5rem] rounded-full border-[1px] border-sienna flex items-center justify-center cursor-pointer hover:bg-sienna hover:text-papaya-whip transition-colors">
          <Github size={15} />
        </div>
        <div className="w-[2.5rem] h-[2.5rem] rounded-full border-[1px] border-sienna flex items-center justify-center cursor-pointer hover:bg-sienna hover:text-papaya-whip transition-colors">
          <Twitter size={15} />
        </div>
        <div className="w-[2.5rem] h-[2.5rem] rounded-full border-[1px] border-sienna flex items-center justify-center cursor-pointer hover:bg-sienna hover:text-papaya-whip transition-colors">
          <Share size={15} />
        </div>
      </div>
    </aside>
  )
}
