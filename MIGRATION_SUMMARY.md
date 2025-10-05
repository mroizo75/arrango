# Clerk til NextAuth v4 Migrering - Oppsummering

## ✅ Fullført

### 1. NextAuth Oppsett
- ✅ Installert `next-auth@4`, `bcrypt` og `@types/bcrypt`
- ✅ Opprettet NextAuth konfigurasjon i `lib/auth.ts`
- ✅ Opprettet API route `/api/auth/[...nextauth]/route.ts`
- ✅ Opprettet TypeScript types i `types/next-auth.d.ts`
- ✅ Opprettet helper-funksjoner i `lib/auth-utils.ts`

### 2. Database Schema
- ✅ Oppdatert `convex/schema.ts` for å inkludere `hashedPassword`
- ✅ Lagt til `getUserByEmail` query i `convex/users.ts`
- ✅ Lagt til `registerUser` mutation i `convex/users.ts`

### 3. Middleware
- ✅ Erstattet Clerk middleware med NextAuth middleware i `middleware.ts`
- ✅ Slettet `middleware-backup.ts`

### 4. Layout og Providers
- ✅ Erstattet `ClerkProvider` med `SessionProvider` i `app/layout.tsx`
- ✅ Oppdatert `SyncUserWithConvex.tsx` til å bruke NextAuth session

### 5. Autentiseringssider
- ✅ Opprettet ny `/sign-in/page.tsx` med NextAuth
- ✅ Opprettet ny `/sign-up/page.tsx` med NextAuth
- ✅ Opprettet ny `/become-organizer/page.tsx` med NextAuth onboarding
- ✅ Slettet gamle Clerk-baserte sider
- ✅ Slettet `/api/set-organizer-metadata` (ikke lenger nødvendig)

### 6. Server Actions
- ✅ Opprettet `app/actions/registerUser.ts` for sikker passord-hashing
- ✅ Oppdatert `app/dashboard/page.tsx` til å bruke `requireAuth()`

### 7. UI Komponenter
- ✅ Oppdatert `components/Header.tsx` - erstattet Clerk-komponenter med custom UI
- ✅ Oppdatert `components/HeaderWrapper.tsx` - bruker `useSession`
- ✅ Oppdatert `components/EventCard.tsx` - bruker `useSession`
- ✅ Oppdatert `components/PurchaseTicket.tsx` - bruker `useSession`
- ✅ Oppdatert `app/tickets/page.tsx` - bruker `useSession`
- ✅ Oppdatert `app/dashboard/DashboardClient.tsx` - bruker `useSession`

### 8. Dependencies
- ✅ Fjernet `@clerk/nextjs` fra `package.json`
- ✅ Installert NextAuth v4 og bcrypt

### 9. Dokumentasjon
- ✅ Opprettet `ENV_SETUP.md` med detaljert oppsett
- ✅ Oppdatert `README.md` med NextAuth instruksjoner
- ✅ Fjernet Clerk-spesifikke seksjoner fra README

## ⚠️ Komponenter som trenger manuell oppdatering

Følgende filer inneholder fortsatt Clerk-imports og må oppdateres manuelt:

### Server-side filer (bruker `auth()` fra Clerk):
- `app/actions/createStripeCheckoutSession.ts`
- `app/actions/createDirectPurchase.ts`
- `app/actions/createStripeConnectLoginLink.ts`
- `app/actions/getStripeConnectAccount.ts`
- `app/actions/createStripeConnectCustomer.ts`
- `app/dashboard/settings/page.tsx`
- `app/dashboard/events/page.tsx`
- `app/dashboard/tickets/page.tsx`
- `app/dashboard/scan/page.tsx`
- `app/dashboard/scan/[eventId]/page.tsx`
- `app/dashboard/customers/page.tsx`
- `app/dashboard/layout.tsx`
- `app/tickets/[id]/page.tsx`

**Løsning:** Erstatt `auth()` fra Clerk med `requireAuth()` fra `lib/auth-utils.ts`

