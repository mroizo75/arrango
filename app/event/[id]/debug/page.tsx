"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Spinner from "@/components/Spinner";

export default function DebugPage() {
  const params = useParams();
  const eventId = params.id as string;
  
  const event = useQuery(api.events.getById, {
    eventId: eventId as Id<"events">,
  });
  
  const convexImageUrl = useQuery(
    api.storage.getPublicImageUrl,
    event?.imageStorageId ? { storageId: event.imageStorageId } : "skip"
  );

  if (event === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const imageUrl = convexImageUrl || `${typeof window !== 'undefined' ? window.location.origin : 'https://www.arrango.no'}/og-image.png`;
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://www.arrango.no';

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">Event Debug Info</h1>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Event ID:</h2>
            <code className="bg-gray-100 p-2 rounded block">{eventId}</code>
          </div>

          {event === null && (
            <div className="bg-red-50 border border-red-200 rounded p-4">
              <h2 className="text-xl font-semibold text-red-900 mb-2">Error:</h2>
              <p className="text-red-700">Event ikke funnet</p>
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
                <h2 className="text-xl font-semibold mb-2">Convex Image URL (direkte):</h2>
                <code className="bg-gray-100 p-2 rounded block break-all text-sm">
                  {convexImageUrl || 'Ikke hentet'}
                </code>
                {convexImageUrl && (
                  <a 
                    href={convexImageUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline mt-2 inline-block"
                  >
                    Åpne Convex URL i ny fane →
                  </a>
                )}
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Final Image URL for Open Graph:</h2>
                <code className="bg-gray-100 p-2 rounded block break-all text-sm">
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
                <div className="max-w-md border rounded overflow-hidden bg-gray-50">
                  <img 
                    src={imageUrl} 
                    alt={event.name}
                    className="w-full h-auto"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <h2 className="text-xl font-semibold text-blue-900 mb-2">Facebook Debugger:</h2>
                <p className="text-blue-700 mb-2">Test denne URL-en i Facebook Sharing Debugger:</p>
                <a 
                  href={`https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(`${siteUrl}/event/${eventId}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Åpne i Facebook Debugger →
                </a>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded p-4">
                <h2 className="text-xl font-semibold text-green-900 mb-2">Metadata URL:</h2>
                <p className="text-green-700 mb-2">Dette er URL-en som brukes i Open Graph metadata:</p>
                <code className="bg-white p-2 rounded block break-all text-sm">
                  {imageUrl}
                </code>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

