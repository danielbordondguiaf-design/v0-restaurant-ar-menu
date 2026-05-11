"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, X, Check, Palette } from "lucide-react"

export type ThemeName = "atardecer" | "bio-organic" | "vibrancia"

interface ThemeOption {
  id: ThemeName
  name: string
  description: string
  colors: {
    background: string
    primary: string
    accent: string
    secondary: string
  }
}

const themes: ThemeOption[] = [
  {
    id: "atardecer",
    name: "Atardecer en Itacaré",
    description: "Moderna y sofisticada, estilo Coastal Minimalist",
    colors: {
      background: "#FDFBF7",
      primary: "#0A4D68",
      accent: "#FF8E72",
      secondary: "#2D5A27",
    },
  },
  {
    id: "bio-organic",
    name: "Bio-Organic",
    description: "Frescura y naturaleza, ideal para ingredientes frescos",
    colors: {
      background: "#F4F1EA",
      primary: "#1B4332",
      accent: "#FFB703",
      secondary: "#BC6C25",
    },
  },
  {
    id: "vibrancia",
    name: "Vibrancia Bahiana",
    description: "Alegre pero equilibrada, colores cálidos",
    colors: {
      background: "#FFFFFF",
      primary: "#00B4D8",
      accent: "#FB8500",
      secondary: "#1D1D1D",
    },
  },
]

export function useTheme() {
  const [theme, setTheme] = useState<ThemeName>("atardecer")

  useEffect(() => {
    const savedTheme = localStorage.getItem("bahian-theme") as ThemeName
    if (savedTheme && themes.some((t) => t.id === savedTheme)) {
      setTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("bahian-theme", theme)
    document.documentElement.setAttribute("data-theme", theme)
  }, [theme])

  return { theme, setTheme, themes }
}

interface ThemeSelectorProps {
  currentTheme: ThemeName
  onThemeChange: (theme: ThemeName) => void
}

export function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="rounded-2xl hover:bg-muted/50"
        aria-label="Configuración de tema"
      >
        <Settings className="h-5 w-5 text-muted-foreground" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <Card className="w-full max-w-md rounded-3xl shadow-2xl border-0 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Paleta de Colores</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full hover:bg-muted/50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">Elige el estilo visual de tu menú</p>
            </CardHeader>
            <CardContent className="space-y-3 pb-6">
              {themes.map((themeOption) => (
                <button
                  key={themeOption.id}
                  onClick={() => {
                    onThemeChange(themeOption.id)
                    setIsOpen(false)
                  }}
                  className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                    currentTheme === themeOption.id
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-transparent bg-muted/30 hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{themeOption.name}</span>
                        {currentTheme === themeOption.id && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{themeOption.description}</p>
                      <div className="flex gap-1.5 mt-2">
                        {Object.values(themeOption.colors).map((color, index) => (
                          <div
                            key={index}
                            className="w-6 h-6 rounded-full shadow-sm border border-black/10"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
