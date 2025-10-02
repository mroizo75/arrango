'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Ticket, CreditCard, TrendingUp, Users, Calendar, Zap } from "lucide-react";
import Link from "next/link";
import EventList from "./EventList";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">
              🎉 Gratis første arrangement!
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Superenkelt billettsalg for
              <span className="text-blue-600 block">dine arrangementer</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Med Arrango får du alt du trenger for å selge billetter på nett.
              Registrer deg gratis og kom i gang med ditt første arrangement i dag.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/organizer">
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
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full opacity-20"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full opacity-20"></div>
        </div>
      </section>

      {/* How it works */}
      <section id="features" className="py-20 bg-white">
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
            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">1. Lag arrangement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Fortell oss om arrangementet ditt - navn, dato, sted og kapasitet.
                  Vi oppretter en profesjonell salgsside på få minutter.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Ticket className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">2. Selg billetter</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Del linken til salgssiden din på sosiale medier, e-post eller nettsiden.
                  Kunder kjøper enkelt billetter med kort, Klarna eller Swish.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">3. Få pengene</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Pengene utbetales automatisk til din konto etter arrangementet.
                  Du får også komplett regnskapsdokumentasjon.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Funksjoner for arrangører
            </h2>
            <p className="text-lg text-gray-600">
              Alt du trenger for vellykket billettsalget
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Users, title: "Ubegrenset kapasitet", desc: "Håndter arrangementer fra 10 til 10.000 deltagere" },
              { icon: CreditCard, title: "Flere betalingsmetoder", desc: "Kort, Klarna, Swish og faktura" },
              { icon: TrendingUp, title: "Sanntids statistikk", desc: "Følg med på salg og inntekter i dashboard" },
              { icon: Ticket, title: "QR-kode scanning", desc: "Enkel innsjekking ved arrangementet" },
              { icon: Zap, title: "Automatiske e-poster", desc: "Billetter sendes automatisk til kjøpere" },
              { icon: CheckCircle, title: "Refundering", desc: "Enkel håndtering av kanselleringer" },
            ].map((feature, index) => (
              <div key={index} className="flex items-start gap-4 p-6 bg-white rounded-lg shadow-sm">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Priser
          </h2>
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <Badge className="w-fit mx-auto mb-4 bg-green-100 text-green-800">Gratis å komme i gang</Badge>
              <CardTitle className="text-2xl">Første arrangement gratis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-4xl font-bold text-gray-900">0 kr</div>
              <p className="text-gray-600">for ditt første arrangement</p>
              <div className="space-y-2 text-left max-w-sm mx-auto">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Ubegrenset billettyper</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>QR-kode innsjekking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>E-post bekreftelser</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>24/7 support</span>
                </div>
              </div>
              <div className="pt-4">
                <p className="text-sm text-gray-500 mb-4">
                  Deretter en liten billettavgift på hver solgte billett
                </p>
                <Link href="/organizer">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                    Start gratis nå
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Kommende arrangementer
            </h2>
            <p className="text-lg text-gray-600">
              Se hva som skjer og kjøp billetter til de beste arrangementene
            </p>
          </div>
          <EventList />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Klar for å selge billetter?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Registrer deg gratis og opprett ditt første arrangement på få minutter.
          </p>
          <Link href="/organizer">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg">
              Kom i gang gratis →
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
