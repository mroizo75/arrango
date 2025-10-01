"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useStorageUrl } from "@/lib/hooks";
import EventCard from "@/components/EventCard";
import Spinner from "@/components/Spinner";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import Image from "next/image";

export default function OrganizerPage() {
  const params = useParams();
  const slug = params.slug as string;

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

  const upcomingEvents = events?.filter(event => event.eventDate >= Date.now()) || [];
  const pastEvents = events?.filter(event => event.eventDate < Date.now()) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Logo/Profile Image */}
            <div className="flex-shrink-0">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={organizer.organizerName || "Arrangør logo"}
                  width={120}
                  height={120}
                  className="rounded-lg object-cover border"
                />
              ) : (
                <div className="w-30 h-30 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Users className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>

            {/* Organizer Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {organizer.organizerName}
                </h1>
                {organizer.organizerVerified && (
                  <Badge className="bg-blue-100 text-blue-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verifisert
                  </Badge>
                )}
              </div>

              {organizer.organizerBio && (
                <p className="text-xl text-gray-600 mb-4">{organizer.organizerBio}</p>
              )}

              {/* Stats */}
              <div className="flex flex-wrap gap-6 mb-6">
                {organizer.organizerEventCount && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {organizer.organizerEventCount} arrangementer
                    </span>
                  </div>
                )}

                {organizer.organizerRating && (
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm text-gray-600">
                      {organizer.organizerRating.toFixed(1)} ({organizer.organizerReviewCount} anmeldelser)
                    </span>
                  </div>
                )}

                {organizer.organizerFollowerCount && (
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {organizer.organizerFollowerCount} følgere
                    </span>
                  </div>
                )}
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Kommende arrangementer
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.map((event) => (
                <EventCard key={event._id} eventId={event._id} />
              ))}
            </div>
          </div>
        )}

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Tidligere arrangementer
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pastEvents.map((event) => (
                <div key={event._id} className="opacity-75">
                  <EventCard eventId={event._id} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Events */}
        {(!events || events.length === 0) && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Ingen arrangementer ennå
            </h3>
            <p className="text-gray-600">
              Denne arrangøren har ikke publisert noen arrangementer ennå.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
