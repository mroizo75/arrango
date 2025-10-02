import { DashboardPage } from "@/components/DashboardPage";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getSellerDashboardData } from "@/app/actions/getSellerDashboardData";

export default async function SellerPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");

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
    <div className="min-h-screen bg-background">
      <main className="flex min-h-screen flex-col">
        <header className="border-b px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Oversikt</h1>
              <p className="text-sm text-muted-foreground">
                Følg med på salg, kunder og inntekter i sanntid.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="/seller/new-event"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Lag nytt event
              </a>
              <a
                href="/seller/events"
                className="rounded-md border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                Administrer events
              </a>
            </div>
          </div>
        </header>
        <section className="flex-1 px-8 py-6">
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
  );
}
