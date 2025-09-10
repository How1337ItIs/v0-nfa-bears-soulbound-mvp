import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { PrivyProviders } from "./providers/PrivyProviders"
import { MobileAppShell } from "@/components/mobile/MobileAppShell"

export const metadata: Metadata = {
  title: "NFA Bears - Not Fade Away",
  description: "Grateful Dead-inspired Web3 community for live music and authentic connections",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icon-192x192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "NFA Bears",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    userScalable: false,
    themeColor: "#ff3366",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#ff3366" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="antialiased min-h-screen overflow-x-hidden">
        <PrivyProviders>
          <MobileAppShell>{children}</MobileAppShell>
        </PrivyProviders>
      </body>
    </html>
  )
}
