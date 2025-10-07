"use client";

import EventCard from "@/components/EventCard";
import { ShareEvent } from "@/components/ShareEvent";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { CalendarDays, MapPin, Ticket, Users } from "lucide-react";
import Spinner from "@/components/Spinner";
import JoinQueue from "@/components/JoinQueue";
import { useSession } from "next-auth/react";
import { useStorageUrl } from "@/lib/hooks";
import { formatPrice, safeCurrencyCode } from "@/lib/currency";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/AuthModal";
import { useState } from "react";

type Props = {
  eventId: Id<"events">;
};

export default function EventPageClient({ eventId }: Props) {
  const { data: session } = useSession();
  const user = session?.user;
  const [showAuthModal, setShowAuthModal] = useState(false);
  const event = useQuery(api.events.getById, {
    eventId,
  });
  const availability = useQuery(api.events.getEventAvailability, {
    eventId,
  });
  const organizer = useQuery(api.organizerProfile.getOrganizerProfileByUserId, {
    userId: event?.userId ?? "",
  });
  const imageUrl = useStorageUrl(event?.imageStorageId);

  if (!event || !availability) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // Generate structured data for the event
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    description: event.description,
    startDate: event.eventDate,
    location: {
      "@type": "Place",
      name: event.location,
      address: event.location,
    },
    organizer: organizer ? {
      "@type": "Organization",
      name: organizer.organizerName,
      url: `https://www.arrango.no/organizer/${organizer.organizerSlug}`,
    } : undefined,
    offers: {
      "@type": "Offer",
      price: (event.price / 100).toFixed(2),
      priceCurrency: safeCurrencyCode(event.currency),
      availability: "https://schema.org/InStock",
      validFrom: new Date().toISOString(),
    },
    image: imageUrl ? [imageUrl] : undefined,
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {imageUrl && (
              <div className="aspect-video sm:aspect-[3/1] relative w-full max-h-[300px] sm:max-h-[400px]">
                <Image
                  src={imageUrl}
                  alt={event.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <div className="p-4 sm:p-6 lg:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
                {/* Left Column - Event Details */}
                <div className="space-y-6 lg:space-y-8">
                  <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                      {event.name}
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 mb-3">{event.description}</p>

                    {organizer?.organizerSlug && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Arrangør:</span>
                              <Link
                                href={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.arrango.no'}/organizer/${organizer.organizerSlug}`}
                                className="text-blue-600 hover:underline font-medium"
                              >
                                {organizer.organizerName}
                              </Link>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-6">
                    <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-100">
                      <div className="flex items-center text-gray-600 mb-1">
                        <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-blue-600" />
                        <span className="text-xs sm:text-sm font-medium">Dato</span>
                      </div>
                      <p className="text-sm sm:text-base text-gray-900 leading-tight">
                        {new Date(event.eventDate).toLocaleDateString("nb-NO", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-100">
                      <div className="flex items-center text-gray-600 mb-1">
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-blue-600" />
                        <span className="text-xs sm:text-sm font-medium">Sted</span>
                      </div>
                      <p className="text-sm sm:text-base text-gray-900 leading-tight">{event.location}</p>
                    </div>

                    <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-100">
                      <div className="flex items-center text-gray-600 mb-1">
                        <Ticket className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-blue-600" />
                        <span className="text-xs sm:text-sm font-medium">Pris per billett</span>
                      </div>
                      <p className="text-sm sm:text-base text-gray-900 leading-tight">{formatPrice(event.price, safeCurrencyCode(event.currency))}</p>
                    </div>

                    <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-100">
                      <div className="flex items-center text-gray-600 mb-1">
                        <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-blue-600" />
                        <span className="text-xs sm:text-sm font-medium">Tilgjengelighet</span>
                      </div>
                      <p className="text-sm sm:text-base text-gray-900 leading-tight">
                        {availability.totalTickets - availability.purchasedCount}{" "}
                        / {availability.totalTickets} ledige
                      </p>
                    </div>
                  </div>

                  {/* Event Information */}
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">
                      Arrangement informasjon
                    </h3>
                    <ul className="space-y-2 text-blue-700">
                      {event.checkInTime && (
                        <li>• Ankomst {event.checkInTime}</li>
                      )}
                      {event.refundPolicy && (
                        <li>• {event.refundPolicy === "non-refundable"
                          ? "Billetter er ikke refunderbare"
                          : event.refundPolicy === "refundable-24h"
                          ? "Refunderbar opp til 24 timer før arrangement"
                          : event.refundPolicy === "refundable-48h"
                          ? "Refunderbar opp til 48 timer før arrangement"
                          : event.refundPolicy === "refundable-week"
                          ? "Refunderbar opp til 1 uke før arrangement"
                          : event.refundPolicy === "full-refund"
                          ? "Full refusjon tilgjengelig når som helst"
                          : event.refundPolicy}</li>
                      )}
                      {event.ageRestriction && (
                        <li>• Aldersgrense: {
                          event.ageRestriction === "all-ages" ? "Åpen for alle aldre" :
                          event.ageRestriction === "13+" ? "13+" :
                          event.ageRestriction === "16+" ? "16+" :
                          event.ageRestriction === "18+" ? "18+" :
                          event.ageRestriction === "21+" ? "21+" :
                          event.ageRestriction
                        }</li>
                      )}
                      {event.dressCode && event.dressCode !== "none" && (
                        <li>• Kleskode: {
                          event.dressCode === "casual" ? "Uformell" :
                          event.dressCode === "smart-casual" ? "Smart uformell" :
                          event.dressCode === "business" ? "Forretningsmessig" :
                          event.dressCode === "formal" ? "Formell" :
                          event.dressCode === "themed" ? "Tema" :
                          event.dressCode
                        }</li>
                      )}
                      {event.parkingInfo && (
                        <li>• Parkering: {event.parkingInfo}</li>
                      )}
                      {event.venueDetails && (
                        <li>• Lokale detaljer: {event.venueDetails}</li>
                      )}
                      {(!event.checkInTime && !event.refundPolicy && !event.ageRestriction && !event.dressCode && !event.parkingInfo && !event.venueDetails) && (
                        <>
                          <li>• Ankomst 30 minutter før arrangementet starter</li>
                          <li>• Billetter er ikke refunderbare</li>
                          <li>• Aldersgrense: 18+</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Right Column - Ticket Purchase Card */}
                <div>
                  <div className="sticky top-8 space-y-4">
                    <EventCard eventId={eventId} showAdditionalPurchase={true} />

                    <ShareEvent
                      eventName={event.name}
                      eventUrl={`${typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.arrango.no')}/event/${eventId}`}
                      eventDescription={event.description}
                      className="w-full"
                    />

                    {user ? (
                      <JoinQueue
                        eventId={eventId}
                        userId={user.id}
                      />
                    ) : (
                      <>
                        <Button 
                          onClick={() => setShowAuthModal(true)}
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                          Logg inn for å kjøpe billetter
                        </Button>
                        <AuthModal 
                          open={showAuthModal} 
                          onOpenChange={setShowAuthModal}
                          callbackUrl={`/event/${eventId}`}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
