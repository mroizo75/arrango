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
      <div className="px-4 py-4 lg:px-6">
        <div className="max-w-full lg:max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <Spinner />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 lg:px-6">
      <div className="max-w-full lg:max-w-7xl mx-auto">
        <EventForm mode="edit" initialData={event} />
      </div>
    </div>
  );
}
