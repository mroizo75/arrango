"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowRight, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { registerUserAction } from "@/app/actions/registerUser";

export default function BecomeOrganizerPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [formData, setFormData] = useState({
    // Steg 1: Organisasjonsinfo
    organizationNumber: "",
    organizerName: "",
    // Steg 2: Personlig info
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validateOrgNumber = () => {
    if (!/^\d{9}$/.test(formData.organizationNumber)) {
      toast({
        title: "Ugyldig organisasjonsnummer",
        description: "Organisasjonsnummer må være 9 siffer",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.organizerName) {
      toast({
        title: "Feil",
        description: "Vennligst fyll inn arrangørnavn",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleContinueToPersonalInfo = () => {
    if (validateOrgNumber()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Validering
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Passordene matcher ikke",
          description: "Vennligst sjekk at begge passordene er like",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      if (formData.password.length < 6) {
        toast({
          title: "Passord for kort",
          description: "Passordet må være minst 6 tegn langt",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      console.log("Registering organizer...", {
        email: formData.email,
        organizerName: formData.organizerName,
      });

      // Registrer arrangør via server action (sikker passord-hashing)
      const result = await registerUserAction({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        isOrganizer: true,
        organizationNumber: formData.organizationNumber,
        organizerName: formData.organizerName,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      toast({
        title: "Arrangør opprettet! 🎉",
        description: "Logger deg inn og sender deg til onboarding...",
      });

      // Lagre org data i sessionStorage for Stripe onboarding
      sessionStorage.setItem("organizerOnboarding", JSON.stringify({
        organizationNumber: formData.organizationNumber,
        organizerName: formData.organizerName,
      }));

      // Logg inn automatisk
      const signInResult = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (signInResult?.error) {
        toast({
          title: "Registrering vellykket, men innlogging feilet",
          description: "Vennligst logg inn manuelt",
          variant: "destructive",
        });
        router.push("/sign-in");
      } else {
        // Redirect to Stripe onboarding
        router.push("/dashboard/onboarding/stripe");
        router.refresh();
      }
    } catch (error: unknown) {
      console.error("❌ Error registering organizer:", error);
      toast({
        title: "Registrering feilet",
        description: error instanceof Error ? error.message : "Kunne ikke fullføre registreringen",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Steg 1: Organisasjonsinformasjon
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Bli arrangør på Arrango
            </h1>
            <p className="text-xl text-gray-600">
              Steg 1 av 2: Organisasjonsinformasjon
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-blue-600" />
                  Organisasjonsinformasjon
                </CardTitle>
                <CardDescription>
                  Vi trenger ditt organisasjonsnummer for fakturering og betalinger
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
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

                <div className="space-y-2">
                  <Label htmlFor="organizerName">Arrangørnavn *</Label>
                  <Input
                    id="organizerName"
                    placeholder="Min Organisasjon AS"
                    value={formData.organizerName}
                    onChange={(e) =>
                      setFormData({ ...formData, organizerName: e.target.value })
                    }
                  />
                  <p className="text-sm text-gray-500">Dette vises på dine arrangementer</p>
                </div>

                <Button
                  onClick={handleContinueToPersonalInfo}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  Fortsett til personlig informasjon
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hva får du som arrangør?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">Gratis å komme i gang</h3>
                      <p className="text-sm text-gray-600">Ingen oppstartskostnader</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">Komplett billettsystem</h3>
                      <p className="text-sm text-gray-600">Selg billetter online</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">Sikre betalinger</h3>
                      <p className="text-sm text-gray-600">Stripe, Klarna og Swish</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Steg 2: Personlig informasjon og konto
  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Opprett din arrangørkonto
            </h1>
            <p className="text-xl text-gray-600">
              Steg 2 av 2: Personlig informasjon
            </p>
          </div>

          <Card className="max-w-md mx-auto shadow-2xl">
            <CardHeader>
              <CardTitle>Din konto</CardTitle>
              <CardDescription>
                Fyll inn dine personlige detaljer for å fullføre registreringen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Fullt navn *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Ola Nordmann"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    disabled={isProcessing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-post *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="din@epost.no"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    disabled={isProcessing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Passord *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Minst 6 tegn"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                    disabled={isProcessing}
                    minLength={6}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Bekreft passord *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Skriv inn passord igjen"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmPassword: e.target.value })
                    }
                    required
                    disabled={isProcessing}
                    minLength={6}
                  />
                </div>

                <div className="pt-4 space-y-3">
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    size="lg"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Oppretter konto..." : "Fullfør registrering"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => setStep(1)}
                    disabled={isProcessing}
                  >
                    Tilbake
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}
