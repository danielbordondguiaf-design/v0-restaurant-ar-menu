import { list } from '@vercel/blob'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { blobs } = await list({ prefix: 'models/' })

    const models = blobs.map((blob) => ({
      url: blob.url,
      pathname: blob.pathname,
      filename: blob.pathname.split('/').pop() || 'unknown',
    }))

    return NextResponse.json({ models })
  } catch (error) {
    console.error('Error listing models:', error)
    return NextResponse.json({ error: 'Failed to list models' }, { status: 500 })
  }
}