### Client-side komponenter (bruker `useUser`):
- `app/dashboard/onboarding/stripe/page.tsx`
- `app/dashboard/settings/SettingsPageClient.tsx`
- `app/event/[id]/EventPageClient.tsx`
- `components/OrganizerOnboarding.tsx`
- `components/StripeConnectSettings.tsx`
- `components/FikenSettings.tsx`
- `components/EventForm.tsx`
- `components/DashboardSidebar.tsx`
- `components/SellerDashboardPage.tsx`
- `components/SellerDashboardSidebar.tsx`
- `components/DashboardPage.tsx`
- `components/OrganizationNumberForm.tsx`
- `components/SellerEventList.tsx`
- `components/SellerDashboard.tsx`

**Løsning:** Erstatt:
```typescript
import { useUser } from "@clerk/nextjs";
const { user } = useUser();
```

Med:
```typescript
import { useSession } from "next-auth/react";
const { data: session } = useSession();
const user = session?.user;
```

### Komponenter med Clerk UI-komponenter:
- `app/event/[id]/EventPageClient.tsx` (bruker `SignInButton`)

**Løsning:** Erstatt `SignInButton` med Link til `/sign-in`

### Filer som trenger spesiell oppmerksomhet:
- `components/ConvexClientProvider.tsx` - sjekk om ClerkProvider er fjernet
- `app/arrangorer/page.tsx` - kan ha Clerk-avhengigheter

## 🔧 Neste steg

1. **Oppdater server-side actions:**
   ```typescript
   // Gammel kode
   import { auth } from "@clerk/nextjs/server";
   const { userId } = await auth();
   
   // Ny kode
   import { requireAuth } from "@/lib/auth-utils";
   const user = await requireAuth();
   const userId = user.id;
   ```

2. **Oppdater client-side komponenter:**
   ```typescript
   // Gammel kode
   import { useUser } from "@clerk/nextjs";
   const { user } = useUser();
   
   // Ny kode
   import { useSession } from "next-auth/react";
   const { data: session } = useSession();
   const user = session?.user;
   ```

3. **Test grundig:**
   - [ ] Registrering av nye brukere
   - [ ] Innlogging
   - [ ] Arrangør-registrering
   - [ ] Dashboard-tilgang
   - [ ] Billettkjøp
   - [ ] Stripe Connect onboarding
   - [ ] Alle beskyttede ruter

4. **Oppdater environment variabler:**
   - [ ] Fjern Clerk environment variabler
   - [ ] Legg til NextAuth variabler (se `ENV_SETUP.md`)

## 📝 Viktige notater

### Passord-hashing
- Passord hashes **på serveren** via `registerUserAction` 
- Bruker bcrypt med 12 rounds
- Aldri send passord-hashes fra klient

### Session Management
- NextAuth bruker JWT-tokens for sessions
- Sessions er gyldige i 30 dager
- Token refresh håndteres automatisk av NextAuth

### Onboarding
- Arrangør-onboarding lagres nå kun i Convex
- Ingen Clerk metadata brukes lenger
- `isOrganizer` flag i session user-objekt

### Migrering av eksisterende brukere
Hvis du har eksisterende Clerk-brukere:
1. Eksporter brukerdata fra Clerk
2. Hash passord på serversiden
3. Importer til Convex med `registerUser` mutation
4. Eller la brukere resette passord ved første innlogging

## 🚀 Fordeler med NextAuth

1. **Ingen eksterne avhengigheter** - alt kjører på din infrastruktur
2. **Full kontroll** - egen onboarding-flyt
3. **Billigere** - ingen månedlige kostnader for autentisering
4. **Enklere** - mindre kompleksitet
5. **Bedre integrasjon** - direkte tilgang til Convex-data

## 💡 Tips

- Husk å regenerere Convex schema: `npx convex dev`
- Test i development-modus først
- Bruk `openssl rand -base64 32` for å generere NEXTAUTH_SECRET
- Hold styr på alle environment variabler i `.env.local`
