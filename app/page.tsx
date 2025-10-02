import EventList from "@/components/EventList";
import SearchBar from "@/components/SearchBar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Oppdag arrangementer
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Finn og kjøp billetter til de beste arrangementene i ditt område
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar />
          </div>
        </div>

        <EventList limit={9} showFeaturedOrganizers={true} showCTA={true} />
      </div>
    </div>
  );
}
