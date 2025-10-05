import { requireAuth } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import { TicketScanner } from "@/components/TicketScanner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function ScanPage() {
  const user = await requireAuth().catch(() => redirect("/sign-in"));
  if (!user) redirect("/sign-in");

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center gap-4">
        <Link href="/seller">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Scan billetter</h1>
          <p className="text-muted-foreground">
            Skann QR-koder for å verifisere inngang til ditt event
          </p>
        </div>
      </div>

      <TicketScanner />
    </div>
  );
}

