"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { QrCode, Camera, Utensils, Sparkles } from "lucide-react"
import { MenuApp } from "@/components/menu-app"

export default function HomePage() {
  const [showMenu, setShowMenu] = useState(false)
  const [isScanning, setIsScanning] = useState(false)

  const handleScanQR = () => {
    setIsScanning(true)
    // Simulate QR scanning process
    setTimeout(() => {
      setIsScanning(false)
      setShowMenu(true)
    }, 2000)
  }

  if (showMenu) {
    return <MenuApp />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Utensils className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">MenuAR</h1>
          </div>
          <p className="text-muted-foreground text-balance">Descubre nuestro menú interactivo con realidad aumentada</p>
        </div>

        {/* QR Scanner Card */}
        <Card className="overflow-hidden">
          <CardContent className="p-8 text-center space-y-6">
            {!isScanning ? (
              <>
                <div className="qr-scanner-frame w-48 h-48 mx-auto flex items-center justify-center bg-muted/30">
                  <QrCode className="h-24 w-24 text-muted-foreground" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Escanea el código QR</h2>
                  <p className="text-sm text-muted-foreground">
                    Apunta tu cámara al código QR de tu mesa para acceder al menú
                  </p>
                  <Button onClick={handleScanQR} size="lg" className="w-full">
                    <Camera className="mr-2 h-5 w-5" />
                    Escanear QR
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-6">
                <div className="qr-scanner-frame w-48 h-48 mx-auto flex items-center justify-center bg-primary/10 pulse-glow">
                  <div className="w-32 h-32 border-4 border-primary rounded-lg animate-pulse flex items-center justify-center">
                    <Camera className="h-12 w-12 text-primary" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">Escaneando...</h2>
                  <p className="text-sm text-muted-foreground">Mantén el código QR dentro del marco</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Demo Button */}
        <Button variant="outline" onClick={() => setShowMenu(true)} className="w-full">
          <Sparkles className="mr-2 h-4 w-4" />
          Ver menú demo
        </Button>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-2">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <QrCode className="h-6 w-6 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">Escaneo rápido</p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
              <Utensils className="h-6 w-6 text-accent" />
            </div>
            <p className="text-xs text-muted-foreground">Menú interactivo</p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">Vista AR</p>
          </div>
        </div>
      </div>
    </div>
  )
}
