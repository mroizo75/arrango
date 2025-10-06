import { Metadata } from "next";
import { ShareEvent } from "@/components/ShareEvent";

export const metadata: Metadata = {
  title: "Test Image Sharing | Arrango",
  description: "Testing image sharing functionality",
      openGraph: {
        title: "Test Image Sharing",
        description: "Testing image sharing functionality",
        images: [
          {
            url: "/og-image.svg",
            width: 1200,
            height: 630,
            alt: "Arrango - Enklere billettsalg for bedre arrangementer",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "Test Image Sharing",
        description: "Testing image sharing functionality",
        images: ["/og-image.svg"],
      },
};

export default function TestImagePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Test Image Sharing</h1>
        <p className="mb-4">Dette er en test-side for å se om bildet fungerer i delinger.</p>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Test Image:</h2>
            <img
              src="/api/image-proxy?storageId=ef202ec4-b587-4db2-8dd3-8d09c29c216e"
              alt="Test image"
              className="border rounded-lg max-w-md"
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Test Sharing:</h2>
            <p className="text-gray-600 mb-4">
              Klikk på &quot;Del arrangement&quot; for å teste om bildet kommer med i delinger på sosiale medier.
            </p>
            <ShareEvent
              eventName="Test Image Sharing"
              eventUrl="https://arrango.no/test-image"
              eventDescription="Testing image sharing functionality"
              className="w-full max-w-xs"
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Test Metadata:</h2>
            <div className="bg-gray-100 p-4 rounded font-mono text-sm">
              <p><strong>og:image:</strong> https://arrango.no/api/image-proxy?storageId=ef202ec4-b587-4db2-8dd3-8d09c29c216e</p>
              <p><strong>twitter:image:</strong> https://arrango.no/api/image-proxy?storageId=ef202ec4-b587-4db2-8dd3-8d09c29c216e</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Testing Instructions:</h3>
            <ol className="text-blue-800 text-sm space-y-1">
              <li>1. Klikk &quot;Del arrangement&quot; ovenfor</li>
              <li>2. Velg Facebook, X (Twitter) eller LinkedIn</li>
              <li>3. Sjekk om bildet vises i forhåndsvisningen</li>
              <li>4. Del og se om bildet kommer med i innlegget</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
