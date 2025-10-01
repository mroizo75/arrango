'use client'

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useStorageUrl } from "@/lib/hooks";

export function OrganizerProfileForm() {
  const profile = useQuery(api.organizerProfile.getOrganizerProfile);
  const updateProfile = useMutation(api.organizerProfile.updateOrganizerProfile);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);

  const [organizerName, setOrganizerName] = useState("");
  const [organizerWebsite, setOrganizerWebsite] = useState("");
  const [logoStorageId, setLogoStorageId] = useState<string | undefined>();
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const logoUrl = useStorageUrl(logoStorageId as any);

  // Debug logging
  console.log("Profile data:", profile);

  // Initialiser verdier når profil lastes
  useEffect(() => {
    if (profile) {
      console.log("Setting profile data:", profile);
      setOrganizerName(profile.organizerName || "");
      setOrganizerWebsite(profile.organizerWebsite || "");
      setLogoStorageId(profile.organizerLogoStorageId);
    }
  }, [profile]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Ugyldig filtype",
        description: "Vennligst last opp et bilde (PNG, JPG, etc.)",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!result.ok) throw new Error("Opplasting feilet");

      const { storageId } = await result.json();
      setLogoStorageId(storageId);

      toast({
        title: "Logo lastet opp",
        description: "Din logo er klar til å brukes",
      });
    } catch (error) {
      console.error("Opplastingsfeil:", error);
      toast({
        title: "Opplasting feilet",
        description: "Kunne ikke laste opp logo. Prøv igjen.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateProfile({
        organizerName: organizerName || undefined,
        organizerWebsite: organizerWebsite || undefined,
        organizerLogoStorageId: logoStorageId as any,
      });

      toast({
        title: "Profil oppdatert",
        description: "Din arrangørprofil er nå oppdatert",
      });
    } catch (error) {
      console.error("Feil ved lagring:", error);
      toast({
        title: "Lagring feilet",
        description: "Kunne ikke lagre endringer. Prøv igjen.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (profile === undefined) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-3 text-sm text-muted-foreground">Laster profil...</span>
      </div>
    );
  }

  // If profile is null, it means user is not authenticated - shouldn't happen as page is protected
  // but we'll treat it as empty profile for now

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="organizerName">Arrangørnavn</Label>
        <Input
          id="organizerName"
          placeholder="Navn på din organisasjon"
          value={organizerName}
          onChange={(e) => setOrganizerName(e.target.value)}
        />
        <p className="text-sm text-muted-foreground">
          Dette navnet vises på eventer og billetter
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="organizerWebsite">Nettside (valgfritt)</Label>
        <Input
          id="organizerWebsite"
          type="url"
          placeholder="https://dinorganisasjon.no"
          value={organizerWebsite}
          onChange={(e) => setOrganizerWebsite(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Arrangørlogo</Label>
        <div className="flex items-start gap-4">
          {logoUrl ? (
            <div className="relative">
              <Image
                src={logoUrl}
                alt="Arrangørlogo"
                width={120}
                height={120}
                className="rounded-lg border object-contain"
              />
              <button
                type="button"
                onClick={() => setLogoStorageId(undefined)}
                className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-white hover:bg-destructive/90"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex h-[120px] w-[120px] items-center justify-center rounded-lg border border-dashed">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 space-y-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Laster opp...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Last opp logo
                </>
              )}
            </Button>
            <p className="text-sm text-muted-foreground">
              PNG, JPG eller GIF. Maks 10MB. Anbefalt: 400x400px
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Lagrer...
            </>
          ) : (
            "Lagre endringer"
          )}
        </Button>
      </div>
    </form>
  );
}
