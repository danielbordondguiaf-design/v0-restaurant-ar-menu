"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, RotateCcw, ZoomIn, ZoomOut, Plus } from "lucide-react"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  rating: number
}

interface ARViewerProps {
  item: MenuItem
  onBack: () => void
  onAddToCart: (item: MenuItem) => void
}

export function ARViewer({ item, onBack, onAddToCart }: ARViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [rotation, setRotation] = useState(0)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    // Simulate AR loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  const handleRotate = () => {
    setRotation((prev) => prev + 90)
  }

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 2))
  }

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5))
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Camera simulation background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-80" />

      {/* AR Overlay */}
      <div className="relative z-10 h-full">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-4 bg-black/50 backdrop-blur-sm">
          <div className="flex items-center justify-between text-white">
            <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/20">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <h1 className="text-lg font-semibold">Vista AR</h1>
            <div className="w-16" />
          </div>
        </div>

        {/* AR Content */}
        <div className="flex items-center justify-center h-full p-4">
          {isLoading ? (
            <div className="text-center space-y-4">
              <div className="w-32 h-32 border-4 border-primary rounded-lg animate-pulse mx-auto flex items-center justify-center">
                <div className="w-16 h-16 bg-primary/30 rounded-full animate-ping" />
              </div>
              <div className="text-white space-y-2">
                <p className="text-lg font-medium">Detectando superficie...</p>
                <p className="text-sm text-white/70">Apunta tu cámara hacia uma mesa</p>
              </div>
            </div>
          ) : (
            <div className="relative">
              {/* 3D Model Simulation */}
              <div
                className="float-animation"
                style={{
                  transform: `rotate(${rotation}deg) scale(${scale})`,
                  transition: "transform 0.3s ease",
                }}
              >
                <Card className="w-80 h-80 bg-white/95 backdrop-blur-md shadow-2xl rounded-3xl border-0">
                  <CardContent className="p-6 h-full flex flex-col items-center justify-center">
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
              </div>

              {/* AR Surface Indicator */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                <div className="w-64 h-2 bg-primary/30 rounded-full">
                  <div className="w-full h-full bg-primary rounded-full animate-pulse" />
                </div>
                <p className="text-white/70 text-xs text-center mt-2">Superficie detectada</p>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        {!isLoading && (
          <>
            {/* AR Controls */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 space-y-3">
              <Button variant="secondary" size="sm" onClick={handleRotate} className="w-12 h-12 rounded-2xl shadow-lg bg-white/90 backdrop-blur-sm hover:bg-white">
                <RotateCcw className="h-4 w-4 text-foreground" />
              </Button>
              <Button variant="secondary" size="sm" onClick={handleZoomIn} className="w-12 h-12 rounded-2xl shadow-lg bg-white/90 backdrop-blur-sm hover:bg-white">
                <ZoomIn className="h-4 w-4 text-foreground" />
              </Button>
              <Button variant="secondary" size="sm" onClick={handleZoomOut} className="w-12 h-12 rounded-2xl shadow-lg bg-white/90 backdrop-blur-sm hover:bg-white">
                <ZoomOut className="h-4 w-4 text-foreground" />
              </Button>
            </div>

            {/* Bottom Actions */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <Card className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border-0">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{item.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                      <p className="text-lg font-bold text-primary mt-1">R${item.price.toFixed(2)}</p>
                    </div>
                    <Button onClick={() => onAddToCart(item)} className="rounded-2xl bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg px-6">
                      <Plus className="h-4 w-4 mr-2" />
                      Añadir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* AR Instructions */}
        <div className="absolute top-20 left-4 right-4">
          <Card className="bg-black/60 backdrop-blur-md border-0 rounded-2xl">
            <CardContent className="p-3">
              <p className="text-white/90 text-sm text-center">
                {isLoading
                  ? "Mueve tu dispositivo lentamente para detectar la superficie"
                  : "Usa los controles para rotar y hacer zoom del plato"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
