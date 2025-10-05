import { Metadata } from "next";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import OrganizerPageClient from "./OrganizerPageClient";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const organizer = await convex.query(api.organizerProfile.getOrganizerProfileBySlug, {
      slug: resolvedParams.slug,
    });

    if (!organizer) {
      return {
        title: "Arrangør ikke funnet | Arrango",
        description: "Den arrangøren du leter etter finnes ikke.",
      };
    }

    const description = organizer.organizerDescription
      ? `${organizer.organizerDescription.substring(0, 150)}...`
      : `${organizer.organizerName} - Arrangør av arrangementer over hele verden. Finn og kjøp billetter til deres kommende events.`;

    return {
      title: `${organizer.organizerName} | Arrango`,
      description,
      keywords: [
        organizer.organizerName || "Organizer",
        "arrangør",
        "organizer",
        "events",
        "arrangementer",
        "konserter",
        "festivaler",
        "billetter",
        "tickets",
        organizer.organizerCity || "worldwide",
      ].filter(Boolean),
      openGraph: {
        title: `${organizer.organizerName} - Arrangør`,
        description,
        type: "profile",
        url: `https://arrango.no/organizer/${resolvedParams.slug}`,
        images: organizer.organizerLogoStorageId ? [
          {
            url: `https://arrango.no/api/image-proxy?storageId=${organizer.organizerLogoStorageId}`,
            width: 400,
            height: 400,
            alt: `${organizer.organizerName} logo`,
          },
        ] : [],
      },
      twitter: {
        card: "summary",
        title: `${organizer.organizerName} - Arrangør`,
        description: `${organizer.organizerName} - Finn deres arrangementer og kjøp billetter.`,
        images: organizer.organizerLogoStorageId ? [`https://arrango.no/api/image-proxy?storageId=${organizer.organizerLogoStorageId}`] : [],
      },
      alternates: {
        canonical: `https://arrango.no/organizer/${resolvedParams.slug}`,
      },
    };
  } catch (error) {
    console.error("Error generating organizer metadata:", error);
    return {
      title: "Arrangør | Arrango",
      description: "Se arrangør profil og deres arrangementer.",
    };
  }
}

export async function generateStaticParams() {
  try {
    // For now, return empty array as we don't have a getAllOrganizers query
    // This can be improved later when we have more organizers
    return [];
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default async function OrganizerPage({ params }: Props) {
  const resolvedParams = await params;
  return <OrganizerPageClient slug={resolvedParams.slug} />;
}
