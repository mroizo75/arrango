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

  try {
    const url = await convex.query(api.storage.getUrl, { storageId: storageId as Id<"_storage"> })
    if (!url) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    // Redirect to the actual image URL
    return NextResponse.redirect(url)
  } catch (error) {
    console.error('Error fetching image URL:', error)
    return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 })
  }
}
