import EventForm from "@/components/EventForm";

export default function NewEventPage() {
  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="px-4 py-4 lg:px-6">
        <div className="max-w-full lg:max-w-7xl mx-auto">
          <EventForm mode="create" />
        </div>
      </div>
    </div>
  );
}
