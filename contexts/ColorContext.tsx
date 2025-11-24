"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type ColorContextType = {
  accentColor: string
  setAccentColor: (color: string) => void
}

const ColorContext = createContext<ColorContextType | undefined>(undefined)

const COLOR_PRESETS = {
  blue: "#0a84ff",
  purple: "#a855f7",
  green: "#10b981",
  indigo: "#6366f1",
  red: "#ef4444",
}

export function ColorProvider({ children }: { children: React.ReactNode }) {
  const [accentColor, setAccentColorState] = useState("#0a84ff")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem("cgpa_settings")
    if (saved) {
      try {
        const settings = JSON.parse(saved)
        if (settings.accentColor) {
          setAccentColorState(settings.accentColor)
        }
      } catch (e) {
        console.error("Failed to parse settings:", e)
      }
    }
    setMounted(true)
  }, [])

  const setAccentColor = (color: string) => {
    setAccentColorState(color)
    try {
      const settings = { accentColor: color }
      localStorage.setItem("cgpa_settings", JSON.stringify(settings))
    } catch (e) {
      console.error("Failed to save settings:", e)
    }
    // Update CSS variable
    document.documentElement.style.setProperty("--accent-dynamic", color)
  }

  useEffect(() => {
    if (mounted) {
      document.documentElement.style.setProperty("--accent-dynamic", accentColor)
    }
  }, [accentColor, mounted])

  return <ColorContext.Provider value={{ accentColor, setAccentColor }}>{children}</ColorContext.Provider>
}

export function useColor() {
  const context = useContext(ColorContext)
  if (!context) {
    throw new Error("useColor must be used within ColorProvider")
  }
  return context
}

export { COLOR_PRESETS }
