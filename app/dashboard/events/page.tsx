import { requireAuth } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import SellerEventList from "@/components/SellerEventList";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";

export default async function SellerEventsPage() {
  const user = await requireAuth().catch(() => redirect("/sign-in"));
  if (!user) redirect("/sign-in");

  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="px-4 py-4 lg:px-6">
        <div className="max-w-full lg:max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Link
                href="/dashboard"
                className="text-gray-500 hover:text-gray-700 transition-colors flex-shrink-0"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Mine arrangementer</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Administrer dine arrangementer og følg salg
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/new-event"
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap flex-shrink-0"
            >
              <Plus className="w-5 h-5" />
              Lag nytt event
            </Link>
          </div>
        </div>

        {/* Event List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <SellerEventList />
        </div>
      </div>
      </div>
    </div>
  );
}
