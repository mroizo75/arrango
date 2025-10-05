import { requireAuth } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, QrCode } from "lucide-react";
import { EventScanStats } from "@/components/EventScanStats";
import { Id } from "@/convex/_generated/dataModel";

export default async function EventScanPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const user = await requireAuth().catch(() => redirect("/sign-in"));
  if (!user) redirect("/sign-in");

  const { eventId } = await params;

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center gap-4">
        <Link href="/seller/scan">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Scan-statistikk</h1>
          <p className="text-muted-foreground">
            Oversikt over scannede billetter for dette eventet
          </p>
        </div>
        <Link href="/seller/scan">
          <Button>
            <QrCode className="mr-2 h-4 w-4" />
            Scan billetter
          </Button>
        </Link>
      </div>

      <EventScanStats eventId={eventId as Id<"events">} />
    </div>
  );
}

