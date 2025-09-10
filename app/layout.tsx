import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { MobileAppShell } from "@/components/mobile/MobileAppShell"
import { PrivyProvider } from "@privy-io/react-auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NFA Bears - Not Fade Away",
  description: "Grateful Dead-inspired Web3 community preserving authentic connections",
  manifest: "/manifest.json",
  themeColor: "#1a1aff",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PrivyProvider
          appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
          config={{
            appearance: {
              theme: "dark",
              accentColor: "#1a1aff",
            },
            embeddedWallets: {
              createOnLogin: "users-without-wallets",
            },
          }}
        >
          <MobileAppShell>{children}</MobileAppShell>
        </PrivyProvider>
      </body>
    </html>
  )
}
