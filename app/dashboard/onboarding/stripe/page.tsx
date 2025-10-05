"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, CreditCard, ArrowRight, Gift } from "lucide-react";
import Spinner from "@/components/Spinner";

export default function StripeOnboardingPage() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const isLoaded = status !== "loading";
  const router = useRouter();
  const { toast } = useToast();
  const [settingUpOrganizer, setSettingUpOrganizer] = useState(true);

  useEffect(() => {
    if (!isLoaded || !user) return;

    // Prevent running multiple times
    const hasRun = sessionStorage.getItem("organizerSetupComplete");
    if (hasRun === "true") {
      console.log("Setup already completed, skipping");
      setSettingUpOrganizer(false);
      return;
    }

    const setupOrganizer = async () => {
      try {
        console.log("Checking organizer setup...");
        
        // User is already set as organizer during registration
        // Just verify and clear sessionStorage
        
        const storedData = sessionStorage.getItem("organizerOnboarding");
        if (storedData) {
          console.log("Found org data in sessionStorage:", JSON.parse(storedData));
          // Clear it since we don't need it anymore
          sessionStorage.removeItem("organizerOnboarding");
        }

        // Mark setup as complete
        sessionStorage.setItem("organizerSetupComplete", "true");
        
        console.log("✅ Organizer setup verified");
        setSettingUpOrganizer(false);
      } catch (error) {
        console.error("❌ Error verifying organizer setup:", error);
        toast({
          title: "Feil",
          description: "Kunne ikke verifisere oppsettet. Prøv igjen.",
          variant: "destructive",
        });
        setSettingUpOrganizer(false);
      }
    };

    setupOrganizer();
  }, [user, isLoaded, router, toast]);

  const handleSetupStripe = () => {
    // Redirect to settings where the existing Stripe Connect flow is
    router.push("/dashboard/settings#stripe");
  };

  const handleSkipForNow = async () => {
    try {
      // Onboarding is now complete (Stripe is optional)
      console.log("Skipping Stripe setup for now");
      
      // Clear sessionStorage
      sessionStorage.removeItem("organizerOnboarding");
      sessionStorage.removeItem("organizerSetupComplete");
      
      toast({
        title: "Velkommen! 🎉",
        description: "Du kan sette opp Stripe senere i innstillinger",
      });
      
      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Error skipping Stripe setup:", error);
      toast({
        title: "Feil",
        description: "Kunne ikke fullføre. Prøv igjen.",
        variant: "destructive",
      });
    }
  };

  if (!isLoaded || settingUpOrganizer) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Spinner />
          <p className="mt-4 text-gray-600">Setter opp din arrangørprofil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white text-center">
            <CheckCircle className="w-12 h-12 mx-auto mb-3" />
            <h1 className="text-2xl font-bold mb-2">Velkommen som arrangør! 🎉</h1>
            <p className="text-blue-100">Din profil er opprettet</p>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Main message */}
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold text-gray-900">
                Neste steg: Koble til betalinger
              </h2>
              <p className="text-gray-600">
                For å selge billetter trenger du en betalingskonto
              </p>
            </div>

            {/* Options */}
            <div className="space-y-4">
              {/* Stripe Option */}
              <Card className="border-2 border-blue-200 hover:border-blue-400 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <CreditCard className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">Sett opp Stripe nå</h3>
                        <p className="text-sm text-gray-600">
                          Aksepter kort, Klarna og Swish • Ta ~5 minutter
                        </p>
                      </div>
                      <Button
                        onClick={handleSetupStripe}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        Koble til Stripe
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Free events option */}
              <Card className="border-2 hover:border-gray-300 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Gift className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">Start med gratis events</h3>
                        <p className="text-sm text-gray-600">
                          Ingen betalinger nødvendig • Sett opp Stripe senere
                        </p>
                      </div>
                      <Button
                        onClick={handleSkipForNow}
                        variant="outline"
                        className="w-full"
                      >
                        Gå til dashbordet
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Footer info */}
            <p className="text-xs text-center text-gray-500 pt-4">
              Du kan alltid endre dette senere i innstillinger
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
