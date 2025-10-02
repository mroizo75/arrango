"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Settings, X, Cookie } from 'lucide-react';
import { useCookieConsent } from '@/hooks/useCookieConsent';

export default function CookieConsent() {
  const {
    preferences,
    setConsent,
    updatePreferences,
    showBanner,
    hideBanner,
    showPreferences,
    setShowPreferences
  } = useCookieConsent();

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);

    // Listen for cookie preferences modal trigger
    const handleOpenPreferences = () => {
      setShowPreferences(true);
    };

    window.addEventListener('openCookiePreferences', handleOpenPreferences);

    return () => {
      window.removeEventListener('openCookiePreferences', handleOpenPreferences);
    };
  }, [setShowPreferences]);

  if (!isLoaded) return null;

  const handleAcceptAll = () => {
    updatePreferences({
      necessary: true,
      analytics: true,
      marketing: true,
    });
    setConsent(true);
    hideBanner();
  };

  const handleAcceptNecessary = () => {
    updatePreferences({
      necessary: true,
      analytics: false,
      marketing: false,
    });
    setConsent(true);
    hideBanner();
  };

  const handleSavePreferences = () => {
    setConsent(true);
    hideBanner();
    setShowPreferences(false);
  };

  return (
    <>
      {/* Cookie Banner - Only show when banner should be visible */}
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex items-center gap-3 flex-1">
                <Cookie className="w-8 h-8 text-blue-600 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Vi bruker cookies
                  </h3>
                  <p className="text-sm text-gray-600">
                    Vi bruker cookies for å forbedre din opplevelse, analysere trafikk og tilpasse innhold.
                    Les vår <a href="/cookies" className="text-blue-600 hover:underline">cookiepolicy</a> for mer informasjon.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Tilpass
                    </Button>
                  </DialogTrigger>
                </Dialog>

                <Button variant="outline" size="sm" onClick={handleAcceptNecessary}>
                  Kun nødvendige
                </Button>

                <Button size="sm" onClick={handleAcceptAll}>
                  Godta alle
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={hideBanner}
                className="absolute top-2 right-2 md:relative md:top-0 md:right-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Invisible container to keep component mounted for event handling */}
      {!showBanner && <div style={{ display: 'none' }} aria-hidden="true" />}

      {/* Cookie Preferences Modal */}
      <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Cookie className="w-5 h-5" />
              Cookie-innstillinger
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Necessary Cookies */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Nødvendige cookies</CardTitle>
                    <Badge variant="secondary" className="mt-1">Alltid aktiv</Badge>
                  </div>
                  <Switch checked={true} disabled onCheckedChange={() => {}} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Disse cookiene er nødvendige for at nettstedet skal fungere ordentlig.
                  De kan ikke slås av. Disse inkluderer cookies for grunnleggende funksjonalitet,
                  sikkerhet og tilgang til tjenester.
                </p>
              </CardContent>
            </Card>

            {/* Analytics Cookies */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Analyse-cookies</CardTitle>
                    <Badge variant="outline" className="mt-1">Valgfritt</Badge>
                  </div>
                  <Switch
                    checked={preferences.analytics}
                    onCheckedChange={(checked) =>
                      updatePreferences({ ...preferences, analytics: checked })
                    }
                  />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Disse cookiene hjelper oss å forstå hvordan besøkende bruker nettstedet,
                  slik at vi kan forbedre funksjonalitet og brukeropplevelse. Vi bruker Google Analytics
                  for å samle inn anonymisert statistikk.
                </p>
              </CardContent>
            </Card>

            {/* Marketing Cookies */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Markedsførings-cookies</CardTitle>
                    <Badge variant="outline" className="mt-1">Valgfritt</Badge>
                  </div>
                  <Switch
                    checked={preferences.marketing}
                    onCheckedChange={(checked) =>
                      updatePreferences({ ...preferences, marketing: checked })
                    }
                  />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Disse cookiene brukes til å spore besøkende på tvers av nettsteder for å vise
                  relevante annonser og markedsføringsinnhold. Vi bruker ikke markedsførings-cookies
                  på vår plattform, men tredjeparts tjenester kan gjøre det.
                </p>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowPreferences(false)}>
                Avbryt
              </Button>
              <Button onClick={handleSavePreferences}>
                Lagre preferanser
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
