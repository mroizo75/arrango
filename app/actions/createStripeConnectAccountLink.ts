"use server";

import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";

export async function createStripeConnectAccountLink(account: string) {
  if (!account) {
    throw new Error("Ingen Stripe-konto ID oppgitt");
  }

  try {
    const headersList = await headers();
    const origin = headersList.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    console.log(`Creating Stripe Connect account link for account: ${account}`);
    console.log(`Using origin: ${origin}`);

    const accountLink = await stripe.accountLinks.create({
      account,
      refresh_url: `${origin}/connect/refresh/${account}`,
      return_url: `${origin}/connect/return/${account}`,
      type: "account_onboarding",
    });

    console.log(`Account link created successfully for ${account}`);

    return { url: accountLink.url };
  } catch (error) {
    console.error(
      `Error creating Stripe account link for ${account}:`,
      error
    );
    
    if (error instanceof Error) {
      throw new Error(`Kunne ikke opprette Stripe-konto link: ${error.message}`);
    }
    
    throw new Error("En ukjent feil oppstod ved opprettelse av Stripe-konto link");
  }
}
