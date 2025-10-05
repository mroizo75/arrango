"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { registerUserAction } from "@/app/actions/registerUser";

export default function SignUpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validering
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Passordene matcher ikke",
          description: "Vennligst sjekk at begge passordene er like",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        toast({
          title: "Passord for kort",
          description: "Passordet må være minst 6 tegn langt",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Registrer bruker via server action (sikker passord-hashing)
      const result = await registerUserAction({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        isOrganizer: false,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      toast({
        title: "Konto opprettet! 🎉",
        description: "Logger deg inn...",
      });

      // Logg inn automatisk etter registrering
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
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error: unknown) {
      console.error("Registration error:", error);
      toast({
        title: "Registrering feilet",
        description: error instanceof Error ? error.message : "Vennligst prøv igjen senere",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Registrer deg</CardTitle>
          <CardDescription>Opprett din Arrango-konto</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Fullt navn</Label>
              <Input
                id="name"
                type="text"
                placeholder="Ola Nordmann"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-post</Label>
              <Input
                id="email"
                type="email"
                placeholder="din@epost.no"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Passord</Label>
              <Input
                id="password"
                type="password"
                placeholder="Minst 6 tegn"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                disabled={isLoading}
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Bekreft passord</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Skriv inn passord igjen"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                required
                disabled={isLoading}
                minLength={6}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Oppretter konto..." : "Registrer deg"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Har du allerede en konto?{" "}
            <Link href="/sign-in" className="text-blue-600 hover:underline font-medium">
              Logg inn her
            </Link>
          </div>

          <div className="mt-4 text-center text-sm text-gray-600">
            Vil du bli arrangør?{" "}
            <Link href="/become-organizer" className="text-blue-600 hover:underline font-medium">
              Kom i gang gratis
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
