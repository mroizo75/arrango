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

    return {
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
        url: `https://arrango.no/event/${resolvedParams.id}`,
        images: event.imageStorageId ? [
          {
            url: `https://arrango.no/api/image-proxy?storageId=${event.imageStorageId}`,
            width: 1200,
            height: 630,
            alt: `${event.name} - ${event.location}`,
          },
        ] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: `${event.name} - ${formattedDate}`,
        description: `${event.name} i ${event.location}`,
        images: event.imageStorageId ? [`https://arrango.no/api/image-proxy?storageId=${event.imageStorageId}`] : [],
      },
      alternates: {
        canonical: `https://arrango.no/event/${resolvedParams.id}`,
      },
    };
  } catch (error) {
    console.error("Error generating event metadata:", error);
    return {
      title: "Event | Arrango",
      description: "Se arrangement detaljer og kjøp billetter.",
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
