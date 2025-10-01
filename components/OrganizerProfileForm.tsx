'use client'

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, X, ExternalLink } from "lucide-react";
import Image from "next/image";
import { useStorageUrl } from "@/lib/hooks";
import Link from "next/link";

export function OrganizerProfileForm() {
  const profile = useQuery(api.organizerProfile.getOrganizerProfile);
  const updateProfile = useMutation(api.organizerProfile.updateOrganizerProfile);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);

  const [organizerName, setOrganizerName] = useState("");
  const [organizerWebsite, setOrganizerWebsite] = useState("");
  const [organizerBio, setOrganizerBio] = useState("");
  const [organizerDescription, setOrganizerDescription] = useState("");
  const [organizerPhone, setOrganizerPhone] = useState("");
  const [organizerAddress, setOrganizerAddress] = useState("");
  const [organizerCity, setOrganizerCity] = useState("");
  const [organizerCountry, setOrganizerCountry] = useState("");
  const [organizerFacebook, setOrganizerFacebook] = useState("");
  const [organizerInstagram, setOrganizerInstagram] = useState("");
  const [organizerTwitter, setOrganizerTwitter] = useState("");
  const [organizerLinkedIn, setOrganizerLinkedIn] = useState("");
  const [organizerSlug, setOrganizerSlug] = useState("");
  const [logoStorageId, setLogoStorageId] = useState<Id<"_storage"> | undefined>();
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const logoUrl = useStorageUrl(logoStorageId);

  // Debug logging
  console.log("Profile data:", profile);

  // Initialiser verdier når profil lastes
  useEffect(() => {
    if (profile) {
      console.log("Setting profile data:", profile);
      setOrganizerName(profile.organizerName || "");
      setOrganizerWebsite(profile.organizerWebsite || "");
      setOrganizerBio(profile.organizerBio || "");
      setOrganizerDescription(profile.organizerDescription || "");
      setOrganizerPhone(profile.organizerPhone || "");
      setOrganizerAddress(profile.organizerAddress || "");
      setOrganizerCity(profile.organizerCity || "");
      setOrganizerCountry(profile.organizerCountry || "");
      setOrganizerFacebook(profile.organizerFacebook || "");
      setOrganizerInstagram(profile.organizerInstagram || "");
      setOrganizerTwitter(profile.organizerTwitter || "");
      setOrganizerLinkedIn(profile.organizerLinkedIn || "");
      setOrganizerSlug(profile.organizerSlug || "");
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
      setLogoStorageId(storageId as Id<"_storage">);

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
        organizerBio: organizerBio || undefined,
        organizerDescription: organizerDescription || undefined,
        organizerPhone: organizerPhone || undefined,
        organizerAddress: organizerAddress || undefined,
        organizerCity: organizerCity || undefined,
        organizerCountry: organizerCountry || undefined,
        organizerFacebook: organizerFacebook || undefined,
        organizerInstagram: organizerInstagram || undefined,
        organizerTwitter: organizerTwitter || undefined,
        organizerLinkedIn: organizerLinkedIn || undefined,
        organizerSlug: organizerSlug || undefined,
        organizerLogoStorageId: logoStorageId,
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

      {/* Basic Information */}
      <div className="space-y-2">
        <Label htmlFor="organizerBio">Kort bio (valgfritt)</Label>
        <Input
          id="organizerBio"
          placeholder="F.eks. 'Profesjonell eventarrangør med 10+ års erfaring'"
          value={organizerBio}
          onChange={(e) => setOrganizerBio(e.target.value)}
          maxLength={160}
        />
        <p className="text-sm text-muted-foreground">
          {organizerBio.length}/160 tegn
        </p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="organizerDescription">Beskrivelse (valgfritt)</Label>
        <Textarea
          id="organizerDescription"
          placeholder="Fortell mer om din organisasjon, historie og hva dere tilbyr..."
          value={organizerDescription}
          onChange={(e) => setOrganizerDescription(e.target.value)}
          rows={4}
          maxLength={1000}
        />
        <p className="text-sm text-muted-foreground">
          {organizerDescription.length}/1000 tegn
        </p>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Kontaktinformasjon</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="organizerPhone">Telefon (valgfritt)</Label>
            <Input
              id="organizerPhone"
              type="tel"
              placeholder="+47 123 45 678"
              value={organizerPhone}
              onChange={(e) => setOrganizerPhone(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="organizerAddress">Adresse (valgfritt)</Label>
            <Input
              id="organizerAddress"
              placeholder="Karl Johans Gate 1"
              value={organizerAddress}
              onChange={(e) => setOrganizerAddress(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="organizerCity">By (valgfritt)</Label>
            <Input
              id="organizerCity"
              placeholder="Oslo"
              value={organizerCity}
              onChange={(e) => setOrganizerCity(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="organizerCountry">Land (valgfritt)</Label>
            <Input
              id="organizerCountry"
              placeholder="Norge"
              value={organizerCountry}
              onChange={(e) => setOrganizerCountry(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Sosiale medier</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="organizerFacebook">Facebook (valgfritt)</Label>
            <Input
              id="organizerFacebook"
              placeholder="https://facebook.com/dinorganisasjon"
              value={organizerFacebook}
              onChange={(e) => setOrganizerFacebook(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="organizerInstagram">Instagram (valgfritt)</Label>
            <Input
              id="organizerInstagram"
              placeholder="https://instagram.com/dinorganisasjon"
              value={organizerInstagram}
              onChange={(e) => setOrganizerInstagram(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="organizerTwitter">Twitter/X (valgfritt)</Label>
            <Input
              id="organizerTwitter"
              placeholder="https://twitter.com/dinorganisasjon"
              value={organizerTwitter}
              onChange={(e) => setOrganizerTwitter(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="organizerLinkedIn">LinkedIn (valgfritt)</Label>
            <Input
              id="organizerLinkedIn"
              placeholder="https://linkedin.com/company/dinorganisasjon"
              value={organizerLinkedIn}
              onChange={(e) => setOrganizerLinkedIn(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Public Profile */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Offentlig profil</h3>

        <div className="space-y-2">
          <Label htmlFor="organizerSlug">Profil-URL (valgfritt)</Label>
          <div className="flex gap-2">
            <span className="flex items-center px-3 py-2 bg-gray-50 border border-gray-200 rounded-l text-sm text-gray-500">
              arrango.no/organizer/
            </span>
            <Input
              id="organizerSlug"
              placeholder="din-organisasjon"
              value={organizerSlug}
              onChange={(e) => setOrganizerSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
              className="rounded-l-none"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Dette blir din offentlige profil-URL. Bruk kun bokstaver, tall og bindestreker.
          </p>
          {organizerSlug && (
            <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded">
              <ExternalLink className="w-4 h-4 text-blue-600" />
              <Link
                href={`/organizer/${organizerSlug}`}
                target="_blank"
                className="text-blue-600 hover:underline text-sm"
              >
                arrango.no/organizer/{organizerSlug}
              </Link>
            </div>
          )}
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
