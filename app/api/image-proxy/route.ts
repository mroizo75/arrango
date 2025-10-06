import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const storageId = searchParams.get('storageId')

  if (!storageId) {
    return NextResponse.json({ error: 'Storage ID required' }, { status: 400 })
  }

  console.log(`Image proxy request for storageId: ${storageId}`)

  // For now, always return the default OG image
  // TODO: Implement proper public image access when Convex allows it
  return NextResponse.redirect('https://arrango.no/og-image.svg', {
    headers: {
      'Cache-Control': 'public, max-age=3600',
    },
  })
}