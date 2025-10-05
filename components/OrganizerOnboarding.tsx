"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSession } from "next-auth/react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Loader2 } from "lucide-react";

interface OrganizerOnboardingProps {
  open: boolean;
  onComplete?: () => void;
}

export default function OrganizerOnboarding({ open }: OrganizerOnboardingProps) {
  const { data: session } = useSession();
  const user = session?.user;
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    organizationNumber: "",
    organizerName: "",
  });

  const setUserAsOrganizer = useMutation(api.organizerProfile.setUserAsOrganizer);

  const validateOrgNumber = async () => {
    if (!formData.organizationNumber) {
      toast({
        title: "Feil",
        description: "Vennligst fyll inn organisasjonsnummer",
        variant: "destructive",
      });
      return false;
    }

    // Basic validation for Norwegian org numbers (9 digits)
    if (!/^\d{9}$/.test(formData.organizationNumber)) {
      toast({
        title: "Ugyldig organisasjonsnummer",
        description: "Organisasjonsnummer må være 9 siffer",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleNext = async () => {
    if (step === 1) {
      const isValid = await validateOrgNumber();
      if (isValid) {
        setStep(2);
      }
    } else if (step === 2) {
      if (!formData.organizerName) {
        toast({
          title: "Feil",
          description: "Vennligst fyll inn arrangørnavn",
          variant: "destructive",
        });
        return;
      }

      setLoading(true);
      try {
        // First, set user as organizer in Convex
        await setUserAsOrganizer({
          userId: user!.id,
          organizationNumber: formData.organizationNumber,
          organizerName: formData.organizerName,
        });

        // Then update Clerk metadata via API route
        const response = await fetch("/api/set-organizer-metadata", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            role: "organizer",
            onboarding: "completed",
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update Clerk metadata");
        }

        toast({
          title: "Velkommen som arrangør! 🎉",
          description: "Du kan nå begynne å lage arrangementer",
        });

        // Reload to sync new metadata
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1000);
      } catch (error) {
        console.error("Error setting up organizer:", error);
        toast({
          title: "Feil",
          description: "Kunne ikke fullføre registreringen. Prøv igjen.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[500px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {step === 1 ? "Organisasjonsinformasjon" : "Arrangørprofil"}
          </DialogTitle>
          <DialogDescription>
            {step === 1
              ? "Vi trenger ditt organisasjonsnummer for fakturering og betalinger"
              : "Gi arrangørprofilen din et navn"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {step === 1 ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="orgNumber">Organisasjonsnummer *</Label>
                <Input
                  id="orgNumber"
                  placeholder="123456789"
                  value={formData.organizationNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, organizationNumber: e.target.value })
                  }
                  maxLength={9}
                />
                <p className="text-sm text-gray-500">9 siffer</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                <h4 className="font-semibold text-blue-900 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Hvorfor trenger vi dette?
                </h4>
                <ul className="text-sm text-blue-800 space-y-1 ml-6 list-disc">
                  <li>For å koble til Stripe for betalinger</li>
                  <li>For automatisk fakturering via Fiken</li>
                  <li>For å overholde norske regnskapsregler</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="organizerName">Arrangørnavn *</Label>
                <Input
                  id="organizerName"
                  placeholder="F.eks. Mitt Eventfirma AS"
                  value={formData.organizerName}
                  onChange={(e) =>
                    setFormData({ ...formData, organizerName: e.target.value })
                  }
                />
                <p className="text-sm text-gray-500">
                  Dette navnet vises på billetter og arrangementer
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2">Neste steg:</h4>
                <ol className="text-sm text-green-800 space-y-1 ml-4 list-decimal">
                  <li>Koble til Stripe for å motta betalinger</li>
                  <li>Opprett ditt første arrangement</li>
                  <li>Start salget!</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setStep(1)}
            disabled={step === 1 || loading}
          >
            Tilbake
          </Button>
          <Button onClick={handleNext} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Lagrer...
              </>
            ) : step === 1 ? (
              "Neste"
            ) : (
              "Fullfør"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
