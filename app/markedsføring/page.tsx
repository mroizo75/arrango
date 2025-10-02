import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Markedsføring | Arrango",
  description: "Markedsføringsverktøy og løsninger for arrangører. Kommer snart!",
  keywords: [
    "markedsføring",
    "marketing",
    "arrangører",
    "event marketing",
    "promotering",
    "markedsføring verktøy"
  ],
  openGraph: {
    title: "Markedsføring - Arrango",
    description: "Markedsføringsverktøy og løsninger for arrangører. Kommer snart!",
    type: "website",
    url: "https://arrango.no/markedsføring",
  },
  twitter: {
    card: "summary",
    title: "Markedsføring - Arrango",
    description: "Markedsføringsverktøy og løsninger for arrangører. Kommer snart!",
  },
  alternates: {
    canonical: "https://arrango.no/markedsføring",
  },
};

export default function MarkedsføringPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Markedsføring
        </h1>
        <p className="text-gray-600 mb-6">
          Markedsføringsverktøy og løsninger for arrangører kommer snart!
        </p>
        <div className="text-sm text-gray-500">
          Vi jobber med spennende markedsføringsfunksjoner for å hjelpe arrangører med å nå ut til flere besøkende.
        </div>
      </div>
    </div>
  );
}
