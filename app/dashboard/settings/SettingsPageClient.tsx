"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSession } from "next-auth/react";
import OrganizerOnboarding from "@/components/OrganizerOnboarding";
import { OrganizerProfileForm } from "@/components/OrganizerProfileForm";
import FikenSettings from "@/components/FikenSettings";
import StripeConnectSettings from "@/components/StripeConnectSettings";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SettingsPageClient() {
  const { data: session } = useSession();
  const user = session?.user;
  const searchParams = useSearchParams();
  const isOnboarding = searchParams.get("onboarding") === "true";
  
  const hasCompletedOnboarding = useQuery(
    api.organizerProfile.hasCompletedOrganizerOnboarding,
    user?.id ? { userId: user.id } : "skip"
  );

  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (isOnboarding && hasCompletedOnboarding === false) {
      setShowOnboarding(true);
    }
  }, [isOnboarding, hasCompletedOnboarding]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    // Refresh the page to show updated settings
    window.location.href = "/dashboard/settings";
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <OrganizerOnboarding 
        open={showOnboarding} 
        onComplete={handleOnboardingComplete}
      />

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
              Informasjon om deg som arrangør. Dette vises på dine arrangementer.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OrganizerProfileForm />
          </CardContent>
        </Card>

        <Card id="stripe">
          <CardHeader>
            <CardTitle>Stripe Connect</CardTitle>
            <CardDescription>
              Koble til Stripe for å motta betalinger fra billettsalg
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StripeConnectSettings />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fiken Integrasjon</CardTitle>
            <CardDescription>
              Koble til Fiken for automatisk fakturering og regnskap
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FikenSettings />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
