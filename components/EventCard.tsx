"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import {
  CalendarDays,
  MapPin,
  Ticket,
  Check,
  CircleArrowRight,
  LoaderCircle,
  XCircle,
  PencilIcon,
  StarIcon,
  User,
} from "lucide-react";
import { useSession } from "next-auth/react";
import PurchaseTicket from "./PurchaseTicket";
import { useRouter } from "next/navigation";
import { useStorageUrl } from "@/lib/hooks";
import { formatPrice, safeCurrencyCode } from "@/lib/currency";
import Link from "next/link";
import Image from "next/image";

interface EventCardProps {
  eventId: Id<"events">;
  showAdditionalPurchase?: boolean;
}

export default function EventCard({ eventId, showAdditionalPurchase = false }: EventCardProps) {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();
  const event = useQuery(api.events.getById, { eventId });
  const availability = useQuery(api.events.getEventAvailability, { eventId });
  const userTicket = useQuery(api.tickets.getUserTicketForEvent, {
    eventId,
    userId: user?.id ?? "",
  });
  const organizer = useQuery(api.organizerProfile.getOrganizerProfileByUserId, {
    userId: event?.userId ?? "",
  });
  const queuePosition = useQuery(api.waitingList.getQueuePosition, {
    eventId,
    userId: user?.id ?? "",
  });
  const imageUrl = useStorageUrl(event?.imageStorageId);

  if (!event || !availability) {
    return null;
  }

  const isPastEvent = event.eventDate < Date.now();

  const isEventOwner = user?.id === event?.userId;

  const renderQueuePosition = () => {
    if (!queuePosition || queuePosition.status !== "waiting") return null;

    if (availability.purchasedCount >= availability.totalTickets) {
      return (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Ticket className="w-5 h-5 text-gray-400 mr-2" />
            <span className="text-gray-600">Event is sold out</span>
          </div>
        </div>
      );
    }

    if (queuePosition.position === 2) {
      return (
        <div className="flex flex-col lg:flex-row items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100">
          <div className="flex items-center">
            <CircleArrowRight className="w-5 h-5 text-amber-500 mr-2" />
            <span className="text-amber-700 font-medium">
              You&apos;re next in line! (Queue position:{" "}
              {queuePosition.position})
            </span>
          </div>
          <div className="flex items-center">
            <LoaderCircle className="w-4 h-4 mr-1 animate-spin text-amber-500" />
            <span className="text-amber-600 text-sm">Waiting for ticket</span>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex items-center">
          <LoaderCircle className="w-4 h-4 mr-2 animate-spin text-blue-500" />
          <span className="text-blue-700">Queue position</span>
        </div>
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
          #{queuePosition.position}
        </span>
      </div>
    );
  };

  const renderTicketStatus = () => {
    if (!user) return null;

    if (isEventOwner) {
      return (
        <div className="mt-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/dashboard/events/${eventId}/edit`);
            }}
            className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 shadow-sm flex items-center justify-center gap-2"
          >
            <PencilIcon className="w-5 h-5" />
            Edit Event
          </button>
        </div>
      );
    }

    // Always show purchase options if tickets are available, regardless of existing tickets
    // But show a notification if user already has tickets

    // Show existing ticket notification if user has tickets
    if (userTicket) {
      return (
        <div className="mt-4 space-y-3">
          {/* Existing ticket notification */}
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
            <div className="flex items-center">
              <Check className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-green-700 font-medium">
                Du har en billett!
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/tickets/${userTicket._id}`);
              }}
              className="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-full font-medium shadow-sm transition-colors duration-200 flex items-center gap-1"
            >
              Se din billett
            </button>
          </div>

          {/* Show purchase options for buying more tickets only on detail pages */}
          {showAdditionalPurchase && (
            <div className="text-center">
              <PurchaseTicket eventId={eventId} />
            </div>
          )}
        </div>
      );
    }

    if (queuePosition) {
      return (
        <div className="mt-4">
          {queuePosition.status === "offered" && (
            <PurchaseTicket eventId={eventId} />
          )}
          {renderQueuePosition()}
          {queuePosition.status === "expired" && (
            <div className="p-3 bg-red-50 rounded-lg border border-red-100">
              <span className="text-red-700 font-medium flex items-center">
                <XCircle className="w-5 h-5 mr-2" />
                Offer expired
              </span>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div
      onClick={() => router.push(`/event/${eventId}`)}
      className={`group bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 cursor-pointer overflow-hidden ${
        isPastEvent ? "opacity-75 hover:opacity-100" : ""
      }`}
    >
      {/* Event Image */}
      {imageUrl && (
        <div className="relative w-full h-40 overflow-hidden">
          <Image
            src={imageUrl}
            alt={event.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            priority
          />
          {/* Price and Status Badge Overlay */}
          <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
            <span
              className={`px-3 py-1 text-sm font-bold rounded-full shadow-md backdrop-blur-sm ${
                isPastEvent
                  ? "bg-gray-100/90 text-gray-700"
                  : "bg-white/90 text-blue-600"
              }`}
            >
              {formatPrice(event.price, safeCurrencyCode(event.currency))}
            </span>
            {availability.purchasedCount >= availability.totalTickets && (
              <span className="px-2 py-1 bg-red-500/90 text-white font-medium rounded-full text-xs shadow-md backdrop-blur-sm">
                Utsolgt
              </span>
            )}
            {isEventOwner && (
              <span className="inline-flex items-center gap-1 bg-blue-600/90 text-white px-2 py-1 rounded-full text-xs font-medium shadow-md backdrop-blur-sm">
                <StarIcon className="w-3 h-3" />
                Ditt
              </span>
            )}
          </div>
          {isPastEvent && (
            <div className="absolute bottom-2 left-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-900/70 text-white backdrop-blur-sm">
                Tidligere
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      )}

      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 line-clamp-1 mb-2 group-hover:text-blue-600 transition-colors">
          {event.name}
        </h3>

        <div className="space-y-2 text-sm">
          <div className="flex items-center text-gray-600">
            <CalendarDays className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">
              {new Date(event.eventDate).toLocaleDateString("nb-NO", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <Ticket className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">
              {availability.totalTickets - availability.purchasedCount} / {availability.totalTickets} ledige
            </span>
          </div>
        </div>

        <div onClick={(e) => e.stopPropagation()}>
          {!isPastEvent && renderTicketStatus()}
        </div>
      </div>
    </div>
  );
}
