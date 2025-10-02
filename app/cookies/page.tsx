import type { Metadata } from "next";
import CookiesPageClient from "./CookiesPageClient";

export const metadata: Metadata = {
  title: "Cookiepolicy | Arrango",
  description: "Les vår cookiepolicy for å forstå hvordan vi bruker cookies og lignende teknologier på vår plattform.",
  keywords: [
    "cookies",
    "cookiepolicy",
    "personvern",
    "sporing",
    "nettanalyse",
    "databeskyttelse"
  ],
  openGraph: {
    title: "Cookiepolicy - Arrango",
    description: "Les vår cookiepolicy for å forstå hvordan vi bruker cookies og lignende teknologier.",
    type: "website",
    url: "https://arrango.no/cookies",
  },
  twitter: {
    card: "summary",
    title: "Cookiepolicy - Arrango",
    description: "Les vår cookiepolicy for å forstå hvordan vi bruker cookies og lignende teknologier.",
  },
  alternates: {
    canonical: "https://arrango.no/cookies",
  },
};

function CookiesPageContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Cookiepolicy</h1>
            <CookiesPageClient />
          </div>

          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-6">
              Sist oppdatert: {new Date().toLocaleDateString('nb-NO')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Hva er cookies?</h2>
              <p className="text-gray-700 mb-4">
                Cookies er små tekstfiler som lagres på din enhet når du besøker et nettsted.
                De brukes til å huske dine preferanser, forbedre brukeropplevelsen og analysere trafikk.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Typer cookies vi bruker</h2>

              <h3 className="text-xl font-medium text-gray-900 mb-3">2.1 Nødvendige cookies</h3>
              <p className="text-gray-700 mb-4">
                Disse cookiene er essensielle for at nettstedet skal fungere ordentlig.
                De gjør det mulig å navigere på siden og bruke dens funksjoner.
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                <li>Sesjonshåndtering</li>
                <li>Autentisering</li>
                <li>Sikkerhet</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 mb-3">2.2 Funksjonalitets-cookies</h3>
              <p className="text-gray-700 mb-4">
                Disse cookiene husker dine valg og preferanser for å gi deg en personlig tilpasset opplevelse.
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                <li>Språkinnstillinger</li>
                <li>Stedsinformasjon</li>
                <li>Tilpassede søkeresultater</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 mb-3">2.3 Analyse-cookies</h3>
              <p className="text-gray-700 mb-4">
                Disse cookiene hjelper oss å forstå hvordan besøkende bruker nettstedet,
                slik at vi kan forbedre funksjonalitet og brukeropplevelse.
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                <li>Google Analytics</li>
                <li>Bruksmønstre</li>
                <li>Ytelse og feil</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 mb-3">2.3 Markedsførings-cookies</h3>
              <p className="text-gray-700 mb-4">
                Disse cookiene brukes til å spore besøkende på tvers av nettsteder for å vise relevante annonser.
                Vi bruker ikke markedsførings-cookies på vår plattform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Tredjeparts-cookies</h2>
              <h3 className="text-xl font-medium text-gray-900 mb-3">3.1 Clerk (Autentisering)</h3>
              <p className="text-gray-700 mb-4">
                Vi bruker Clerk for brukerautentisering. Clerk kan sette cookies for å håndtere innlogging og sesjoner.
                Les deres <a href="https://clerk.com/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">personvernerklæring</a> for mer informasjon.
              </p>

              <h3 className="text-xl font-medium text-gray-900 mb-3">3.2 Stripe (Betalinger)</h3>
              <p className="text-gray-700 mb-4">
                Når du foretar betalinger, setter Stripe cookies for å sikre trygge transaksjoner.
                Les deres <a href="https://stripe.com/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">personvernerklæring</a> for mer informasjon.
              </p>

              <h3 className="text-xl font-medium text-gray-900 mb-3">3.3 Convex (Database)</h3>
              <p className="text-gray-700 mb-4">
                Vi bruker Convex som vår backend-tjeneste. De kan sette cookies for ytelse og sikkerhet.
                Les deres <a href="https://convex.dev/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">personvernerklæring</a> for mer informasjon.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Hvor lenge lagres cookies?</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Sesjon-cookies:</strong> Slettes når du lukker nettleseren</li>
                <li><strong>Varige cookies:</strong> Kan lagres i opptil 2 år, avhengig av formålet</li>
                <li><strong>Autentiserings-cookies:</strong> Varer vanligvis i 30 dager</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Hvordan administrere cookies</h2>

              <h3 className="text-xl font-medium text-gray-900 mb-3">5.1 Nettleserinnstillinger</h3>
              <p className="text-gray-700 mb-4">
                De fleste nettlesere lar deg administrere cookies gjennom innstillingene:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                <li><strong>Chrome:</strong> Innstillinger → Personvern og sikkerhet → Cookies</li>
                <li><strong>Firefox:</strong> Innstillinger → Personvern og sikkerhet → Cookies</li>
                <li><strong>Safari:</strong> Innstillinger → Personvern → Administrer nettsteddata</li>
                <li><strong>Edge:</strong> Innstillinger → Cookies og nettstedstillatelser</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 mb-3">5.2 Vår cookie-banner</h3>
              <p className="text-gray-700 mb-4">
                Når du besøker nettstedet vårt første gang, vil du se en cookie-banner som lar deg velge hvilke typer cookies du vil godta.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-blue-800 font-medium">Merk:</p>
                <p className="text-blue-700">
                  Hvis du deaktiverer nødvendige cookies, kan det påvirke funksjonaliteten på nettstedet.
                  Noen funksjoner kan slutte å fungere som forventet.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Endringer i cookiepolicy</h2>
              <p className="text-gray-700 mb-4">
                Vi kan oppdatere denne cookiepolicyen når som helst. Vesentlige endringer vil bli kommunisert tydelig.
                Fortsatt bruk av tjenesten etter endringer betyr at du godtar den oppdaterte policyen.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Kontakt oss</h2>
              <p className="text-gray-700">
                Hvis du har spørsmål om vår bruk av cookies, kan du kontakte oss på{" "}
                <a href="mailto:privacy@arrango.no" className="text-blue-600 hover:underline">
                  privacy@arrango.no
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CookiesPage() {
  return <CookiesPageContent />;
}
