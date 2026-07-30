"use client"

import * as React from "react"
import toast from "react-hot-toast"
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react"
import { cn } from "@/lib/utils"

const toastStyles = {
  success: {
    icon: CheckCircle,
    container:
      "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/50",
    iconColor: "text-emerald-500",
  },
  error: {
    icon: AlertCircle,
    container:
      "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/50",
    iconColor: "text-red-500",
  },
  warning: {
    icon: AlertTriangle,
    container:
      "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/50",
    iconColor: "text-amber-500",
  },
  info: {
    icon: Info,
    container:
      "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/50",
    iconColor: "text-blue-500",
  },
}

type ToastType = keyof typeof toastStyles

interface ShowToastOptions {
  message: string
  type?: ToastType
  duration?: number
  description?: string
}

function showToast({ message, type = "info", duration = 4000, description }: ShowToastOptions) {
  const style = toastStyles[type]
  const Icon = style.icon

  toast.custom(
    (t) => (
      <div
        className={cn(
          "pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-xl border p-4 shadow-lg backdrop-blur-xl transition-all duration-300",
          style.container,
          t.visible ? "animate-in slide-in-from-top-2 fade-in" : "animate-out fade-out slide-out-to-top-2"
        )}
      >
        <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", style.iconColor)} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">{message}</p>
          {description && (
            <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="shrink-0 rounded-md p-1 text-muted-foreground/60 hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    ),
    { duration }
  )
}

function useToast() {
  return {
    success: (message: string, options?: Omit<ShowToastOptions, "message" | "type">) =>
      showToast({ ...options, message, type: "success" }),
    error: (message: string, options?: Omit<ShowToastOptions, "message" | "type">) =>
      showToast({ ...options, message, type: "error" }),
    warning: (message: string, options?: Omit<ShowToastOptions, "message" | "type">) =>
      showToast({ ...options, message, type: "warning" }),
    info: (message: string, options?: Omit<ShowToastOptions, "message" | "type">) =>
      showToast({ ...options, message, type: "info" }),
    dismiss: toast.dismiss,
  }
}

function Toaster() {
  return null
}

export { showToast, useToast, Toaster }
