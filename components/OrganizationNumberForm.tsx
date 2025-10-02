"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Building2, CheckCircle, Loader2, AlertTriangle } from "lucide-react";

// Valider norsk organisasjonsnummer (9 siffer)
function validateOrganizationNumber(orgNr: string): boolean {
  const cleanOrgNr = orgNr.replace(/\s/g, '');
  return /^\d{9}$/.test(cleanOrgNr);
}

interface ValidationResult {
  valid: boolean;
  exists: boolean;
  active: boolean;
  company?: {
    name: string;
    orgForm: string;
    registrationDate: string;
    address?: {
      street: string;
      postalCode: string;
      city: string;
      country: string;
    };
  };
  error?: string;
}

export default function OrganizationNumberForm() {
  const { user } = useUser();
  const { toast } = useToast();
  const [organizationNumber, setOrganizationNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

  const userData = useQuery(api.users.getUserById, {
    userId: user?.id ?? "",
  });

  const updateUserProfile = useMutation(api.users.updateUserProfile);

  // Sett initial verdi når data lastes
  useEffect(() => {
    if (userData?.organizationNumber) {
      setOrganizationNumber(userData.organizationNumber);
    }
  }, [userData]);

  // Valider organisasjonsnummer mot Brreg når det endres
  useEffect(() => {
    const validateOrgNumber = async () => {
      const cleanOrgNr = organizationNumber.replace(/\s/g, '');

      if (cleanOrgNr.length === 9 && /^\d{9}$/.test(cleanOrgNr)) {
        setIsValidating(true);
        try {
          const response = await fetch('/api/validate-orgnr', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orgnr: cleanOrgNr }),
          });

          const result = await response.json();
          setValidationResult(result);
        } catch {
          setValidationResult({
            valid: false,
            exists: false,
            active: false,
            error: 'Kunne ikke validere organisasjonsnummer'
          });
        } finally {
          setIsValidating(false);
        }
      } else {
        setValidationResult(null);
      }
    };

    // Debounce validering
    const timeoutId = setTimeout(validateOrgNumber, 500);
    return () => clearTimeout(timeoutId);
  }, [organizationNumber]);

  const handleSave = async () => {
    if (!user?.id) return;

    const cleanOrgNr = organizationNumber.replace(/\s/g, '');

    // Sjekk om vi har et gyldig valideringsresultat
    if (cleanOrgNr && validationResult && !validationResult.valid) {
      toast({
        title: "Ugyldig organisasjonsnummer",
        description: validationResult.error || "Organisasjonsnummer er ikke gyldig",
        variant: "destructive",
      });
      return;
    }

    if (cleanOrgNr && !validateOrganizationNumber(cleanOrgNr)) {
      toast({
        title: "Ugyldig format",
        description: "Norske organisasjonsnummer må være 9 siffer",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await updateUserProfile({
        userId: user.id,
        organizationNumber: cleanOrgNr || undefined,
      });

      toast({
        title: "Lagret",
        description: "Organisasjonsnummer er oppdatert",
      });
    } catch {
      toast({
        title: "Feil",
        description: "Kunne ikke lagre organisasjonsnummer",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatOrgNumber = (value: string) => {
    // Formater med mellomrom for bedre lesbarhet (XXX XXX XXX)
    const clean = value.replace(/\s/g, '');
    if (clean.length <= 3) return clean;
    if (clean.length <= 6) return `${clean.slice(0, 3)} ${clean.slice(3)}`;
    return `${clean.slice(0, 3)} ${clean.slice(3, 6)} ${clean.slice(6, 9)}`;
  };

  const hasValidOrgNumber = userData?.organizationNumber && validateOrganizationNumber(userData.organizationNumber);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          Organisasjonsnummer
        </CardTitle>
        <CardDescription>
          Legg til organisasjonsnummer for å kunne betale med faktura via Klarna
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasValidOrgNumber ? (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Organisasjonsnummer registrert: {formatOrgNumber(userData.organizationNumber!)}
            </AlertDescription>
          </Alert>
        ) : (
          <Alert>
            <Building2 className="h-4 w-4" />
            <AlertDescription>
              Uten organisasjonsnummer kan du kun betale med kort. Legg til orgnr for faktura-betaling.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="orgNumber">Norsk organisasjonsnummer</Label>
          <Input
            id="orgNumber"
            placeholder="123 456 789"
            value={organizationNumber}
            onChange={(e) => setOrganizationNumber(formatOrgNumber(e.target.value))}
            maxLength={11} // 9 siffer + 2 mellomrom
          />
          <p className="text-sm text-gray-500">
            9-sifret organisasjonsnummer fra Brønnøysundregistrene
          </p>

          {/* Valideringsresultat */}
          {isValidating && (
            <div className="flex items-center gap-2 text-sm text-blue-600 mt-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Validerer mot Brønnøysundregistrene...
            </div>
          )}

          {validationResult && !isValidating && (
            <div className="mt-3">
              {validationResult.valid ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="font-medium text-green-900">
                      ✓ {validationResult.company?.name}
                    </div>
                    <div className="text-sm text-green-700 mt-1">
                      {validationResult.company?.orgForm} • Registrert {new Date(validationResult.company!.registrationDate).toLocaleDateString('nb-NO')}
                    </div>
                    {validationResult.company?.address && (
                      <div className="text-sm text-green-600 mt-1">
                        {validationResult.company.address.street}, {validationResult.company.address.postalCode} {validationResult.company.address.city}
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    {validationResult.error || "Organisasjonsnummer er ikke gyldig"}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </div>

        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Lagrer..." : "Lagre organisasjonsnummer"}
        </Button>
      </CardContent>
    </Card>
  );
}
