"use client"

import type { ReactNode } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Navigation } from "@/components/navigation"
import { ToastContainer } from "@/components/toast"
import { useToast } from "@/hooks/useToast"
import { MockStateProvider } from "@/context/mock-state-provider"

const queryClient = new QueryClient()

function AppContent({ children }: { children: ReactNode }) {
  const { toasts, removeToast } = useToast()
  return (
    <MockStateProvider>
      <div className="min-h-screen bg-black">
        <Navigation />
        <main>{children}</main>
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    </MockStateProvider>
  )
}

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent>{children}</AppContent>
    </QueryClientProvider>
  )
}
