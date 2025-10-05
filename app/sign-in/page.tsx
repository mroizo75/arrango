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

export default function SignInPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        toast({
          title: "Innlogging feilet",
          description: "Ugyldig e-post eller passord",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Velkommen tilbake! 👋",
          description: "Du er nå logget inn",
        });
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Noe gikk galt",
        description: "Vennligst prøv igjen senere",
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
          <CardTitle className="text-3xl font-bold">Logg inn</CardTitle>
          <CardDescription>Velkommen tilbake til Arrango</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Logger inn..." : "Logg inn"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Har du ikke en konto?{" "}
            <Link href="/sign-up" className="text-blue-600 hover:underline font-medium">
              Registrer deg her
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
