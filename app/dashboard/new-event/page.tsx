import EventForm from "@/components/EventForm";

export default function NewEventPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <EventForm mode="create" />
    </div>
  );
}
