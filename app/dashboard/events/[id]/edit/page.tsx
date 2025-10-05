"use client";

import { useParams } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import EventForm from "@/components/EventForm";
import Spinner from "@/components/Spinner";

export default function EditEventPage() {
  const params = useParams();
  const event = useQuery(api.events.getById, {
    eventId: params.id as Id<"events">,
  });

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <EventForm mode="edit" initialData={event} />
    </div>
  );
}
