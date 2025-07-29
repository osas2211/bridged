"use client"
import React from "react"
import { ConfigProvider, theme } from "antd"
import { AntdRegistry } from "@ant-design/nextjs-registry"

export const AntConfigProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <AntdRegistry>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#b1560e",
            fontFamily: "var(--font-sans)",
            // colorText: "#fdfdff",
          },
          algorithm: theme.darkAlgorithm,
          components: {
            Button: { primaryColor: "#b1560e" },
            Input: { colorBgContainer: "transparent" },
            DatePicker: { colorBgContainer: "transparent" },
          },
        }}
      >
        {children}
      </ConfigProvider>
    </AntdRegistry>
  )
}
