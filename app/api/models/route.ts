import { list } from "@vercel/blob"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const { blobs } = await list({ prefix: "models/" })

    const models = blobs
      .filter((blob) => blob.pathname.toLowerCase().endsWith(".glb"))
      .map((blob) => ({
        name: blob.pathname.split("/").pop() || blob.pathname,
        pathname: blob.pathname,
        url: blob.url,
        size: blob.size,
        uploadedAt: blob.uploadedAt,
      }))

    return NextResponse.json({ models })
  } catch (error) {
    console.error("[v0] Error listing models:", error)
    return NextResponse.json({ error: "Error al listar los modelos", models: [] }, { status: 500 })
  }
}
