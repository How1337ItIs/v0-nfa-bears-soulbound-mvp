import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { PrivyProviders } from "./providers/PrivyProviders"
import { LayoutProvider } from "@/providers/LayoutProvider"
import { ResponsiveAppShell } from "@/components/ResponsiveAppShell"

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
      <head>
        <meta name="theme-color" content="#1a1aff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="antialiased">
        <PrivyProviders>
          <LayoutProvider>
            <ResponsiveAppShell>{children}</ResponsiveAppShell>
          </LayoutProvider>
        </PrivyProviders>
      </body>
    </html>
  )
}
