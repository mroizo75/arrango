"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function FikenSettings() {
  const { data: session } = useSession();
  const user = session?.user;
  const { toast } = useToast();

  const [companySlug, setCompanySlug] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const fikenCredentials = useQuery(api.fikenQueries.getFikenCredentials, {
    userId: user?.id ?? "",
  });

  // Load existing data into form when available
  React.useEffect(() => {
    if (fikenCredentials) {
      setCompanySlug(fikenCredentials.companySlug || "");
      setAccessToken(fikenCredentials.accessToken || "");
    }
  }, [fikenCredentials]);

  const saveCredentials = useMutation(api.fikenMutations.saveFikenCredentials);

  const handleSave = async () => {
    if (!user?.id || !companySlug.trim() || !accessToken.trim()) {
      toast({
        title: "Feil",
        description: "Vennligst fyll inn alle feltene",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await saveCredentials({
        userId: user.id,
        companySlug: companySlug.trim(),
        accessToken: accessToken.trim(),
      });

      toast({
        title: "Lagret",
        description: "Fiken-innstillingene er lagret",
      });

      // Clear form only if it was empty before (new setup)
      if (!fikenCredentials) {
        setCompanySlug("");
        setAccessToken("");
      }
    } catch {
      toast({
        title: "Feil",
        description: "Kunne ikke lagre Fiken-innstillingene",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async () => {
    if (!user?.id) return;

    setIsTesting(true);
    try {
      const result = await fetch("/api/test-fiken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await result.json();

      if (data.success) {
        toast({
          title: "Tilkobling vellykket",
          description: `Tilkoblet til ${data.company.name}`,
        });
      } else {
        toast({
          title: "Tilkoblingsfeil",
          description: data.error,
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Feil",
        description: "Kunne ikke teste tilkoblingen",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Fiken Regnskapsintegrasjon
        </CardTitle>
        <CardDescription>
          Koble til Fiken for automatisk fakturering av solgte billetter.
          Dette gjør regnskapet ditt mye enklere!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {fikenCredentials ? (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Fiken er konfigurert for bedriften din. Fakturaer vil bli opprettet automatisk når billetter selges.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Fiken er ikke konfigurert ennå. Fyll inn informasjonen nedenfor for å komme i gang.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div>
            <Label htmlFor="companySlug">Bedrift Slug</Label>
            <Input
              id="companySlug"
              placeholder="f.eks. ditt-bedrifts-navn"
              value={companySlug}
              onChange={(e) => setCompanySlug(e.target.value)}
            />
            <p className="text-sm text-gray-500 mt-1">
              Finnes i Fiken URL-en din: https://app.fiken.no/bedrifter/[SLUG]
            </p>
          </div>

          <div>
            <Label htmlFor="accessToken">API Token</Label>
            <Input
              id="accessToken"
              type="password"
              placeholder="Din Fiken API token"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
            />
            <p className="text-sm text-gray-500 mt-1">
              Opprett en API token i Fiken under Innstillinger → Utviklere
            </p>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Lagrer...
                </>
              ) : (
                "Lagre innstillinger"
              )}
            </Button>

            {fikenCredentials && (
              <Button variant="outline" onClick={handleTestConnection} disabled={isTesting}>
                {isTesting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Tester...
                  </>
                ) : (
                  "Test tilkobling"
                )}
              </Button>
            )}
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Hvordan komme i gang:</h4>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. Logg inn på Fiken.no</li>
            <li>2. Gå til Innstillinger → Utviklere</li>
            <li>3. Opprett en ny API token</li>
            <li>4. Kopier bedriftens slug fra URL-en</li>
            <li>5. Lim inn informasjonen ovenfor</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
