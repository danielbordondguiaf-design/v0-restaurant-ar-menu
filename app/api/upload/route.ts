import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 })
    }

    if (!file.name.toLowerCase().endsWith(".glb")) {
      return NextResponse.json({ error: "Solo se permiten archivos .glb" }, { status: 400 })
    }

    // Store under models/ folder so they're easy to list
    const blob = await put(`models/${file.name}`, file, {
      access: "public",
      allowOverwrite: true,
    })

    return NextResponse.json({ url: blob.url, pathname: blob.pathname })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json({ error: "Error al subir el archivo" }, { status: 500 })
  }
}
