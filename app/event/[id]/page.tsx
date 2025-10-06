import { Metadata } from "next";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import EventPageClient from "./EventPageClient";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const event = await convex.query(api.events.getById, {
      eventId: resolvedParams.id as Id<"events">,
    });

    if (!event) {
      return {
        title: "Event ikke funnet | Arrango",
        description: "Det arrangementet du leter etter finnes ikke.",
        openGraph: {
          title: "Event ikke funnet | Arrango",
          description: "Det arrangementet du leter etter finnes ikke.",
          images: [
            {
              url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.arrango.no'}/og-image.png`,
              width: 1200,
              height: 630,
              alt: "Arrango - Billettplattform",
            },
          ],
        },
      };
    }

    const eventDate = new Date(event.eventDate);
    const formattedDate = eventDate.toLocaleDateString("nb-NO", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const description = `${event.name} - ${formattedDate} i ${event.location}. ${event.description?.substring(0, 150)}...`;

    console.log(`Generating metadata for event: ${event.name}, imageStorageId: ${event.imageStorageId}`);

    // Get the Convex storage URL directly for Open Graph
    // This is more reliable than using a proxy
    let imageUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.arrango.no'}/og-image.png`;
    
    if (event.imageStorageId) {
      try {
        const convexImageUrl = await convex.query(api.storage.getPublicImageUrl, { 
          storageId: event.imageStorageId 
        });
        if (convexImageUrl) {
          imageUrl = convexImageUrl;
        }
      } catch (e) {
        console.error('Failed to get image URL from Convex:', e);
        // Fall back to default image
      }
    }

    const metadata = {
      title: `${event.name} | Arrango`,
      description,
      keywords: [
        event.name,
        event.location,
        "billetter",
        "arrangement",
        "konsert",
        "festival",
        "teater",
        "event",
        "billett",
        "tickets",
        event.location.split(",")[0], // City
        formattedDate,
      ],
      openGraph: {
        title: `${event.name} - ${formattedDate}`,
        description,
        type: "website",
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.arrango.no'}/event/${resolvedParams.id}`,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: `${event.name} - ${event.location}`,
          },
        ],
        siteName: "Arrango",
        locale: "nb_NO",
      },
      // Facebook specific tags (optional but recommended)
      ...(process.env.FACEBOOK_APP_ID && {
        other: {
          'fb:app_id': process.env.FACEBOOK_APP_ID,
        }
      }),
      twitter: {
        card: "summary_large_image",
        title: `${event.name} - ${formattedDate}`,
        description: `${event.name} i ${event.location}`,
        images: [imageUrl],
        site: "@arrango", // Optional: Twitter handle
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.arrango.no'}/event/${resolvedParams.id}`,
      },
    };

    console.log('Generated metadata:', JSON.stringify(metadata, null, 2));
    return metadata;
  } catch (error) {
    console.error("Error generating event metadata:", error);
    return {
      title: "Event | Arrango",
      description: "Se arrangement detaljer og kjøp billetter.",
      openGraph: {
        title: "Event | Arrango",
        description: "Se arrangement detaljer og kjøp billetter.",
        images: [
          {
            url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.arrango.no'}/og-image.png`,
            width: 1200,
            height: 630,
            alt: "Arrango - Billettplattform",
          },
        ],
      },
    };
  }
}

export async function generateStaticParams() {
  try {
    const events = await convex.query(api.events.get);
    return events.map((event) => ({
      id: event._id,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default async function EventPage({ params }: Props) {
  const resolvedParams = await params;
  return <EventPageClient eventId={resolvedParams.id as Id<"events">} />;
}
