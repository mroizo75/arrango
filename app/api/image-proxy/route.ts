import { NextRequest, NextResponse } from 'next/server'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'

// Create Convex client for public image access
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const storageId = searchParams.get('storageId')

  if (!storageId) {
    return NextResponse.json({ error: 'Storage ID required' }, { status: 400 })
  }

  console.log(`Image proxy request for storageId: ${storageId}`)

  try {
    // Try to get the image URL using the public query
    const url = await convex.query(api.storage.getPublicImageUrl, { storageId: storageId as Id<"_storage"> })

    if (!url) {
      console.error(`Image not found for storageId: ${storageId}`)
      // Return the default OG image as fallback
      return NextResponse.redirect('https://arrango.no/og-image.svg', {
        headers: {
          'Cache-Control': 'public, max-age=3600',
        },
      })
    }

    // Fetch the image and return it directly to avoid CORS issues
    try {
      const imageResponse = await fetch(url, {
        headers: {
          'User-Agent': 'Arrango-Bot/1.0',
        },
      })

      if (!imageResponse.ok) {
        console.error(`Failed to fetch image from ${url}: ${imageResponse.status}`)
        // Return default OG image as fallback
        return NextResponse.redirect('https://arrango.no/og-image.svg', {
          headers: {
            'Cache-Control': 'public, max-age=3600',
          },
        })
      }

      const imageBuffer = await imageResponse.arrayBuffer()
      const contentType = imageResponse.headers.get('content-type') || 'image/jpeg'

      return new NextResponse(imageBuffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=3600',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
        },
      })
    } catch (fetchError) {
      console.error(`Failed to fetch image from ${url}:`, fetchError)
      // Return default OG image as fallback
      return NextResponse.redirect('https://arrango.no/og-image.svg', {
        headers: {
          'Cache-Control': 'public, max-age=3600',
        },
      })
    }
  } catch (error) {
    console.error(`Error fetching image URL for storageId ${storageId}:`, error)

    // Return default OG image as final fallback
    return NextResponse.redirect('https://arrango.no/og-image.svg', {
      headers: {
        'Cache-Control': 'public, max-age=3600',
      },
    })
  }
}