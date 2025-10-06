import { NextRequest, NextResponse } from 'next/server'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'

// Create Convex client without auth for public image access
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const storageId = searchParams.get('storageId')

  if (!storageId) {
    return NextResponse.json({ error: 'Storage ID required' }, { status: 400 })
  }

  try {
    // Try to get the image URL using the public action
    const url = await convex.action(api.storage.getPublicImageUrl, { storageId: storageId as Id<"_storage"> })

    if (!url) {
      console.error(`Image not found for storageId: ${storageId}`)
      // Return a 1x1 transparent PNG as fallback to avoid broken images
      const transparentPng = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
      return new NextResponse(Buffer.from(transparentPng, 'base64'), {
        status: 200,
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
        },
      })
    }

    // Redirect to the actual image URL with caching headers
    return NextResponse.redirect(url, {
      headers: {
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    })
  } catch (error) {
    console.error(`Error fetching image URL for storageId ${storageId}:`, error)

    // Return a 1x1 transparent PNG as fallback instead of error
    const transparentPng = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
    return new NextResponse(Buffer.from(transparentPng, 'base64'), {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=300',
      },
    })
  }
}
