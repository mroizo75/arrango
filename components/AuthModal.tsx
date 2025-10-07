"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  callbackUrl?: string;
}

export function AuthModal({ open, onOpenChange, callbackUrl }: AuthModalProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");

  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });

  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: signInData.email,
        password: signInData.password,
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
        onOpenChange(false);
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (signUpData.password !== signUpData.confirmPassword) {
      toast({
        title: "Passordene matcher ikke",
        description: "Vennligst sjekk at begge passordene er like",
        variant: "destructive",
      });
      return;
    }

    if (signUpData.password.length < 6) {
      toast({
        title: "Passord for kort",
        description: "Passordet må være minst 6 tegn langt",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signUpData.name,
          email: signUpData.email,
          password: signUpData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registrering feilet");
      }

      toast({
        title: "Konto opprettet! 🎉",
        description: "Logger deg inn...",
      });

      // Automatically sign in after registration
      const signInResult = await signIn("credentials", {
        email: signUpData.email,
        password: signUpData.password,
        redirect: false,
      });

      if (signInResult?.error) {
        toast({
          title: "Innlogging feilet",
          description: "Konto opprettet, men kunne ikke logge inn automatisk",
          variant: "destructive",
        });
      } else {
        onOpenChange(false);
        router.refresh();
      }
    } catch (error: any) {
      toast({
        title: "Registrering feilet",
        description: error.message || "Vennligst prøv igjen senere",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Fortsett til billettbestilling</DialogTitle>
          <DialogDescription>
            Logg inn eller opprett en konto for å kjøpe billetter
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "signin" | "signup")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Logg inn</TabsTrigger>
            <TabsTrigger value="signup">Registrer</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">E-post</Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="din@epost.no"
                  value={signInData.email}
                  onChange={(e) =>
                    setSignInData({ ...signInData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signin-password">Passord</Label>
                <Input
                  id="signin-password"
                  type="password"
                  placeholder="••••••••"
                  value={signInData.password}
                  onChange={(e) =>
                    setSignInData({ ...signInData, password: e.target.value })
                  }
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
                disabled={isLoading}
              >
                {isLoading ? "Logger inn..." : "Logg inn"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Navn</Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="Ditt navn"
                  value={signUpData.name}
                  onChange={(e) =>
                    setSignUpData({ ...signUpData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">E-post</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="din@epost.no"
                  value={signUpData.email}
                  onChange={(e) =>
                    setSignUpData({ ...signUpData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Passord</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="Minst 6 tegn"
                  value={signUpData.password}
                  onChange={(e) =>
                    setSignUpData({ ...signUpData, password: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-confirm-password">Bekreft passord</Label>
                <Input
                  id="signup-confirm-password"
                  type="password"
                  placeholder="Gjenta passordet"
                  value={signUpData.confirmPassword}
                  onChange={(e) =>
                    setSignUpData({ ...signUpData, confirmPassword: e.target.value })
                  }
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900"
                disabled={isLoading}
              >
                {isLoading ? "Oppretter konto..." : "Opprett konto"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

