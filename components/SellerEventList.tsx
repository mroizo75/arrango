"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useSession } from "next-auth/react";
import {
  CalendarDays,
  Edit,
  Ticket,
  Ban,
  Banknote,
  InfoIcon,
} from "lucide-react";
import Link from "next/link";
import { useStorageUrl } from "@/lib/hooks";
import { formatPrice, safeCurrencyCode } from "@/lib/currency";
import Image from "next/image";
import CancelEventButton from "./CancelEventButton";
import { ShareEvent } from "@/components/ShareEvent";
import { Doc } from "@/convex/_generated/dataModel";
import { Metrics } from "@/convex/events";

export default function SellerEventList() {
  const { data: session } = useSession();
  const user = session?.user;
  const events = useQuery(api.events.getSellerEvents, {
    userId: user?.id ?? "",
  });

  if (!events) return null;

  const upcomingEvents = events.filter((e) => e.eventDate > Date.now());
  const pastEvents = events.filter((e) => e.eventDate <= Date.now());

  return (
    <div className="mx-auto space-y-8">
      {/* Upcoming Events */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Upcoming Events
        </h2>
        <div className="grid grid-cols-1 gap-6">
          {upcomingEvents.map((event) => (
            <SellerEventCard key={event._id} event={event} />
          ))}
          {upcomingEvents.length === 0 && (
            <p className="text-gray-500">No upcoming events</p>
          )}
        </div>
      </div>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Past Events</h2>
          <div className="grid grid-cols-1 gap-6">
            {pastEvents.map((event) => (
              <SellerEventCard key={event._id} event={event} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SellerEventCard({
  event,
}: {
  event: Doc<"events"> & {
    metrics: Metrics;
  };
}) {
  const imageUrl = useStorageUrl(event.imageStorageId);
  const isPastEvent = event.eventDate < Date.now();

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border ${event.is_cancelled ? "border-red-200" : "border-gray-200"} overflow-hidden`}
    >
      <div className="p-6">
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
          {/* Event Image */}
          {imageUrl && (
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-lg overflow-hidden shrink-0 self-center sm:self-start">
              <Image
                src={imageUrl}
                alt={event.name}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Event Details */}
          <div className="flex-1 min-w-0 w-full sm:w-auto">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="w-full sm:w-auto">
                <h3 className="text-xl font-semibold text-gray-900">
                  {event.name}
                </h3>
                <p className="mt-1 text-gray-500">{event.description}</p>
                {event.is_cancelled && (
                  <div className="mt-2 flex items-center gap-2 text-red-600">
                    <Ban className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Event Cancelled & Refunded
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
                {/* Share Button - Always visible */}
                <ShareEvent
                  eventName={event.name}
                  eventUrl={`${typeof window !== 'undefined' ? window.location.origin : 'https://arrango.no'}/event/${event._id}`}
                  eventDescription={event.description}
                  eventImage={imageUrl || undefined}
                  variant="outline"
                  size="sm"
                />

                {!isPastEvent && !event.is_cancelled && (
                  <>
                    <Link
                      href={`/dashboard/events/${event._id}/edit`}
                      className="shrink-0 flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Link>
                    <CancelEventButton eventId={event._id} />
                  </>
                )}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Ticket className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {event.is_cancelled ? "Tickets Refunded" : "Tickets Sold"}
                  </span>
                </div>
                <p className="text-2xl font-semibold text-gray-900">
                  {event.is_cancelled ? (
                    <>
                      {event.metrics.refundedTickets}
                      <span className="text-sm text-gray-500 font-normal">
                        {" "}
                        refunded
                      </span>
                    </>
                  ) : (
                    <>
                      {event.metrics.soldTickets}
                      <span className="text-sm text-gray-500 font-normal">
                        /{event.totalTickets}
                      </span>
                    </>
                  )}
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Banknote className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {event.is_cancelled ? "Amount Refunded" : "Revenue"}
                  </span>
                </div>
                <p className="text-2xl font-semibold text-gray-900">
                  {event.is_cancelled
                    ? formatPrice(event.metrics.refundedTickets * event.price, safeCurrencyCode(event.currency))
                    : formatPrice(event.metrics.revenue, safeCurrencyCode(event.currency))}
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <CalendarDays className="w-4 h-4" />
                  <span className="text-sm font-medium">Date</span>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(event.eventDate).toLocaleDateString()}
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <InfoIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Status</span>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {event.is_cancelled
                    ? "Cancelled"
                    : isPastEvent
                      ? "Ended"
                      : "Active"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
