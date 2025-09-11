"use client"

import type React from "react"
import { PrivyProvider } from "@privy-io/react-auth"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"
import { Toaster } from "react-hot-toast"

export function PrivyProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 3,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            staleTime: 5 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
          },
        },
      }),
  )

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || "clpuxkbhq05ycl80fwvl8b8tw"}
      config={{
        loginMethods: ["email", "google", "twitter", "sms", "wallet"],
        appearance: {
          theme: "dark",
          accentColor: "#ff3366",
          logo: "/icons/icon-192x192.png",
          landingHeader: "Welcome to NFA Bears",
          loginMessage:
            "Connect to access the member dashboard. Your Miracle SBT can only be claimed in-person at events.",
          showWalletLoginFirst: false,
        },
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: "rgba(0, 0, 0, 0.8)",
              color: "#fff",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(10px)",
            },
          }}
        />
      </QueryClientProvider>
    </PrivyProvider>
  )
}
