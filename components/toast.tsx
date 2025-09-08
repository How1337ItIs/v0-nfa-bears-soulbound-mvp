"use client"

import { useEffect } from "react"
import { X } from "lucide-react"

export interface Toast {
  id: string
  title: string
  description?: string
  type: "success" | "error" | "info" | "warning"
}

interface ToastProps {
  toast: Toast
  onRemove: (id: string) => void
}

export function ToastItem({ toast, onRemove }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id)
    }, 5000)

    return () => clearTimeout(timer)
  }, [toast.id, onRemove])

  const getToastStyles = () => {
    switch (toast.type) {
      case "success":
        return "bg-green-500/20 border-green-500/30 text-green-400"
      case "error":
        return "bg-red-500/20 border-red-500/30 text-red-400"
      case "warning":
        return "bg-yellow-500/20 border-yellow-500/30 text-yellow-400"
      default:
        return "bg-blue-500/20 border-blue-500/30 text-blue-400"
    }
  }

  return (
    <div className={`glassmorphic rounded-lg p-4 border ${getToastStyles()} float-animation`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-semibold text-white">{toast.title}</h4>
          {toast.description && <p className="text-sm text-white/80 mt-1">{toast.description}</p>}
        </div>
        <button onClick={() => onRemove(toast.id)} className="ml-4 text-white/60 hover:text-white transition-colors">
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  )
}
