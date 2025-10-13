"use client";

import { useState } from "react";
import React from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CreditCard, CheckCircle, AlertTriangle, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createStripeConnectAccountLink } from "@/app/actions/createStripeConnectAccountLink";
import { getStripeConnectAccountStatus, type AccountStatus } from "@/app/actions/getStripeConnectAccountStatus";
import { createStripeConnectCustomer } from "@/app/actions/createStripeConnectCustomer";

export default function StripeConnectSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [accountStatus, setAccountStatus] = useState<AccountStatus | null>(null);
  const { toast } = useToast();
  const { data: session } = useSession();
  const user = session?.user;

  // Get user's Stripe Connect account
  const stripeAccount = useQuery(api.users.getUsersStripeConnectId, {
    userId: user?.id || "",
  });

  // Fetch account status when stripeAccount changes
  React.useEffect(() => {
    const fetchAccountStatus = async () => {
      if (!stripeAccount) {
        setAccountStatus(null);
        return;
      }

      try {
        const status = await getStripeConnectAccountStatus(stripeAccount);
        setAccountStatus(status);
      } catch (error) {
        console.error("Error fetching account status:", error);
        setAccountStatus(null);
      }
    };

    fetchAccountStatus();
  }, [stripeAccount]);

  const handleCreateAccount = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      // Create a Stripe Connect account via server action
      const result = await createStripeConnectCustomer();
      
      toast({
        title: "Stripe konto opprettet",
        description: "Kontoen din er klar. Start onboarding for å fullføre oppsettet.",
      });
      
      // Reload to refresh the stripe account query
      window.location.reload();
    } catch (error) {
      console.error("Error creating Stripe account:", error);
      toast({
        title: "Feil",
        description: error instanceof Error ? error.message : "Kunne ikke opprette Stripe konto. Prøv igjen.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartOnboarding = async () => {
    if (!stripeAccount) return;

    setIsLoading(true);
    try {
      const result = await createStripeConnectAccountLink(stripeAccount);
      window.location.href = result.url;
    } catch (error) {
      console.error("Error starting onboarding:", error);
      toast({
        title: "Feil",
        description: "Kunne ikke starte onboarding. Prøv igjen.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Stripe Connect Betalinger
        </CardTitle>
        <CardDescription>
          Koble til Stripe for å motta betalinger fra billettsalg
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!stripeAccount ? (
          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Du må koble til Stripe før du kan selge billetter og motta betalinger.
              </AlertDescription>
            </Alert>

            <Button onClick={handleCreateAccount} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Koble til Stripe
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Stripe-konto:</span>
                <Badge variant="outline" className="font-mono text-xs">
                  {stripeAccount}
                </Badge>
              </div>
            </div>

            {accountStatus ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {accountStatus.isActive ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600 font-medium">
                        Konto aktiv - Klar til å motta betalinger
                      </span>
                    </>
                  ) : accountStatus.requiresInformation ? (
                    <>
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm text-yellow-600 font-medium">
                        Krever tilleggsinformasjon
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-orange-600" />
                      <span className="text-sm text-orange-600 font-medium">
                        Under gjennomgang
                      </span>
                    </>
                  )}
                </div>

                {!accountStatus.isActive && (
                  <Button onClick={handleStartOnboarding} disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {accountStatus.requiresInformation ? "Fullfør oppsett" : "Start onboarding"}
                    <ExternalLink className="ml-2 w-4 h-4" />
                  </Button>
                )}

                {accountStatus.requirements.currently_due.length > 0 && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-1">
                        <p className="font-medium">Kreves nå:</p>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          {accountStatus.requirements.currently_due.map((req, index) => (
                            <li key={index}>{req.replace(/_/g, ' ')}</li>
                          ))}
                        </ul>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {accountStatus.requirements.eventually_due.length > 0 && (
                  <Alert>
                    <AlertDescription>
                      <div className="space-y-1">
                        <p className="font-medium">Vil kreves senere:</p>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          {accountStatus.requirements.eventually_due.map((req, index) => (
                            <li key={index}>{req.replace(/_/g, ' ')}</li>
                          ))}
                        </ul>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-gray-600">Laster konto-status...</span>
                </div>
                <Button onClick={handleStartOnboarding} disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Start onboarding
                  <ExternalLink className="ml-2 w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-gray-500 pt-4 border-t">
          <p>
            Stripe Connect håndterer alle betalinger trygt og sikkert. Du beholder kontrollen over
            når pengene utbetales til din bankkonto.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
