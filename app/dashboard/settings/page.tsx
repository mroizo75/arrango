import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import LazyOrganizerProfileForm from "@/components/LazyOrganizerProfileForm";
import LazyFikenSettings from "@/components/LazyFikenSettings";
import LazyStripeConnectSettings from "@/components/LazyStripeConnectSettings";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HelpCircle, FileText } from "lucide-react";

export default async function SellerSettingsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold">Innstillinger</h1>
        <p className="mt-2 text-muted-foreground">
          Administrer din arrangørprofil og branding
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Arrangørprofil</CardTitle>
          <CardDescription>
            Din logo og informasjon vises på alle dine eventer og billetter
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LazyOrganizerProfileForm />
        </CardContent>
      </Card>

      <LazyFikenSettings />

      <LazyStripeConnectSettings />

      <Card>
        <CardHeader>
          <CardTitle>Hjelp og Dokumentasjon</CardTitle>
          <CardDescription>
            Finn svar på vanlige spørsmål om betalinger og oppsett
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <a href="/dashboard/help" className="block">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <HelpCircle className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">Komplett hjelpesenter</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Steg-for-steg guider for alle funksjoner
                    </p>
                  </CardContent>
                </Card>
              </a>

              <a href="/dashboard/help#klarna" className="block">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-green-600" />
                      <span className="font-medium">Klarna oppsett</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Alt om faktura-betaling og compliance
                    </p>
                  </CardContent>
                </Card>
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
