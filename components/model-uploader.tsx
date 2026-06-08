"use client"

import type React from "react"

import { useState, useRef } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { Item, ItemContent, ItemMedia, ItemTitle, ItemDescription } from "@/components/ui/item"
import { Upload, Box, CheckCircle2, AlertCircle, ArrowLeft, Copy, Check } from "lucide-react"
import Link from "next/link"

interface ModelInfo {
  name: string
  pathname: string
  url: string
  size: number
  uploadedAt: string
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
}

export function ModelUploader() {
  const { data, mutate, isLoading } = useSWR<{ models: ModelInfo[] }>("/api/models", fetcher)
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const models = data?.models ?? []

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setStatus(null)

    for (const file of Array.from(files)) {
      if (!file.name.toLowerCase().endsWith(".glb")) {
        setStatus({ type: "error", message: `${file.name} no es un archivo .glb válido` })
        continue
      }

      setUploading(true)
      try {
        const formData = new FormData()
        formData.append("file", file)

        const res = await fetch("/api/upload", { method: "POST", body: formData })
        const result = await res.json()

        if (!res.ok) {
          throw new Error(result.error || "Error al subir")
        }

        setStatus({ type: "success", message: `${file.name} subido correctamente` })
        await mutate()
      } catch (err) {
        setStatus({
          type: "error",
          message: err instanceof Error ? err.message : "Error al subir el archivo",
        })
      } finally {
        setUploading(false)
      }
    }
  }

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    setCopiedUrl(url)
    setTimeout(() => setCopiedUrl(null), 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 pt-2">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-2xl">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-primary">Modelos 3D</h1>
            <p className="text-sm text-muted-foreground">Sube tus archivos .glb para el menú AR</p>
          </div>
        </div>

        {/* Upload zone */}
        <Card className="rounded-3xl border-0 shadow-md">
          <CardContent className="p-6">
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault()
                setDragOver(false)
                handleFiles(e.dataTransfer.files)
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 cursor-pointer transition-colors ${
                dragOver ? "border-primary bg-primary/5" : "border-border bg-muted/30 hover:bg-muted/50"
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                {uploading ? <Spinner className="h-6 w-6 text-primary" /> : <Upload className="h-6 w-6 text-primary" />}
              </div>
              <div className="text-center">
                <p className="font-medium text-foreground">
                  {uploading ? "Subiendo..." : "Arrastra o haz clic para subir"}
                </p>
                <p className="text-sm text-muted-foreground">Archivos .glb</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".glb"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </div>

            {status && (
              <div
                className={`mt-4 flex items-center gap-2 rounded-2xl p-3 text-sm ${
                  status.type === "success"
                    ? "bg-primary/10 text-primary"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                {status.type === "success" ? (
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                )}
                <span>{status.message}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Existing models */}
        <Card className="rounded-3xl border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Modelos disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Spinner className="h-6 w-6 text-primary" />
              </div>
            ) : models.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Box className="h-6 w-6" />
                  </EmptyMedia>
                  <EmptyTitle>Sin modelos</EmptyTitle>
                  <EmptyDescription>Sube tu primer archivo .glb para empezar</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <div className="space-y-3">
                {models.map((model) => (
                  <Item key={model.pathname} variant="outline" className="rounded-2xl">
                    <ItemMedia variant="icon">
                      <Box className="h-5 w-5" />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{model.name}</ItemTitle>
                      <ItemDescription>{formatBytes(model.size)}</ItemDescription>
                    </ItemContent>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyUrl(model.url)}
                      className="rounded-xl"
                    >
                      {copiedUrl === model.url ? (
                        <Check className="h-4 w-4 text-primary" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </Item>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
