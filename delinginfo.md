Kortversjon: Bildet følger ikke med fordi (a) og:image mangler/er feil på eventsidene, (b) URL-en er ikke absolutt, (c) bildet er ikke offentlig tilgjengelig (typisk ved midlertidige/signed Convex-URL-er), eller (d) crawleren treffer en side uten per-side metadata. Løs det med per-event Open Graph-metadata, absolutte URL-er og et statisk/offentlig tilgjengelig bilde (eller generert OG-bilde). 
ogp.me

Nedenfor er en oppskrift som “bare virker” i Next.js (App Router) + Convex:

1) Sett metadataBase og per-event generateMetadata

I app/layout.tsx (eller app/layout.ts) – dette gjør at relative stier blir til absolutte URL-er:

// app/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.arrango.no"),
  title: { default: "Arrango", template: "%s | Arrango" },
};


I app/eventer/[slug]/page.tsx (tilpass mappestruktur), hent eventet og eksponer openGraph/twitter:

// app/eventer/[slug]/page.tsx
import type { Metadata } from "next";
import { fetchEventBySlug } from "@/lib/events"; // server-funksjon som henter fra Convex (se note under)

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = await fetchEventBySlug(params.slug);

  const title = event?.title ?? "Event";
  const description = event?.shortDescription ?? "Kjøp billetter på Arrango";
  // Viktig: bruk en STABIL, offentlig URL – ikke en midlertidig signed URL fra Convex!
  const imageUrl = event?.shareImageUrl ?? "/og-default.jpg"; // ligger i /public

  return {
    title,
    description,
    openGraph: {
      type: "website",
      url: `/eventer/${params.slug}`,
      title,
      description,
      images: [
        {
          url: imageUrl, // blir gjort absolutt via metadataBase
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function Page({ params }: Props) {
  const event = await fetchEventBySlug(params.slug);
  // ...render siden
  return <div>{event.title}</div>;
}


Hvorfor dette hjelper

generateMetadata lager meta-tags per event-side (crawlers må se tags i HTML-en for akkurat den URL-en). 
nextjs.org

metadataBase sørger for at images.url blir absolutt (krav hos flere plattformer). 
nextjs.org
+1

Note om Convex: Ikke gi delingsbildet som en midlertidig/signed URL som utløper (da mister Facebook/X bildet ved rescrape). Last opp delingsbilder til et offentlig bucket (S3/R2/Supabase Storage el.) og lagre en fast HTTPS-URL i Convex-dokumentet.

2) Bruk riktig bildestørrelse og format

Typisk 1200×630 (ca. 1.91:1) fungerer på Facebook/LinkedIn/X (“summary_large_image”). 
ogp.me
+1

X krever maks ~5 MB, min. 300×157, 2:1 for “summary_large_image”; SVG støttes ikke. 
developer.x.com

Legg en fallback som /public/og-default.jpg i repoet.

3) Alternativ: Generér dynamisk OG-bilde (valgfritt, men proft)

Du kan lage et pent kort med tittel/dato/sted pr. event med @vercel/og via en route som /api/og?slug=..., og bruke den URL-en i images.url over. Dette er raskt, cache-vennlig og crawler-vennlig. 
Vercel
+1

4) Sjekkliste for “blankt bilde”

og:image finnes på eventsidens HTML (ikke bare forsiden).

Bildet er offentlig og absolutt URL.

Bildet har gyldig dimensjon og størrelse (f.eks. 1200×630, <5 MB). 
developer.x.com
+1

Siden returnerer 200 OK for både side og bilde uten auth/cookies.

Ingen noindex/blokkerende head-tags for bots.

Ved endringer: rescrape:

Facebook: Sharing Debugger (Scrape Again).

X/Twitter: Card Validator. 
Vercel
+1

5) Vanlige feller jeg ser med Convex/Next.js

Signed URL som utløper → crawleren mister bildet ved reshare. Løsning: bruk permanent, offentlig URL.

Next/Image-optimaliserte interne URL-er bak headers → bots får 403. Bruk rå bilde-URL for og:image.

Metadata kun i layout → alle events deler samme bilde. Flytt til generateMetadata i [slug]. 
nextjs.org

Relative stier uten metadataBase → enkelte plattformer feiler. 
nextjs.org
+1