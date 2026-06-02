"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Plus, Box } from "lucide-react"
import Script from "next/script"
import { useLanguage, type LanguageCode } from "@/components/theme-selector"

interface MenuItem {
  id: string
  name: string
  description: Record<LanguageCode, string>
  price: number
  image: string
  category: string
  rating: number
  model3D?: string
}

interface ARViewerProps {
  item: MenuItem
  onBack: () => void
  onAddToCart: (item: MenuItem) => void
}

// Map of model filenames to their Blob URLs
const MODEL_URLS: Record<string, string> = {
  "fast-food.glb": "", // Will be fetched from API
  "sushi_boat_nigiri.glb": "", // Will be fetched from API
}

export function ARViewer({ item, onBack, onAddToCart }: ARViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [modelUrl, setModelUrl] = useState<string | null>(null)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { language, t } = useLanguage()

  // Fetch model URL from Blob storage
  useEffect(() => {
    async function fetchModelUrl() {
      if (!item.model3D) {
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch('/api/models')
        const data = await response.json()
        
        if (data.models) {
          const model = data.models.find((m: { filename: string; url: string }) => 
            m.filename === item.model3D
          )
          if (model) {
            setModelUrl(model.url)
          } else {
            setError("Modelo 3D no encontrado")
          }
        }
      } catch (err) {
        console.error("Error fetching model:", err)
        setError("Error al cargar el modelo 3D")
      } finally {
        setIsLoading(false)
      }
    }

    fetchModelUrl()
  }, [item.model3D])

  const has3DModel = item.model3D && modelUrl

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Load model-viewer script */}
      <Script
        src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
        type="module"
        onLoad={() => setScriptLoaded(true)}
      />

      {/* Camera simulation background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />

      {/* AR Overlay */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="p-4 bg-black/50 backdrop-blur-sm">
          <div className="flex items-center justify-between text-white">
            <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/20">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("back")}
            </Button>
            <h1 className="text-lg font-semibold">Vista AR</h1>
            <div className="w-16" />
          </div>
        </div>

        {/* AR Instructions */}
        <div className="px-4 pt-2">
          <Card className="bg-black/60 backdrop-blur-md border-0 rounded-2xl">
            <CardContent className="p-3">
              <p className="text-white/90 text-sm text-center">
                {isLoading
                  ? "Cargando modelo 3D..."
                  : has3DModel
                  ? "Toca el boton AR para ver en tu espacio real"
                  : "Modelo 3D no disponible para este plato"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* AR Content */}
        <div className="flex-1 flex items-center justify-center p-4">
          {isLoading ? (
            <div className="text-center space-y-4">
              <div className="w-32 h-32 border-4 border-primary rounded-lg animate-pulse mx-auto flex items-center justify-center">
                <div className="w-16 h-16 bg-primary/30 rounded-full animate-ping" />
              </div>
              <div className="text-white space-y-2">
                <p className="text-lg font-medium">Cargando modelo 3D...</p>
                <p className="text-sm text-white/70">Por favor espera</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center space-y-4">
              <Box className="w-16 h-16 text-white/50 mx-auto" />
              <p className="text-white/70">{error}</p>
            </div>
          ) : has3DModel && scriptLoaded ? (
            <div className="w-full h-full max-h-[60vh] rounded-3xl overflow-hidden bg-gradient-to-b from-gray-700/50 to-gray-900/50">
              {/* @ts-expect-error - model-viewer is a custom element */}
              <model-viewer
                src={modelUrl}
                ar
                ar-modes="webxr scene-viewer quick-look"
                camera-controls
                touch-action="pan-y"
                auto-rotate
                shadow-intensity="1"
                environment-image="neutral"
                alt={`Modelo 3D de ${item.name}`}
                style={{ width: "100%", height: "100%", minHeight: "300px" }}
              >
                <button
                  slot="ar-button"
                  style={{
                    backgroundColor: "var(--accent)",
                    color: "white",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: "16px",
                    fontWeight: "bold",
                    position: "absolute",
                    bottom: "16px",
                    right: "16px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                  Ver en AR
                </button>
                <div slot="progress-bar" className="w-full h-1 bg-white/20">
                  <div className="h-full bg-accent transition-all" style={{ width: "var(--progress)" }} />
                </div>
              {/* @ts-expect-error - model-viewer is a custom element */}
              </model-viewer>
            </div>
          ) : (
            // Fallback to image if no 3D model
            <Card className="w-80 bg-white/95 backdrop-blur-md shadow-2xl rounded-3xl border-0">
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-48 h-48 object-cover rounded-2xl shadow-lg"
                />
                <div className="mt-4 text-center">
                  <h3 className="font-semibold text-lg text-foreground">{item.name}</h3>
                  <p className="text-primary font-bold text-xl">R${item.price.toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="p-4">
          <Card className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border-0">
            <CardContent className="p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{item.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{item.description[language]}</p>
                  <p className="text-lg font-bold text-primary mt-1">R${item.price.toFixed(2)}</p>
                </div>
                <Button onClick={() => onAddToCart(item)} className="rounded-2xl bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg px-6">
                  <Plus className="h-4 w-4 mr-2" />
                  {t("add")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
