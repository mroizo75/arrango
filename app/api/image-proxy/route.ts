import { NextRequest, NextResponse } from 'next/server'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const storageId = searchParams.get('storageId')

  if (!storageId) {
    return NextResponse.json({ error: 'Storage ID required' }, { status: 400 })
  }

  console.log(`Image proxy request for storageId: ${storageId}`)

  try {
    // Get the direct Convex storage URL
    const url = await convex.query(api.storage.getPublicImageUrl, { storageId: storageId as Id<"_storage"> })

    if (!url) {
      console.error(`Image not found for storageId: ${storageId}`)
      return NextResponse.redirect('/og-image.svg', {
        headers: {
          'Cache-Control': 'public, max-age=3600',
        },
      })
    }

    console.log(`Redirecting to Convex URL: ${url}`)

    // Simply redirect to the direct Convex URL
    // Social media crawlers should be able to follow redirects
    return NextResponse.redirect(url, {
      headers: {
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    console.error(`Error fetching image URL for storageId ${storageId}:`, error)

    // Return default OG image as final fallback
    return NextResponse.redirect('/og-image.svg', {
      headers: {
        'Cache-Control': 'public, max-age=3600',
      },
    })
  }
}