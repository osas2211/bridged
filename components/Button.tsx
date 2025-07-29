import React from "react"

type BottonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export const Button: React.FC<BottonProps> = (props) => {
  return (
    <button
      {...props}
      className={`min-w-[170px] h-[45px] py-2 px-4 bg-sienna text-papaya-whip font-semibold cursor-pointer ${props.className}`}
    >
      {props.children}
    </button>
  )
}
