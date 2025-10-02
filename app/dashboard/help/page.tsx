import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  CreditCard,
  FileText,
  Calculator,
  HelpCircle,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Settings,
  DollarSign
} from "lucide-react";
import Link from "next/link";

export default function SellerHelpPage() {
  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold">Hjelp og Oppsett</h1>
        <p className="mt-2 text-muted-foreground">
          Alt du trenger å vite for å komme i gang med betalinger og regnskap
        </p>
      </div>

      <Tabs defaultValue="payments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="payments">Betalinger</TabsTrigger>
          <TabsTrigger value="klarna">Klarna</TabsTrigger>
          <TabsTrigger value="refunds">Refusjoner</TabsTrigger>
          <TabsTrigger value="fiken">Fiken Regnskap</TabsTrigger>
          <TabsTrigger value="stripe">Stripe Konto</TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Betalingsoppsett for Arrangementer
              </CardTitle>
              <CardDescription>
                Slik setter du opp betalinger for dine arrangementer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Viktig før du starter</AlertTitle>
                <AlertDescription>
                  Du må ha en tilkoblet Stripe-konto før du kan opprette betalings-events.
                  Gå til &quot;Stripe Konto&quot; fanen for å se hvordan.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">1. Aktiver betalinger på eventet</h3>
                  <p className="text-gray-600 mb-3">
                    Når du oppretter eller redigerer et arrangement:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                    <li>Sett en pris per billett</li>
                    <li>Velg betalingsvaluta (NOK, EUR, USD)</li>
                    <li>Angi antall billetter tilgjengelig</li>
                    <li>Legg til refusjonspolicy</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">2. Betalingsmetoder tilgjengelig</h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Card className="border-blue-200">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CreditCard className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">Kortbetaling</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Visa, Mastercard, American Express. Alltid tilgjengelig.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-green-200">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-4 h-4 text-green-600" />
                          <span className="font-medium">Klarna Faktura</span>
                          <Badge variant="outline" className="text-xs">Valgfritt</Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          30 dager betalingsfrist for bedrifter. Krever aktivering.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">3. Gebyrer</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Stripe gebyr:</span>
                        <span>2.9% + 30 øre per transaksjon</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Klarna gebyr:</span>
                        <span>2.9% + 2.90 kr per transaksjon</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Arrango plattform:</span>
                        <span>1% av billettprisen</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      * Gebyrer kan variere. Se Stripe og Klarna for siste priser.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="klarna" className="space-y-6">
          <Alert className="border-blue-200 bg-blue-50">
            <HelpCircle className="h-4 w-4" />
            <AlertTitle>Klarna - Fleksible Betalingsalternativer</AlertTitle>
            <AlertDescription>
              Klarna tilbyr flere betalingsmetoder som Pay in full, Pay later (30 dager), Pay in 3 eller Pay in 4.
              Automatisk tilgjengelig basert på kundens land og kjøpsbeløp.
            </AlertDescription>
          </Alert>


          <Card>
            <CardHeader>
              <CardTitle>Hvordan aktivere Klarna?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Kontakt Arrango Support</h4>
                    <p className="text-sm text-gray-600">
                      Klarna må aktiveres på plattform-nivå først. Send oss en e-post for å få dette aktivert.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">Godkjenn compliance-krav</h4>
                    <p className="text-sm text-gray-600">
                      Når Klarna er aktivert på plattformen, må du gå gjennom obligatorisk compliance-prosess for hvert arrangement.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Aktiver per arrangement</h4>
                    <p className="text-sm text-gray-600">
                      I arrangementsoppsett kan du velge å tilby Klarna faktura som betalingsalternativ.
                    </p>
                  </div>
                </div>
              </div>

              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Fordeler:</strong> Klarna øker konverteringsraten med opptil 40% ved å tilby fleksible betalingsalternativer.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="refunds" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Refusjonsregler og Transaksjonsutgifter
              </CardTitle>
              <CardDescription>
                Hvordan refusjoner fungerer og hva du må betale i gebyrer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Viktig: Sett en klar refusjonspolicy!</AlertTitle>
                <AlertDescription>
                  Alle arrangementer bør ha en tydelig refusjonspolicy. Dette er spesielt viktig når du bruker Klarna,
                  da dette påvirker hvilke betalingsalternativer som er tilgjengelige.
                </AlertDescription>
              </Alert>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Kortbetalinger (Visa/Mastercard)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h4 className="font-medium">Transaksjonsgebyr:</h4>
                      <p className="text-sm text-gray-600">1% + 2.9% av kjøpsbeløpet</p>
                      <p className="text-xs text-gray-500">Du betaler 3.9% totalt per transaksjon</p>
                    </div>

                    <div>
                      <h4 className="font-medium">Refusjon:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Full refusjon mulig opp til 180 dager</li>
                        <li>• Gebyr refunderes ikke til kunde</li>
                        <li>• Pengene tilbakeføres til kortet</li>
                      </ul>
                    </div>

                    <div className="bg-blue-50 p-3 rounded">
                      <h4 className="font-medium text-blue-900">Eksempel:</h4>
                      <p className="text-sm text-blue-800">
                        Ved 100 kr billett: Du tjener 96.10 kr<br/>
                        Ved refusjon: Kunden får 100 kr, du mister 3.90 kr
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-green-200">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Klarna Betalinger
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h4 className="font-medium">Transaksjonsgebyr:</h4>
                      <p className="text-sm text-gray-600">1% + variable Klarna-gebyr</p>
                      <p className="text-xs text-gray-500">Totalt 1% + 1-3% avhengig av metode</p>
                    </div>

                    <div>
                      <h4 className="font-medium">Refusjon:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Full refusjon mulig opp til 180 dager</li>
                        <li>• Klarna håndterer kundekommunikasjon</li>
                        <li>• Du får pengene tilbake (minus gebyrer)</li>
                        <li>• Krever refusjonspolicy</li>
                      </ul>
                    </div>

                    <div className="bg-green-50 p-3 rounded">
                      <h4 className="font-medium text-green-900">Eksempel:</h4>
                      <p className="text-sm text-green-800">
                        Ved 100 kr billett: Du tjener 97-98 kr<br/>
                        Ved refusjon: Du får pengene tilbake, mister kun gebyret
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-amber-200">
                <CardHeader>
                  <CardTitle className="text-lg text-amber-800">Refusjonsregler du må sette</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium">Obligatoriske elementer:</h4>
                      <ul className="text-sm text-gray-600 space-y-1 ml-4">
                        <li>• Hvor lenge kan kunder få refusjon?</li>
                        <li>• Hvilke vilkår gjelder? (sykdom, force majeure, etc.)</li>
                        <li>• Hvordan behandles delvise refusjoner?</li>
                        <li>• Kontaktinformasjon for refusjonsforespørsler</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium">Eksempel på refusjonspolicy:</h4>
                      <div className="bg-gray-50 p-3 rounded text-sm">
                        <p>&quot;Full refusjon gis ved avlysning av arrangementet. Refusjon kan gis opp til 24 timer før arrangementsstart ved sykdom eller force majeure. Ved deltakelse refunderes ikke billetten.&quot;</p>
                      </div>
                    </div>

                    <Alert className="border-red-200 bg-red-50">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Lovpålagt:</strong> Du må ha refusjonspolicy for å bruke Klarna betalingsalternativer.
                        Dette er forbrukerbeskyttelse og kreves av norsk lov.
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Økonomiske konsekvenser</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-green-700">Fordeler med Klarna:</h4>
                      <ul className="text-sm space-y-1">
                        <li>• +40% høyere konverteringsrate</li>
                        <li>• Kunder betaler deg umiddelbart</li>
                        <li>• Klarna tar kredittrisiko</li>
                        <li>• Fleksible betalingsalternativer</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-blue-700">Stripe gebyrer:</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Kort: 3.9% + 2.5 kr per transaksjon</li>
                        <li>• Klarna: 1% + Klarna-gebyr</li>
                        <li>• Internasjonalt: Høyere gebyrer</li>
                        <li>• Refusjon: Du mister gebyret</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fiken" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Fiken Regnskapsintegrasjon
              </CardTitle>
              <CardDescription>
                Automatiser regnskapet ditt med Fiken API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Fiken integrasjonen lager automatisk fakturaer og kunder når betalinger mottas.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">1. Få Fiken API-token</h3>
                  <p className="text-gray-600 mb-3">
                    Logg inn på Fiken.no og opprett en API-token:
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-gray-600 ml-4">
                    <li>Gå til Innstillinger → Utviklere</li>
                    <li>Klikk &quot;Opprett ny API-token&quot;</li>
                    <li>Gi tokenet et beskrivende navn</li>
                    <li>Kopier tokenet (du ser det kun én gang!)</li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">2. Finn bedriftens slug</h3>
                  <p className="text-gray-600 mb-3">
                    Dette finnes i Fiken URL-en når du er logget inn:
                  </p>
                  <div className="bg-gray-50 p-3 rounded font-mono text-sm">
                    https://app.fiken.no/bedrifter/<strong>[DITT-SLUG]</strong>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Eksempel: &quot;mitt-arrangement-as&quot; eller &quot;firma-navn&quot;
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">3. Koble til i Arrango</h3>
                  <p className="text-gray-600 mb-3">
                    Gå til Innstillinger → Fiken og fyll inn:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                    <li>Bedrift slug (fra URL)</li>
                    <li>API token (fra utvikler-innstillinger)</li>
                    <li>Test tilkoblingen</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">4. Hva skjer automatisk?</h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Card>
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="font-medium">Kunder opprettes</span>
                        </div>
                        <p className="text-xs text-gray-600">
                          Nye kunder legges automatisk til i Fiken
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="font-medium">Fakturaer sendes</span>
                        </div>
                        <p className="text-xs text-gray-600">
                          Fakturaer opprettes for alle betalinger
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">5. Eksporter regnskapsdata</h3>
                  <p className="text-gray-600 mb-3">
                    Last ned CSV-filer for regnskapsfører:
                  </p>
                  <Link href="/seller">
                    <Button variant="outline">
                      Gå til Dashboard for eksport
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stripe" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Stripe Connect Kontooppsett
              </CardTitle>
              <CardDescription>
                Obligatorisk for å kunne motta betalinger på arrangementer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Obligatorisk steg</AlertTitle>
                <AlertDescription>
                  Du må ha en tilkoblet Stripe-konto før du kan opprette betalings-events.
                  Dette tar ca 10-15 minutter.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">1. Start tilkoblingsprosessen</h3>
                  <p className="text-gray-600 mb-3">
                    I Arrango seller-dashboard:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                    <li>Klikk på &quot;Koble til Stripe&quot; knappen</li>
                    <li>Du blir sendt til Stripe sin sikre side</li>
                    <li>Logg inn eller opprett Stripe-konto</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">2. Velg kontotype</h3>
                  <p className="text-gray-600 mb-3">
                    Stripe tilbyr flere kontotyper:
                  </p>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Card className="border-blue-200">
                      <CardContent className="p-4">
                        <div className="font-medium mb-2">Personlig konto</div>
                        <p className="text-sm text-gray-600">
                          For enkeltpersoner eller små bedrifter. Enkel oppsett.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-green-200">
                      <CardContent className="p-4">
                        <div className="font-medium mb-2">Bedriftskonto</div>
                        <p className="text-sm text-gray-600">
                          For større bedrifter. Krever mer dokumentasjon.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">3. Fyll inn bedriftsinformasjon</h3>
                  <p className="text-gray-600 mb-3">
                    Stripe trenger følgende informasjon:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                    <li>Bedriftsnavn og adresse</li>
                    <li>Organisasjonsnummer (hvis bedrift)</li>
                    <li>Bankkontonummer for utbetalinger</li>
                    <li>Identifikasjon (pass eller førerkort)</li>
                    <li>Skatteinformasjon</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">4. Verifisering og aktivering</h3>
                  <p className="text-gray-600 mb-3">
                    Stripe gjennomgår søknaden din:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                    <li>Automatisk godkjenning (oftest innen timer)</li>
                    <li>Manuell gjennomgang (kan ta 1-2 dager)</li>
                    <li>Du får e-post når kontoen er klar</li>
                    <li>Deretter kan du opprette betalings-events</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">5. Test betalinger</h3>
                  <p className="text-gray-600 mb-3">
                    Stripe har test-modus for å teste betalinger:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                    <li>Bruk test-kortnummer: 4242 4242 4242 4242</li>
                    <li>Alle utbetalinger går til test-konto</li>
                    <li>Perfekt for å teste arrangementsflyten</li>
                  </ul>
                </div>
              </div>

              <Alert>
                <ExternalLink className="h-4 w-4" />
                <AlertDescription>
                  <strong>Trenger hjelp?</strong> Stripe har utmerket dokumentasjon på{" "}
                  <a
                    href="https://stripe.com/docs/connect"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    stripe.com/docs/connect
                  </a>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Admin kontroll - ligger på egen admin-side */}
      <div className="mt-12 pt-8 border-t">
        <Alert>
          <Settings className="h-4 w-4" />
          <AlertTitle>Admin-innstillinger</AlertTitle>
          <AlertDescription>
            Plattform-administrasjon som Klarna aktivering ligger på en egen admin-side for sikkerhetsgrunner.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
