import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

async function getFallbackImage() {
  try {
    const imagePath = join(process.cwd(), 'public', 'og-image.png')
    const imageBuffer = await readFile(imagePath)
    return new NextResponse(Buffer.from(imageBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch {
    return new NextResponse('Image not found', { status: 404 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const storageId = searchParams.get('storageId')

  if (!storageId) {
    return NextResponse.json({ error: 'Storage ID required' }, { status: 400 })
  }

  console.log(`[NEW CODE] Image proxy request for storageId: ${storageId}`)

  try {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!.replace('/api', '')
    const imageUrl = `${convexUrl}/api/storage/${storageId}`
    
    console.log(`[NEW CODE] Fetching from: ${imageUrl}`)

    const imageResponse = await fetch(imageUrl)
    
    if (!imageResponse.ok) {
      console.error(`Failed to fetch image: ${imageResponse.status}`)
      return await getFallbackImage()
    }

    const imageBuffer = await imageResponse.arrayBuffer()
    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg'

    return new NextResponse(Buffer.from(imageBuffer), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    console.error(`Error proxying image:`, error)
    return await getFallbackImage()
  }
}
