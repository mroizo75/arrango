import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Personvernerklæring | Arrango",
  description: "Les vår personvernerklæring for å forstå hvordan vi samler inn, bruker og beskytter dine personopplysninger.",
  keywords: [
    "personvern",
    "personvernerklæring",
    "GDPR",
    "personopplysninger",
    "databeskyttelse",
    "cookies",
    "personvernpolicy"
  ],
  openGraph: {
    title: "Personvernerklæring - Arrango",
    description: "Les vår personvernerklæring for å forstå hvordan vi samler inn, bruker og beskytter dine personopplysninger.",
    type: "website",
    url: "https://arrango.no/privacy",
  },
  twitter: {
    card: "summary",
    title: "Personvernerklæring - Arrango",
    description: "Les vår personvernerklæring for å forstå hvordan vi samler inn, bruker og beskytter dine personopplysninger.",
  },
  alternates: {
    canonical: "https://arrango.no/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Personvernerklæring</h1>

          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-6">
              Sist oppdatert: {new Date().toLocaleDateString('nb-NO')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Innledning</h2>
              <p className="text-gray-700 mb-4">
                Arrango (&quot;vi&quot;, &quot;oss&quot; eller &quot;vår&quot;) respekterer ditt personvern og er forpliktet til å beskytte dine personopplysninger.
                Denne personvernerklæringen forklarer hvordan vi samler inn, bruker, deler og beskytter dine opplysninger når du bruker vår plattform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Opplysninger vi samler inn</h2>
              <h3 className="text-xl font-medium text-gray-900 mb-3">2.1 Personopplysninger du gir oss</h3>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Navn og kontaktinformasjon (e-post, telefon)</li>
                <li>Bruker-ID og autentiseringsdata fra Clerk</li>
                <li>Organisasjonsnummer (for bedrifter)</li>
                <li>Betalingsinformasjon (behandlet av Stripe)</li>
                <li>Innhold du lager (arrangementbeskrivelser, bilder)</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 mb-3">2.2 Automatisk innsamlede opplysninger</h3>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>IP-adresse og enhetsinformasjon</li>
                <li>Brukeragent og nettleserinformasjon</li>
                <li>Bruksmønstre og interaksjoner på plattformen</li>
                <li>Cookies og lignende teknologier</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Hvordan vi bruker dine opplysninger</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>For å levere og forbedre våre tjenester</li>
                <li>For å behandle betalinger og utbetalinger</li>
                <li>For å kommunisere med deg om din konto og arrangementer</li>
                <li>For å oppfylle juridiske forpliktelser</li>
                <li>For å forhindre svindel og misbruk</li>
                <li>For å analysere og forbedre brukeropplevelsen</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Deling av opplysninger</h2>
              <p className="text-gray-700 mb-4">
                Vi deler ikke dine personopplysninger med tredjeparter, unntatt i følgende tilfeller:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Tjenesteleverandører:</strong> Stripe for betalingsbehandling, Clerk for autentisering</li>
                <li><strong>Juridiske krav:</strong> Når det kreves ved lov eller rettslig kjennelse</li>
                <li><strong>Offentlige opplysninger:</strong> Arrangementinformasjon som du velger å publisere</li>
                <li><strong>Med ditt samtykke:</strong> Når du eksplisitt godkjenner det</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Databehandling og lagring</h2>
              <p className="text-gray-700 mb-4">
                Vi bruker Convex som vår primære database og følger deres sikkerhetsstandarder.
                Betalingsinformasjon behandles utelukkende av Stripe og lagres ikke på våre servere.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Dine rettigheter</h2>
              <p className="text-gray-700 mb-4">
                I henhold til GDPR har du følgende rettigheter:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Rett til innsyn:</strong> Be om kopi av dine personopplysninger</li>
                <li><strong>Rett til retting:</strong> Be om korrigering av uriktige opplysninger</li>
                <li><strong>Rett til sletting:</strong> Be om sletting av dine opplysninger</li>
                <li><strong>Rett til begrensning:</strong> Be om begrensning av behandlingen</li>
                <li><strong>Rett til dataportabilitet:</strong> Få utlevert dine data i et strukturert format</li>
                <li><strong>Rett til å protestere:</strong> Protestere mot behandlingen av personopplysninger</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Kontakt oss</h2>
              <p className="text-gray-700">
                Hvis du har spørsmål om denne personvernerklæringen eller ønsker å utøve dine rettigheter,
                kan du kontakte oss på <a href="mailto:privacy@arrango.no" className="text-blue-600 hover:underline">privacy@arrango.no</a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
