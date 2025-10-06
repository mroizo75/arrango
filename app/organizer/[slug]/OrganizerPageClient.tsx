"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useStorageUrl } from "@/lib/hooks";
import Spinner from "@/components/Spinner";
import { Badge } from "@/components/ui/badge";
import { ShareEvent } from "@/components/ShareEvent";
import {
  Globe,
  Phone,
  Star,
  Users,
  Calendar,
  CheckCircle,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  MapPin,
  Clock,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface EventItemProps {
  event: {
    _id: string;
    name: string;
    eventDate: number;
    location: string;
    imageStorageId?: string;
    price?: number;
    organizerSlug: string;
    organizerName: string;
  };
}

function EventItem({ event }: EventItemProps) {
  const eventDate = new Date(event.eventDate);
  const eventImageUrl = useStorageUrl(event.imageStorageId);
  const dayName = eventDate.toLocaleDateString('nb-NO', { weekday: 'long' });
  const dayNumber = eventDate.getDate();
  const monthShort = eventDate.toLocaleDateString('nb-NO', { month: 'short' });
  const timeString = eventDate.toLocaleTimeString('nb-NO', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-gray-300 overflow-hidden min-h-[200px]">
      <div className="flex flex-col lg:flex-row relative">
        {/* Event Image */}
        <div className="lg:w-64 h-48 lg:h-full flex-shrink-0 relative">
          {eventImageUrl ? (
            <Image
              src={eventImageUrl}
              alt={event.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
          )}

          {/* Date Overlay - Mobile */}
          <div className="absolute top-4 left-4 lg:hidden bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-white/20">
            <div className="text-white text-center">
              <div className="text-sm font-semibold capitalize">{dayName}</div>
              <div className="text-2xl font-bold">{dayNumber}</div>
              <div className="text-sm capitalize">{monthShort}</div>
            </div>
          </div>

          {/* Date Overlay - Desktop */}
          <div className="hidden lg:block absolute top-4 right-4 lg:right-6 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-white/20">
            <div className="text-white text-center">
              <div className="text-sm font-semibold capitalize">{dayName}</div>
              <div className="text-2xl font-bold">{dayNumber}</div>
              <div className="text-sm capitalize">{monthShort}</div>
            </div>
          </div>
        </div>

        {/* Event Info */}
        <div className="flex-1 lg:ml-64 lg:pl-8 p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold leading-tight mb-2">
                {event.name}
              </h3>

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 px-3 py-1">
                  <Clock className="w-4 h-4" />
                  <span>{timeString}</span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-green-50 text-green-700 px-3 py-1">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-gray-600">
                Fra {event.price ? `${Math.round(event.price / 100)} kr` : 'Gratis'}
              </div>
            </div>

            {/* Share & CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <ShareEvent
                eventName={event.name}
                eventUrl={`${typeof window !== 'undefined' ? window.location.origin : 'https://arrango.no'}/event/${event._id}`}
                eventDescription={`Arrangement av ${event.organizerName}`}
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-none"
              />
              <Link
                href={`/event/${event._id}`}
                className="inline-flex items-center justify-center w-full lg:w-auto px-4 py-2 bg-black/80 backdrop-blur-sm text-white font-medium rounded-md border border-white/20 shadow-lg hover:bg-black/90 transition-all duration-200 text-sm"
              >
                Finn billetter
                <svg className="w-3 h-3 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type Props = {
  slug: string;
};

export default function OrganizerPageClient({ slug }: Props) {

  const organizer = useQuery(api.organizerProfile.getOrganizerProfileBySlug, { slug });
  const events = useQuery(
    api.organizerProfile.getOrganizerEvents,
    organizer ? { userId: organizer.userId } : "skip"
  );

  const logoUrl = useStorageUrl(organizer?.organizerLogoStorageId);

  if (!organizer) {
    if (organizer === undefined) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <Spinner />
        </div>
      );
    }

    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Arrangør ikke funnet
          </h1>
          <p className="text-gray-600">
            Denne arrangøren finnes ikke eller har ikke laget en offentlig profil ennå.
          </p>
        </div>
      </div>
    );
  }

  // Filter and sort upcoming events by date (newest first)
  const upcomingEvents = events
    ?.filter(event => event.eventDate >= Date.now())
    .sort((a, b) => a.eventDate - b.eventDate) || []; // Sort ascending (earliest first)

  // Group events by month
  const eventsByMonth = upcomingEvents.reduce((acc, event) => {
    const date = new Date(event.eventDate);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthName = date.toLocaleDateString('nb-NO', { month: 'long', year: 'numeric' });

    if (!acc[monthKey]) {
      acc[monthKey] = {
        monthName,
        events: []
      };
    }

    acc[monthKey].events.push(event);
    return acc;
  }, {} as Record<string, { monthName: string; events: typeof upcomingEvents }>);

  // Generate structured data for the organizer
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: organizer.organizerName,
    description: organizer.organizerDescription,
    url: `https://arrango.no/organizer/${slug}`,
    logo: logoUrl ? logoUrl : undefined,
    sameAs: [
      organizer.organizerWebsite,
      organizer.organizerFacebook,
      organizer.organizerInstagram,
      organizer.organizerTwitter,
      organizer.organizerLinkedIn,
    ].filter(Boolean),
    contactPoint: organizer.organizerPhone ? {
      "@type": "ContactPoint",
      telephone: organizer.organizerPhone,
      contactType: "customer service",
    } : undefined,
    address: organizer.organizerCity ? {
      "@type": "PostalAddress",
      addressLocality: organizer.organizerCity,
    } : undefined,
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

      <div className="min-h-screen bg-white">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-blue-50 to-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex flex-col md:flex-row gap-12 items-start">
              {/* Logo/Profile Image */}
              <div className="flex-shrink-0">
                {logoUrl ? (
                  <div className="relative">
                    <Image
                      src={logoUrl}
                      alt={organizer.organizerName || "Arrangør logo"}
                      width={160}
                      height={160}
                      className="rounded-xl object-cover border-4 border-white shadow-lg"
                    />
                    {organizer.organizerVerified && (
                      <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white rounded-full p-2">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-40 h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center border-4 border-white shadow-lg">
                    <Users className="w-16 h-16 text-gray-500" />
                  </div>
                )}
              </div>

              {/* Organizer Info */}
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                    {organizer.organizerName}
                  </h1>
                  {organizer.organizerVerified && (
                    <Badge className="bg-blue-600 text-white px-3 py-1 text-sm font-medium">
                      Verifisert arrangør
                    </Badge>
                  )}
                </div>

                {organizer.organizerBio && (
                  <p className="text-xl text-gray-700 mb-6 leading-relaxed">{organizer.organizerBio}</p>
                )}

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                  {organizer.organizerEventCount && (
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-6 h-6 text-blue-600" />
                        <div>
                          <div className="text-2xl font-bold text-gray-900">{organizer.organizerEventCount}</div>
                          <div className="text-sm text-gray-600">Arrangementer</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {organizer.organizerRating && (
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                      <div className="flex items-center gap-3">
                        <Star className="w-6 h-6 text-yellow-500" />
                        <div>
                          <div className="text-2xl font-bold text-gray-900">{organizer.organizerRating.toFixed(1)}</div>
                          <div className="text-sm text-gray-600">{organizer.organizerReviewCount} anmeldelser</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {organizer.organizerFollowerCount && (
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                      <div className="flex items-center gap-3">
                        <Users className="w-6 h-6 text-purple-600" />
                        <div>
                          <div className="text-2xl font-bold text-gray-900">{organizer.organizerFollowerCount}</div>
                          <div className="text-sm text-gray-600">Følgere</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Share Organizer */}
                <div className="mt-6">
                  <ShareEvent
                    eventName={`${organizer.organizerName} - Arrangør`}
                    eventUrl={`${typeof window !== 'undefined' ? window.location.origin : 'https://arrango.no'}/organizer/${slug}`}
                    eventDescription={organizer.organizerBio || organizer.organizerDescription || ""}
                    variant="outline"
                    size="default"
                  />
                </div>

                {/* Contact & Social Links */}
                <div className="flex flex-wrap gap-4">
                  {organizer.organizerWebsite && (
                    <a
                      href={organizer.organizerWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                    >
                      <Globe className="w-4 h-4" />
                      Nettside
                    </a>
                  )}

                  {organizer.organizerPhone && (
                    <a
                      href={`tel:${organizer.organizerPhone}`}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                    >
                      <Phone className="w-4 h-4" />
                      {organizer.organizerPhone}
                    </a>
                  )}

                  {organizer.organizerFacebook && (
                    <a
                      href={organizer.organizerFacebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                    >
                      <Facebook className="w-4 h-4" />
                      Facebook
                    </a>
                  )}

                  {organizer.organizerInstagram && (
                    <a
                      href={organizer.organizerInstagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                    >
                      <Instagram className="w-4 h-4" />
                      Instagram
                    </a>
                  )}

                  {organizer.organizerTwitter && (
                    <a
                      href={organizer.organizerTwitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                    >
                      <Twitter className="w-4 h-4" />
                      Twitter
                    </a>
                  )}

                  {organizer.organizerLinkedIn && (
                    <a
                      href={organizer.organizerLinkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                    >
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            {organizer.organizerDescription && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Om {organizer.organizerName}</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-line">{organizer.organizerDescription}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Events Section */}
        <div className="bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {upcomingEvents.length > 0 ? (
              <div className="space-y-16">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Kommende arrangementer
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Se hva {organizer.organizerName} har planlagt for deg
                  </p>
                </div>

                {/* Events grouped by month */}
                {Object.entries(eventsByMonth).map(([monthKey, { monthName, events: monthEvents }]) => (
                  <div key={monthKey} className="space-y-6">
                    {/* Month header */}
                    <div className="border-b border-gray-300 pb-4">
                      <h3 className="text-2xl font-bold text-gray-900 capitalize">
                        {monthName}
                      </h3>
                    </div>

                    {/* Events for this month */}
                    <div className="space-y-4">
                      {monthEvents.map((event) => (
                        <EventItem key={event._id} event={{
                          ...event,
                          organizerSlug: organizer.organizerSlug || "",
                          organizerName: organizer.organizerName || ""
                        }} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* No upcoming events */
              <div className="text-center py-16">
                <div className="bg-white rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <Calendar className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Ingen kommende arrangementer
                </h3>
                <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                  Denne arrangøren har ingen kommende arrangementer planlagt.
                  Følg dem for å få beskjed når nye arrangementer publiseres!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Klar for å oppleve {organizer.organizerName}?
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Følg denne arrangøren og få beskjed når nye arrangementer publiseres
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Følg {organizer.organizerName}
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                  Se alle arrangementer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
