import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const storageId = searchParams.get('storageId')

  if (!storageId) {
    return NextResponse.json({ error: 'Storage ID required' }, { status: 400 })
  }

  console.log(`Image proxy request for storageId: ${storageId}`)

  // For testing: Return a simple colored square instead of fetching from Convex
  // This will help us see if the metadata and image delivery works
  const testImageSvg = `
    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="400" fill="#3b82f6"/>
      <text x="200" y="200" text-anchor="middle" fill="white" font-family="Arial" font-size="24">
        Test Image
      </text>
      <text x="200" y="230" text-anchor="middle" fill="white" font-family="Arial" font-size="12">
        ${storageId.substring(0, 8)}
      </text>
    </svg>
  `

  return new NextResponse(testImageSvg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=300',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
    },
  })
}