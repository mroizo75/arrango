import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { OrganizerProfileForm } from "@/components/OrganizerProfileForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
          <OrganizerProfileForm />
        </CardContent>
      </Card>
    </div>
  );
}
