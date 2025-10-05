import { requireAuth } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import SellerEventList from "@/components/SellerEventList";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";

export default async function SellerEventsPage() {
  const user = await requireAuth().catch(() => redirect("/sign-in"));
  if (!user) redirect("/sign-in");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <Link
                href="/dashboard"
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Mine arrangementer</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Administrer dine arrangementer og følg salg
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/new-event"
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
            >
              <Plus className="w-5 h-5" />
              Lag nytt event
            </Link>
          </div>
        </div>

        {/* Event List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <SellerEventList />
        </div>
      </div>
    </div>
  );
}
