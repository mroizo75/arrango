"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import EventCard from "./EventCard";
import Spinner from "./Spinner";
import { CalendarDays, Ticket } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useStorageUrl } from "@/lib/hooks";
import Image from "next/image";

interface EventListProps {
  limit?: number;
  showFeaturedOrganizers?: boolean;
  showCTA?: boolean;
}

interface OrganizerCardProps {
  organizer: {
    userId: string;
    organizerName: string | null;
    organizerSlug: string | null;
    eventCount: number;
    latestEventImage: Id<"_storage"> | null | undefined;
  };
}

function OrganizerCard({ organizer }: OrganizerCardProps) {
  const organizerImageUrl = useStorageUrl(organizer.latestEventImage || undefined);
  const logoUrl = "/logo-light.png"; // Fallback logo

  return (
    <Link
      href={organizer.organizerSlug ? `/organizer/${organizer.organizerSlug}` : "#"}
      className="group"
    >
      <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200">
        {/* Image container */}
        <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          {organizerImageUrl ? (
            <Image
              src={organizerImageUrl}
              alt={organizer.organizerName || "Arrangør"}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Image
                src={logoUrl}
                alt="Arrango logo"
                width={60}
                height={60}
                className="opacity-60 group-hover:opacity-80 transition-opacity duration-300"
              />
            </div>
          )}
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Name below image */}
        <div className="p-4 text-center">
          <h4 className="font-semibold text-gray-900 text-sm truncate group-hover:text-blue-600 transition-colors duration-300">
            {organizer.organizerName || "Arrangør"}
          </h4>
        </div>
      </div>
    </Link>
  );
}

export default function EventList({ limit, showFeaturedOrganizers = false, showCTA = false }: EventListProps) {
  const events = useQuery(api.events.get);
  const organizers = useQuery(api.organizerProfile.getFeaturedOrganizers);

  if (!events) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // Shuffle array using Fisher-Yates algorithm
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const upcomingEvents = events
    .filter((event) => event.eventDate > Date.now())
    .sort((a, b) => a.eventDate - b.eventDate);

  // Randomize and limit upcoming events
  const displayedEvents = limit ? shuffleArray(upcomingEvents).slice(0, limit) : upcomingEvents;

  const pastEvents = events
    .filter((event) => event.eventDate <= Date.now())
    .sort((a, b) => b.eventDate - a.eventDate);

  return (
    <div className="space-y-16">
      {/* Header - Only show if not limited */}
      {!limit && (
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Kommende arrangementer</h2>
            <p className="mt-2 text-gray-600">
              Oppdag og kjøp billetter til fantastiske arrangementer
            </p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 text-gray-600">
              <CalendarDays className="w-5 h-5" />
              <span className="font-medium">
                {upcomingEvents.length} Kommende arrangementer
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Events Grid */}
      {displayedEvents.length > 0 ? (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${!limit ? 'mb-12' : ''}`}>
          {displayedEvents.map((event) => (
            <EventCard key={event._id} eventId={event._id} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">
            Ingen kommende arrangementer
          </h3>
          <p className="text-gray-600 mt-1">Kom tilbake senere for nye arrangementer</p>
        </div>
      )}

      {/* Featured Organizers */}
      {showFeaturedOrganizers && organizers && organizers.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Utvalgte arrangører</h3>
            <p className="text-lg text-gray-600">Møt noen av våre beste arrangører</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {organizers.slice(0, 6).map((organizer) => (
              <OrganizerCard key={organizer.userId} organizer={organizer} />
            ))}
          </div>
        </div>
      )}

      {/* CTA Section */}
      {showCTA && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">
            Klar for å arrangere ditt eget event?
          </h3>
          <p className="text-lg mb-6 opacity-90">
            Første arrangement er helt gratis. Kom i gang på få minutter.
          </p>
          <Link href="/arrangorer">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
              Bli arrangør gratis →
            </Button>
          </Link>
        </div>
      )}

      {/* Past Events Section - Only show if not limited */}
      {!limit && pastEvents.length > 0 && (
        <>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Tidligere arrangementer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents.map((event) => (
              <EventCard key={event._id} eventId={event._id} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
