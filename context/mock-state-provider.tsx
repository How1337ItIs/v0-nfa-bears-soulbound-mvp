"use client"

import { createContext, useState, useEffect, useContext, type ReactNode } from "react"
import { useToast } from "@/hooks/useToast"

interface MockState {
  isAuthenticated: boolean
  user: { wallet: { address: string }; email?: string } | null
  hasMinted: boolean
  isMintStatusLoading: boolean
  isMinting: boolean
  login: () => void
  logout: () => void
  mintSBT: () => Promise<void>
}

const MockStateContext = createContext<MockState | undefined>(undefined)

export function MockStateProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [hasMinted, setHasMinted] = useState(false)
  const [isMintStatusLoading, setIsMintStatusLoading] = useState(false)
  const [isMinting, setIsMinting] = useState(false)
  const { addToast } = useToast()

  const mockUser = {
    wallet: {
      address: "0x1234567890123456789012345678901234567890",
    },
    email: "cosmic.bear@nfabears.xyz",
  }

  useEffect(() => {
    if (isAuthenticated) {
      setIsMintStatusLoading(true)
      const timer = setTimeout(() => {
        setIsMintStatusLoading(false)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [isAuthenticated])

  const login = () => setIsAuthenticated(true)
  const logout = () => {
    setIsAuthenticated(false)
    setHasMinted(false)
  }

  const mintSBT = async () => {
    setIsMinting(true)
    addToast({ title: "Minting Initiated", description: "Simulating transaction...", type: "info" })
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setHasMinted(true)
    setIsMinting(false)
    addToast({ title: "Success!", description: "Your SBT has been minted.", type: "success" })
  }

  const value = {
    isAuthenticated,
    user: isAuthenticated ? mockUser : null,
    hasMinted,
    isMintStatusLoading,
    isMinting,
    login,
    logout,
    mintSBT,
  }

  return <MockStateContext.Provider value={value}>{children}</MockStateContext.Provider>
}

export function useMockState() {
  const context = useContext(MockStateContext)
  if (context === undefined) {
    throw new Error("useMockState must be used within a MockStateProvider")
  }
  return context
}
