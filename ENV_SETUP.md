# Environment Variables Setup

Opprett en `.env.local` fil i root-mappen med følgende variabler:

## NextAuth (Påkrevd)
```bash
# Generer en sikker secret med: openssl rand -base64 32
NEXTAUTH_SECRET=din_hemmelige_nøkkel_her

# URL til din app
NEXTAUTH_URL=http://localhost:3000
```

## Convex (Påkrevd)
```bash
NEXT_PUBLIC_CONVEX_URL=din_convex_deployment_url
```

## Stripe (Påkrevd for betalinger)
```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## App URL (Påkrevd)
```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Valgfritt: Resend (for e-post)
```bash
RESEND_API_KEY=re_...
```

## Valgfritt: Fiken (for regnskapsintegrasjon)
```bash
FIKEN_CLIENT_ID=din_fiken_client_id
FIKEN_CLIENT_SECRET=din_fiken_client_secret
```

## Slik kommer du i gang:

### 1. Generer NEXTAUTH_SECRET
```bash
openssl rand -base64 32
```
Kopier resultatet til `NEXTAUTH_SECRET` i `.env.local`.

### 2. Sett opp Convex
1. Gå til [convex.dev](https://convex.dev)
2. Opprett et nytt prosjekt
3. Kopier deployment URL til `NEXT_PUBLIC_CONVEX_URL`
4. Kjør `npx convex dev` for å synkronisere schema

### 3. Sett opp Stripe
1. Gå til [stripe.com/dashboard](https://dashboard.stripe.com)
2. Aktiver Stripe Connect
3. Kopier API-nøklene til `.env.local`
4. For lokal webhook testing:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
   Kopier webhook secret til `STRIPE_WEBHOOK_SECRET`

### 4. Kjør prosjektet
```bash
npm run dev
```

Åpne [http://localhost:3000](http://localhost:3000) i nettleseren din.
