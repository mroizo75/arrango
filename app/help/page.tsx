import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  HelpCircle,
  Mail,
  Phone,
  CreditCard,
  FileText,
  Calculator,
  Users,
  Settings,
  ExternalLink,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Ofte stilte spørsmål
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Få svar på de vanligste spørsmålene om Arrango-plattformen
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-6 mb-12">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="what-is-arrango">
              <AccordionTrigger className="text-left">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-600" />
                  <span>Hva er Arrango?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-gray-700">
                <div className="space-y-3">
                  <p>
                    Arrango er en moderne plattform for arrangører som gjør det enkelt å selge billetter til arrangementer.
                    Vi håndterer alt fra betaling til billettadministrasjon, slik at du kan fokusere på å lage fantastiske opplevelser.
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Våre tjenester inkluderer:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Enkel billettsalg med integrerte betalingsløsninger</li>
                      <li>• Automatisk billettskanning og adgangskontroll</li>
                      <li>• Sanntids statistikk og rapportering</li>
                      <li>• Integrasjon med regnskapssystemer</li>
                      <li>• Profesjonell kundeservice</li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="how-to-buy">
              <AccordionTrigger className="text-left">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-green-600" />
                  <span>Hvordan kjøper jeg billetter?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-gray-700">
                <div className="space-y-3">
                  <p>Å kjøpe billetter på Arrango er enkelt og trygt:</p>
                  <ol className="list-decimal list-inside space-y-2 ml-4">
                    <li>Finn arrangementet du vil delta på</li>
                    <li>Velg antall billetter og eventuelle tilleggstjenester</li>
                    <li>Velg betalingsmetode (kort, Klarna, Vipps)</li>
                    <li>Fyll inn nødvendig informasjon</li>
                    <li>Motta billettene på e-post umiddelbart</li>
                  </ol>
                  <p className="text-sm text-green-700 bg-green-50 p-3 rounded-lg mt-3">
                    <strong>Trygt og sikkert:</strong> Alle betalinger behandles av Stripe med PCI DSS sertifisering.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="payment-methods">
              <AccordionTrigger className="text-left">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-orange-600" />
                  <span>Hvilke betalingsmetoder støttes?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-gray-700">
                <div className="space-y-4">
                  <p>Vi støtter flere sikre betalingsmetoder:</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Kortbetaling
                      </h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Visa, Mastercard, American Express</li>
                        <li>• Øyeblikkelig betaling</li>
                        <li>• Sikker 3D-verifisering</li>
                      </ul>
                    </div>
                    <div className="border border-green-200 rounded-lg p-4">
                      <h4 className="font-medium text-green-900 mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Klarna Faktura
                      </h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Betal senere (30 dager)</li>
                        <li>• Del opp betalingen</li>
                        <li>• Faktura sendes på e-post</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="refunds">
              <AccordionTrigger className="text-left">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span>Hvordan fungerer refusjoner?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-gray-700">
                <div className="space-y-3">
                  <p>Refusjonspolicy varierer etter arrangørens retningslinjer. Generelt:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Full refusjon ved avlysning av arrangement</li>
                    <li>Delvis refusjon ved sykdom eller force majeure</li>
                    <li>Ingen refusjon etter arrangementsstart</li>
                    <li>Refusjon behandles innen 5-10 arbeidsdager</li>
                  </ul>
                  <p className="text-sm text-gray-600">
                    Les alltid arrangørens spesifikke refusjonspolicy før kjøp.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="tickets">
              <AccordionTrigger className="text-left">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-teal-600" />
                  <span>Hvordan bruker jeg billettene mine?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-gray-700">
                <div className="space-y-3">
                  <p>Billettene mottar du på e-post umiddelbart etter kjøp:</p>
                  <ol className="list-decimal list-inside space-y-2 ml-4">
                    <li>Sjekk innboksen din (inkludert søppelpost)</li>
                    <li>Billetten inneholder QR-kode for skanning</li>
                    <li>Vis billetten på mobil eller print den ut</li>
                    <li>Skanneren ved inngangen validerer billetten</li>
                  </ol>
                  <div className="bg-amber-50 p-4 rounded-lg mt-3">
                    <h4 className="font-medium text-amber-900 mb-2">Tips:</h4>
                    <p className="text-sm text-amber-800">
                      Sørg for at batteriet på mobilen er ladet og at du har mobilt nettverk for å vise digitale billetter.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="organizer">
              <AccordionTrigger className="text-left">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-indigo-600" />
                  <span>Hvordan blir jeg arrangør?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-gray-700">
                <div className="space-y-3">
                  <p>Å bli arrangør på Arrango er enkelt:</p>
                  <ol className="list-decimal list-inside space-y-2 ml-4">
                    <li>Opprett en konto på plattformen</li>
                    <li>Verifiser deg som arrangør</li>
                    <li>Koble til betalingsløsning (Stripe)</li>
                    <li>Opprett ditt første arrangement</li>
                    <li>Del arrangementslenken med publikum</li>
                  </ol>
                  <p className="text-sm text-blue-700 bg-blue-50 p-3 rounded-lg mt-3">
                    <strong>Kontakt oss:</strong> Send en e-post til kai@kksas.no for å komme i gang som arrangør.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="technical-issues">
              <AccordionTrigger className="text-left">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-gray-600" />
                  <span>Problemer med billettkjøp eller tekniske issues?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-gray-700">
                <div className="space-y-3">
                  <p>Hvis du opplever problemer:</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Førstehjelp:</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Prøv å refreshe siden</li>
                        <li>• Slett cache/cookies</li>
                        <li>• Prøv en annen nettleser</li>
                        <li>• Sjekk internettforbindelsen</li>
                      </ul>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Kontakt oss:</h4>
                      <p className="text-sm">
                        Vi hjelper deg gjerne med tekniske problemer eller spørsmål om bestillinger.
                      </p>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Trenger du hjelp?</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Vi er her for å hjelpe deg med spørsmål om billettkjøp, arrangementer eller tekniske problemer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Button asChild variant="outline" className="flex items-center gap-2">
              <a href="mailto:kai@kksas.no">
                <Mail className="w-4 h-4" />
                Send e-post
              </a>
            </Button>
            <Button asChild variant="outline" className="flex items-center gap-2">
              <a href="tel:+4791540824">
                <Phone className="w-4 h-4" />
                Ring oss
              </a>
            </Button>
          </div>
          <div className="text-sm text-gray-500">
            <p>Vi svarer vanligvis innen 24 timer på hverdager.</p>
            <p className="mt-1">Nødtelefon: Tilgjengelig 24/7 for tekniske problemer under arrangementer.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-600">
            Arrango - Enklere billettsalg for bedre arrangementer
          </p>
        </div>
      </div>
    </div>
  );
}
