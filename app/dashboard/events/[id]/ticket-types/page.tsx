"use client";

import { useParams, useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { TicketTypeManager } from "@/components/TicketTypeManager";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Ticket } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export default function EventTicketTypesPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as Id<"events">;
  
  const event = useQuery(api.events.getById, { eventId });

  if (!event) {
    return (
      <div className="px-4 py-4 lg:px-6">
        <div className="max-w-full lg:max-w-5xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <Spinner />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 lg:px-6">
      <div className="max-w-full lg:max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Tilbake
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-blue-600" />
                  <h1 className="text-2xl font-bold text-gray-900">Billett-typer</h1>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  {event.name}
                </p>
              </div>
            </div>
            <Link
              href={`/dashboard/events/${eventId}/edit`}
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              Rediger arrangement
            </Link>
          </div>
        </div>

        {/* Info Alert */}
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <InfoIcon className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-900">Legg til billett-typer (valgfritt)</AlertTitle>
          <AlertDescription className="text-blue-800">
            Arrangementet ditt har allerede en standard billett-type. Du kan legge til flere typer 
            (f.eks. VIP, Early Bird, Standing) med ulike priser og fordeler, eller hoppe over dette steget.
          </AlertDescription>
        </Alert>

        {/* Ticket Type Manager */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <TicketTypeManager 
            eventId={eventId} 
            eventCurrency={event.currency || "NOK"} 
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <Link
            href="/dashboard/events"
            className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Ferdig - Gå til mine arrangementer
          </Link>
        </div>
      </div>
    </div>
  );
}

