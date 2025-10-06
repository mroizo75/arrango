import EventList from "@/components/EventList";
import SearchBar from "@/components/SearchBar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hjem | Arrango",
  description: "Finn og kjøp billetter til de beste arrangementene, konserter og festivaler over hele verden. Sikker billettkjøp med Stripe. Støtter flere valutaer. Gratis for arrangører!",
  keywords: [
    "billetter",
    "arrangementer",
    "konserter",
    "festivaler",
    "teater",
    "kjøp billetter online",
    "live events",
    "kulturarrangementer",
    "billettservice",
    "event tickets",
    "internasjonale events",
    "worldwide tickets"
  ],
  openGraph: {
    title: "Arrango - Finn arrangementer og kjøp billetter verden over",
    description: "Oppdag de beste arrangementene over hele verden. Fra konserter til festivaler - kjøp billetter trygt og enkelt. Støtter flere valutaer.",
    type: "website",
    url: "https://arrango.no",
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 630,
        alt: "Arrango - Din internasjonale billettplattform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arrango - Finn arrangementer og kjøp billetter verden over",
    description: "Oppdag de beste arrangementene over hele verden. Fra konserter til festivaler - kjøp billetter trygt og enkelt.",
    images: ["/images/logo.png"],
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Oppdag arrangementer
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Finn og kjøp billetter til de beste arrangementene i ditt område
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar />
          </div>
        </div>

        <EventList limit={12} showFeaturedOrganizers={true} showCTA={true} />
      </div>
    </div>
  );
}
