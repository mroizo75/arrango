'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Ticket, CreditCard, TrendingUp, Users, Zap, Star, Award, Shield } from "lucide-react";
import Link from "next/link";

export default function ArrangorerPage() {
  // Check if user is authenticated and redirect to sign in if not
  // This is handled by Clerk middleware, but we can add additional logic here

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Arrango
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/seller">
                <Button variant="outline">Logg inn som arrangør</Button>
              </Link>
              <Link href="/seller/new-event">
                <Button className="bg-blue-600 hover:bg-blue-700">Lag arrangement</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-100">
                🎉 Første arrangement gratis!
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Superenkelt billettsalg for
                <span className="text-blue-600 block">små og store arrangører</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Med Arrango får du alt du trenger for å selge billetter på nett.
                Registrer deg gratis og kom i gang med ditt første arrangement i dag.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/seller/new-event">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                    Kom i gang gratis →
                  </Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
                    Se funksjoner
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 shadow-xl">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Ticket className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Konsert: Sommerfestival 2025</h3>
                      <p className="text-sm text-gray-600">250 billetter solgt • 45.000 kr</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Realtids statistikk</h3>
                      <p className="text-sm text-gray-600">Følg med på salg og inntekter</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Automatiske e-poster</h3>
                      <p className="text-sm text-gray-600">Billetter sendes automatisk</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Arrangementer opprettet</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">25.000+</div>
              <div className="text-gray-600">Billetter solgt</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">98%</div>
              <div className="text-gray-600">Kundetilfredshet</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Slik fungerer det
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Tre enkle steg for å komme i gang med billettsalget
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <CardTitle className="text-xl">Registrer deg gratis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Opprett en gratis arrangør-konto på få minutter.
                  Ingen bindingstid eller skjulte kostnader.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <CardTitle className="text-xl">Opprett arrangement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Legg inn detaljer om arrangementet ditt - dato, sted, kapasitet og billettpriser.
                  Vi lager en profesjonell salgsside automatisk.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <CardTitle className="text-xl">Selg og tjén</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Del linken til salgssiden og følg med på sanntids statistikk.
                  Pengene utbetales automatisk etter arrangementet.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Alt du trenger for vellykket billettsalget
            </h2>
            <p className="text-lg text-gray-600">
              Profesjonelle verktøy designet spesielt for norske arrangører
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Ticket,
                title: "Fleksible billettyper",
                desc: "Vanlig, VIP, tidlig fugl, grupperabatter og mer",
                color: "blue"
              },
              {
                icon: CreditCard,
                title: "Sikre betalinger",
                desc: "Stripe, Klarna og Swish med PCI compliance",
                color: "green"
              },
              {
                icon: Users,
                title: "Kø-system",
                desc: "Automatisk håndtering når arrangementet blir fullt",
                color: "purple"
              },
              {
                icon: TrendingUp,
                title: "Detaljert statistikk",
                desc: "Salg, inntekter og kundeanalyse i sanntid",
                color: "orange"
              },
              {
                icon: Zap,
                title: "Automatisering",
                desc: "E-post bekreftelser, påminnelser og oppfølging",
                color: "red"
              },
              {
                icon: Shield,
                title: "Sikkerhet",
                desc: "GDPR compliant med norsk personvern",
                color: "gray"
              },
              {
                icon: Zap,
                title: "Regnskapsintegrasjon",
                desc: "Automatisk fakturering med Fiken API",
                color: "red"
              },
            ].map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className={`w-12 h-12 bg-${feature.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                    <feature.icon className={`w-6 h-6 text-${feature.color}-600`} />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Hva arrangørene våre sier
            </h2>
            <p className="text-lg text-gray-600">
              Over 500 arrangører stoler på Arrango
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  &quot;Arrango gjorde det så enkelt å selge billetter til vår konsert. Alt fungerte perfekt og vi fikk pengene raskt etter arrangementet.&quot;
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-semibold text-blue-600">MJ</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Maria Johansen</div>
                    <div className="text-sm text-gray-600">Musikkfestival arrangør</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  &quot;Supporten er fantastisk og systemet er veldig brukervennlig. Vi har solgt over 2000 billetter gjennom Arrango.&quot;
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-semibold text-green-600">ON</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Ole Nordmann</div>
                    <div className="text-sm text-gray-600">Idrettsklubb leder</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  &quot;Fra første arrangement til nå har vi spart masse tid og penger på å bruke Arrango istedenfor å gjøre alt manuelt.&quot;
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-semibold text-purple-600">KS</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Kari Svensen</div>
                    <div className="text-sm text-gray-600">Teater arrangør</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Enkelt og rimelig
            </h2>
            <p className="text-lg text-gray-600">
              Start gratis og betal kun en liten avgift per solgte billett
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-2 border-blue-200 shadow-xl relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-600 text-white px-4 py-1">Mest populær</Badge>
              </div>
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl">Første arrangement</CardTitle>
                <div className="text-4xl font-bold text-blue-600 mt-4">Gratis</div>
                <p className="text-gray-600 mt-2">Ingen skjulte kostnader</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Ubegrenset billettyper</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>QR-kode innsjekking</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>E-post bekreftelser</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>24/7 norsk support</span>
                  </div>
                </div>
                <Link href="/seller/new-event" className="w-full">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-6">
                    Start gratis nå
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl">Deretter</CardTitle>
                <div className="text-2xl font-bold text-gray-900 mt-4">Liten billettavgift</div>
                <p className="text-gray-600 mt-2">Kun på betalte billetter</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Samme funksjoner</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Raske utbetalinger</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Regnskapsdokumentasjon</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Prioritert support</span>
                  </div>
                </div>
                <div className="text-center text-sm text-gray-500 mt-6 p-3 bg-gray-50 rounded-lg">
                  Du betaler kun når du tjener penger
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ofte stilte spørsmål
            </h2>
            <p className="text-lg text-gray-600">
              Svar på de vanligste spørsmålene fra arrangører
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "Må jeg betale noe for å komme i gang?",
                a: "Nei, ditt første arrangement er helt gratis. Du betaler kun en liten avgift på hver solgte billett etter det."
              },
              {
                q: "Hvor lang tid tar det å sette opp et arrangement?",
                a: "Vanligvis 5-10 minutter. Du fyller ut et enkelt skjema med arrangementdetaljer, og vi lager resten automatisk."
              },
              {
                q: "Kan jeg selge billetter til forskjellige priser?",
                a: "Ja, du kan opprette ubegrenset antall billettyper med forskjellige priser og fordeler (VIP, tidlig fugl, etc.)."
              },
              {
                q: "Hvordan fungerer utbetalingene?",
                a: "Pengene utbetales automatisk til din bankkonto etter endt arrangement. Du kan også få løpende utbetalinger ved behov."
              },
              {
                q: "Får jeg hjelp hvis noe går galt?",
                a: "Ja, vi har norsk support som hjelper deg 24/7. Ingen spørsmål er for dumme!"
              }
            ].map((faq, index) => (
              <Card key={index} className="border-0 shadow-sm">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-gray-600">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Award className="w-16 h-16 mx-auto mb-6 text-yellow-300" />
          <h2 className="text-3xl font-bold mb-4">
            Bli en av våre mange fornøyde arrangører
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Registrer deg gratis og opprett ditt første arrangement på få minutter.
            Ingen risiko, ingen bindingstid.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/seller/new-event">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg">
                Start gratis nå →
              </Button>
            </Link>
            <Link href="mailto:support@arrango.no">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg">
                Kontakt oss
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
