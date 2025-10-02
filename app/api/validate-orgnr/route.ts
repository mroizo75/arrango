import { NextRequest, NextResponse } from "next/server";

// Brønnøysundregistrene API for å validere organisasjonsnummer
const BRREG_API_URL = "https://data.brreg.no/enhetsregisteret/api/enheter";

interface BrregResponse {
  organisasjonsnummer: string;
  navn: string;
  organisasjonsform: {
    kode: string;
    beskrivelse: string;
  };
  registreringsdatoEnhetsregisteret: string;
  registrertIMvaregisteret: boolean;
  naeringskode1: {
    kode: string;
    beskrivelse: string;
  };
  forretningsadresse?: {
    land: string;
    landkode: string;
    postnummer: string;
    poststed: string;
    adresse: string[];
  };
  konkurs: boolean;
  underAvvikling: boolean;
  underTvangsavviklingEllerTvangsopplosning: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const { orgnr } = await request.json();

    if (!orgnr) {
      return NextResponse.json(
        { success: false, error: "Organisasjonsnummer mangler" },
        { status: 400 }
      );
    }

    // Rens organisasjonsnummer (fjern mellomrom og bindestreker)
    const cleanOrgnr = orgnr.replace(/[\s-]/g, '');

    // Valider format (9 siffer)
    if (!/^\d{9}$/.test(cleanOrgnr)) {
      return NextResponse.json({
        success: false,
        error: "Ugyldig format. Organisasjonsnummer må være 9 siffer",
        valid: false
      });
    }

    try {
      // Sjekk mot Brønnøysundregistrene API
      const response = await fetch(`${BRREG_API_URL}/${cleanOrgnr}`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.status === 404) {
        return NextResponse.json({
          success: false,
          error: "Organisasjonsnummer finnes ikke i Brønnøysundregistrene",
          valid: false,
          exists: false
        });
      }

      if (!response.ok) {
        return NextResponse.json({
          success: false,
          error: "Kunne ikke validere organisasjonsnummer",
          valid: false
        }, { status: 500 });
      }

      const data: BrregResponse = await response.json();

      // Sjekk om bedriften er aktiv
      const isActive = !data.konkurs && !data.underAvvikling && !data.underTvangsavviklingEllerTvangsopplosning;

      if (!isActive) {
        return NextResponse.json({
          success: false,
          error: "Bedriften er ikke aktiv",
          valid: false,
          exists: true,
          active: false,
          company: {
            name: data.navn,
            orgForm: data.organisasjonsform.beskrivelse,
            registrationDate: data.registreringsdatoEnhetsregisteret
          }
        });
      }

      // Returner suksess med bedriftsinformasjon
      return NextResponse.json({
        success: true,
        valid: true,
        exists: true,
        active: true,
        company: {
          name: data.navn,
          orgForm: data.organisasjonsform.beskrivelse,
          registrationDate: data.registreringsdatoEnhetsregisteret,
          address: data.forretningsadresse ? {
            street: data.forretningsadresse.adresse.join(', '),
            postalCode: data.forretningsadresse.postnummer,
            city: data.forretningsadresse.poststed,
            country: data.forretningsadresse.land
          } : null
        }
      });

    } catch (apiError) {
      console.error("Brreg API error:", apiError);
      return NextResponse.json({
        success: false,
        error: "Kunne ikke kontakte Brønnøysundregistrene",
        valid: false
      }, { status: 500 });
    }

  } catch (error) {
    console.error("Validate orgnr API error:", error);
    return NextResponse.json(
      { success: false, error: "Intern serverfeil" },
      { status: 500 }
    );
  }
}
