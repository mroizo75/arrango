import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

async function getFallbackImage() {
  try {
    // Try to read the fallback image from public folder
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
    // If that fails, return a simple response
    return new NextResponse('Image not found', { status: 404 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const storageId = searchParams.get('storageId')

  if (!storageId) {
    return NextResponse.json({ error: 'Storage ID required' }, { status: 400 })
  }

  console.log(`Image proxy request for storageId: ${storageId}`)

  try {
    // Build the Convex storage URL directly (no need to query Convex)
    // Format: https://[deployment].convex.cloud/api/storage/[storageId]
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!.replace('/api', '')
    const imageUrl = `${convexUrl}/api/storage/${storageId}`
    
    console.log(`Fetching image from Convex URL: ${imageUrl}`)

    // Fetch the image from Convex and proxy it
    // This ensures social media crawlers can access it without authentication issues
    const imageResponse = await fetch(imageUrl)
    
    if (!imageResponse.ok) {
      console.error(`Failed to fetch image from Convex: ${imageResponse.status}`)
      return await getFallbackImage()
    }

    const imageBuffer = await imageResponse.arrayBuffer()
    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg'

    // Return the image with proper cache headers for social media
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable', // Cache for 1 year since storage IDs don't change
        'Access-Control-Allow-Origin': '*', // Allow social media crawlers
      },
    })
  } catch (error) {
    console.error(`Error proxying image for storageId ${storageId}:`, error)
    return await getFallbackImage()
  }
}