import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const eventId = formData.get('eventId') as string

    if (!file || !eventId) {
      return NextResponse.json({ error: 'File and eventId required' }, { status: 400 })
    }

    // Create events directory if it doesn't exist
    const eventsDir = join(process.cwd(), 'public', 'events')
    try {
      await mkdir(eventsDir, { recursive: true })
    } catch {
      // Directory might already exist
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop()
    const filename = `${eventId}.${fileExtension}`
    const filepath = join(eventsDir, filename)

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // Generate public URL
    const publicUrl = `https://arrango.no/events/${filename}`

    // Update event with public image URL
    await convex.mutation(api.events.updateEventImageUrl, {
      eventId: eventId as Id<"events">,
      imageUrl: publicUrl
    })

    return NextResponse.json({
      success: true,
      imageUrl: publicUrl,
      filename
    })

  } catch (error) {
    console.error('Error uploading event image:', error)
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
  }
}
