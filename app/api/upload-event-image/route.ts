import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function GET(request: NextRequest) {
  // Migrate existing images from Convex to public folder
  try {
    const events = await convex.query(api.events.get)

    for (const event of events) {
      if (event.imageStorageId && !event.imageUrl) {
        try {
          // Get the Convex storage URL
          const convexUrl = await convex.query(api.storage.getUrl, { storageId: event.imageStorageId })

          if (convexUrl) {
            // Fetch the image from Convex
            const response = await fetch(convexUrl)
            if (response.ok) {
              const arrayBuffer = await response.arrayBuffer()
              const buffer = Buffer.from(arrayBuffer)

              // Create events directory
              const eventsDir = join(process.cwd(), 'public', 'events')
              await mkdir(eventsDir, { recursive: true })

              // Save with event ID as filename
              const filename = `${event._id}.webp`
              const filepath = join(eventsDir, filename)
              await writeFile(filepath, buffer)

              // Update event with public URL
              const publicUrl = `https://arrango.no/events/${filename}`
              await convex.mutation(api.events.updateEventImageUrl, {
                eventId: event._id,
                imageUrl: publicUrl
              })

              console.log(`Migrated image for event ${event._id}`)
            }
          }
        } catch (error) {
          console.error(`Failed to migrate image for event ${event._id}:`, error)
        }
      }
    }

    return NextResponse.json({ success: true, message: 'Migration completed' })
  } catch (error) {
    console.error('Migration failed:', error)
    return NextResponse.json({ error: 'Migration failed' }, { status: 500 })
  }
}

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
