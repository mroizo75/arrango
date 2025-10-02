import { MetadataRoute } from 'next'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '@/convex/_generated/api'

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://arrango.no'

  // Get all events
  const events = await convex.query(api.events.get)
  const eventUrls = events.map((event) => ({
    url: `${baseUrl}/event/${event._id}`,
    lastModified: new Date(event.eventDate),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Get all organizers - for now return empty array
  const organizers: Array<{ slug: string }> = []
  const organizerUrls = organizers.map((organizer) => ({
    url: `${baseUrl}/organizer/${organizer.slug}`,
    lastModified: new Date(), // Since we don't have lastModified for users, use current date
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Static pages
  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/arrangorer`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/organizer`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ]

  return [...staticUrls, ...eventUrls, ...organizerUrls]
}
