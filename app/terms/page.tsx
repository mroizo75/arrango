import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brukervilkår | Arrango",
  description: "Les våre brukervilkår og vilkår for bruk av Arrango-plattformen.",
  keywords: [
    "brukervilkår",
    "vilkår",
    "terms of service",
    "tjenestevilkår",
    "brukeravtale",
    "rettigheter",
    "plikter"
  ],
  openGraph: {
    title: "Brukervilkår - Arrango",
    description: "Les våre brukervilkår og vilkår for bruk av Arrango-plattformen.",
    type: "website",
    url: "https://arrango.no/terms",
  },
  twitter: {
    card: "summary",
    title: "Brukervilkår - Arrango",
    description: "Les våre brukervilkår og vilkår for bruk av Arrango-plattformen.",
  },
  alternates: {
    canonical: "https://arrango.no/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Brukervilkår</h1>

          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-6">
              Sist oppdatert: {new Date().toLocaleDateString('nb-NO')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Aksept av vilkår</h2>
              <p className="text-gray-700 mb-4">
                Ved å bruke Arrango-plattformen (&quot;Tjenesten&quot;) godtar du å være bundet av disse brukervilkårene (&quot;Vilkår&quot;).
                Hvis du ikke godtar disse vilkårene, må du ikke bruke tjenesten.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Beskrivelse av tjenesten</h2>
              <p className="text-gray-700 mb-4">
                Arrango er en plattform som gjør det mulig for arrangører å selge billetter til arrangementer og for kjøpere å kjøpe disse billettene.
                Vi tilbyr også verktøy for arrangementsadministrasjon og betalingsbehandling.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Brukerregistrering og konto</h2>
              <h3 className="text-xl font-medium text-gray-900 mb-3">3.1 Registrering</h3>
              <p className="text-gray-700 mb-4">
                For å bruke visse deler av tjenesten må du registrere en konto. Du må oppgi nøyaktig og fullstendig informasjon under registreringen.
              </p>

              <h3 className="text-xl font-medium text-gray-900 mb-3">3.2 Kontoansvar</h3>
              <p className="text-gray-700 mb-4">
                Du er ansvarlig for å holde din kontoinformasjon konfidensiell og for all aktivitet som skjer under din konto.
                Du må varsle oss umiddelbart om uautorisert bruk av din konto.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Arrangørers plikter</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Oppgi nøyaktig informasjon om arrangementer</li>
                <li>Respektere opphavsrettigheter og immaterielle rettigheter</li>
                <li>Overholde alle relevante lover og forskrifter</li>
                <li>Behandle billettkjøperes personopplysninger i henhold til personvernlovgivningen</li>
                <li>Levere arrangementer som beskrevet eller tilby refusjon</li>
                <li>Betale eventuelle gebyrer til plattformen</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Kjøperes rettigheter</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Få nøyaktig informasjon om arrangementer før kjøp</li>
                <li>Motta bekreftelse på kjøp</li>
                <li>Få refusjon i henhold til arrangørens refusjonspolitikk</li>
                <li>Få tilgang til arrangementet som beskrevet</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Betalinger og gebyrer</h2>
              <h3 className="text-xl font-medium text-gray-900 mb-3">6.1 Betalingsbehandling</h3>
              <p className="text-gray-700 mb-4">
                Alle betalinger behandles av Stripe. Vi lagrer ikke betalingskortinformasjon på våre servere.
              </p>

              <h3 className="text-xl font-medium text-gray-900 mb-3">6.2 Gebyrer</h3>
              <p className="text-gray-700 mb-4">
                Vi kan kreve gebyrer for bruk av plattformen. Gjeldende gebyrer vil være tydelig oppgitt før kjøp eller registrering.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Avbestilling og refusjon</h2>
              <p className="text-gray-700 mb-4">
                Refusjonspolitikken bestemmes av arrangøren og vil være tydelig oppgitt for hvert arrangement.
                Vi formidler kun refusjoner i henhold til arrangørens politikk.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Forbudt oppførsel</h2>
              <p className="text-gray-700 mb-4">
                Du må ikke:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Bruke tjenesten til ulovlige formål</li>
                <li>Laste opp skadelig programvare eller innhold</li>
                <li>Krenke andres rettigheter</li>
                <li>Prøve å få uautorisert tilgang til systemet</li>
                <li>Distribuere spam eller uønsket innhold</li>
                <li>Bruke automatiserte verktøy for å skrape data</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Opphavsrett og immaterielle rettigheter</h2>
              <p className="text-gray-700 mb-4">
                Du beholder opphavsretten til innhold du laster opp. Ved å laste opp innhold gir du oss en lisens til å bruke det i forbindelse med tjenesten.
                Du må ikke laste opp innhold som krenker andres rettigheter.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Ansvarsfraskrivelse</h2>
              <p className="text-gray-700 mb-4">
                Tjenesten leveres &quot;som den er&quot; uten garantier. Vi er ikke ansvarlige for indirekte skader eller tap.
                Vi garanterer ikke at tjenesten alltid vil være tilgjengelig eller feilfri.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Oppsigelse</h2>
              <p className="text-gray-700 mb-4">
                Vi kan suspendere eller avslutte din tilgang til tjenesten hvis du bryter disse vilkårene.
                Du kan avslutte din konto når som helst.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Endringer av vilkår</h2>
              <p className="text-gray-700 mb-4">
                Vi kan endre disse vilkårene når som helst. Fortsatt bruk av tjenesten etter endringer betyr at du godtar de nye vilkårene.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Lovvalg og tvisteløsning</h2>
              <p className="text-gray-700 mb-4">
                Disse vilkårene reguleres av norsk rett. Eventuelle tvister skal løses gjennom de norske domstoler.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Kontaktinformasjon</h2>
              <p className="text-gray-700">
                Hvis du har spørsmål om disse vilkårene, kan du kontakte oss på{" "}
                <a href="mailto:legal@arrango.no" className="text-blue-600 hover:underline">
                  legal@arrango.no
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
