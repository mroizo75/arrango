import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

type Props = {
  params: Promise<{ id: string }>;
};

export default async function DebugPage({ params }: Props) {
  const resolvedParams = await params;
  
  let event = null;
  let error = null;
  
  try {
    event = await convex.query(api.events.getById, {
      eventId: resolvedParams.id as Id<"events">,
    });
  } catch (e: any) {
    error = e.message;
  }

  const imageUrl = event?.imageStorageId 
    ? `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.arrango.no'}/api/image-proxy?storageId=${event.imageStorageId}`
    : `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.arrango.no'}/og-image.png`;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">Event Debug Info</h1>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Event ID:</h2>
            <code className="bg-gray-100 p-2 rounded block">{resolvedParams.id}</code>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-4">
              <h2 className="text-xl font-semibold text-red-900 mb-2">Error:</h2>
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {event && (
            <>
              <div>
                <h2 className="text-xl font-semibold mb-2">Event Name:</h2>
                <p>{event.name}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Image Storage ID:</h2>
                <code className="bg-gray-100 p-2 rounded block">
                  {event.imageStorageId || 'INGEN BILDE'}
                </code>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Image URL for Open Graph:</h2>
                <code className="bg-gray-100 p-2 rounded block break-all">
                  {imageUrl}
                </code>
                <a 
                  href={imageUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline mt-2 inline-block"
                >
                  Åpne bildet i ny fane →
                </a>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Bildets preview:</h2>
                <img 
                  src={imageUrl} 
                  alt={event.name}
                  className="max-w-md border rounded"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/og-image.png';
                  }}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <h2 className="text-xl font-semibold text-blue-900 mb-2">Facebook Debugger:</h2>
                <p className="text-blue-700 mb-2">Test denne URL-en i Facebook Sharing Debugger:</p>
                <a 
                  href={`https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(`https://www.arrango.no/event/${resolvedParams.id}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Åpne i Facebook Debugger →
                </a>
              </div>
            </>
          )}

          {!event && !error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
              <p className="text-yellow-900">Event ikke funnet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

