import type React from "react"
import type { Metadata, Viewport } from "next"
import "./globals.css"
import { PrivyProviders } from "./providers/PrivyProviders"
import { LayoutProvider } from "../providers/LayoutProvider"
import { ResponsiveAppShell } from "@/components/ResponsiveAppShell"

export const metadata: Metadata = {
  title: "NFA Bears - Not Fade Away",
  description: "Grateful Dead-inspired Web3 community preserving authentic connections",
  manifest: "/manifest.json",
  generator: 'v0.app'
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#1a1aff',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
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
