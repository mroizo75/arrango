import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Test Image Sharing | Arrango",
  description: "Testing image sharing functionality",
  openGraph: {
    title: "Test Image Sharing",
    description: "Testing image sharing functionality",
    images: [
      {
        url: "https://arrango.no/api/image-proxy?storageId=ef202ec4-b587-4db2-8dd3-8d09c29c216e",
        width: 400,
        height: 400,
        alt: "Test image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Test Image Sharing",
    description: "Testing image sharing functionality",
    images: ["https://arrango.no/api/image-proxy?storageId=ef202ec4-b587-4db2-8dd3-8d09c29c216e"],
  },
};

export default function TestImagePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Test Image Sharing</h1>
        <p className="mb-4">Dette er en test-side for å se om bildet fungerer i delinger.</p>

        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Test Image:</h2>
            <img
              src="/api/image-proxy?storageId=ef202ec4-b587-4db2-8dd3-8d09c29c216e"
              alt="Test image"
              className="border rounded-lg max-w-md"
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Test Metadata:</h2>
            <div className="bg-gray-100 p-4 rounded font-mono text-sm">
              <p><strong>og:image:</strong> https://arrango.no/api/image-proxy?storageId=ef202ec4-b587-4db2-8dd3-8d09c29c216e</p>
              <p><strong>twitter:image:</strong> https://arrango.no/api/image-proxy?storageId=ef202ec4-b587-4db2-8dd3-8d09c29c216e</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
