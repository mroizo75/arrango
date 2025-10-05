import { DashboardPage } from "@/components/DashboardPage";
import { requireAuth } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import { getSellerDashboardData } from "@/app/actions/getSellerDashboardData";
import { Suspense } from "react";
import DashboardClient from "./DashboardClient";
import Spinner from "@/components/Spinner";

export default async function SellerPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await requireAuth().catch(() => {
    redirect("/sign-in");
  });
  if (!user) redirect("/sign-in");
  const userId = user.id;

  const params = (await searchParams) ?? {};
  const pageParam = params.page;
  const page = Array.isArray(pageParam)
    ? parseInt(pageParam[0] ?? "1", 10)
    : parseInt((pageParam as string) ?? "1", 10);

  const dashboardData = await getSellerDashboardData({
    userId,
    page: Number.isNaN(page) || page < 1 ? 1 : page,
  });

  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Spinner /></div>}>
      <DashboardClient>
        <div className="min-h-screen bg-background">
          <main className="flex min-h-screen flex-col">
            <header className="border-b px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-semibold">Oversikt</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Følg med på salg, kunder og inntekter i sanntid.
                  </p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <a
                    href="/dashboard/new-event"
                    className="flex-1 sm:flex-none rounded-md bg-blue-600 px-3 sm:px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 text-center"
                  >
                    Lag nytt event
                  </a>
                  <a
                    href="/dashboard/events"
                    className="hidden sm:inline-flex rounded-md border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
                  >
                    Administrer events
                  </a>
                </div>
              </div>
            </header>
            <section className="flex-1 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
              <DashboardPage
                overview={dashboardData.overview}
                customers={dashboardData.customersFormatted}
                salesTrend={dashboardData.salesTrend}
                eventPerformance={dashboardData.eventPerformance}
                currentPage={dashboardData.customers.page}
              />
            </section>
          </main>
        </div>
      </DashboardClient>
    </Suspense>
  );
}
