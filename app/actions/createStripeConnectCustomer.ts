"use server";

import { requireAuth } from "@/lib/auth-utils";
import { api } from "@/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";
import { stripe } from "@/lib/stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error("NEXT_PUBLIC_CONVEX_URL is not set");
}

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export async function createStripeConnectCustomer() {
  try {
    const user = await requireAuth();
    const userId = user.id;

    console.log(`Creating Stripe Connect account for user: ${userId}`);

    // Check if user already has a connect account
    const existingStripeConnectId = await convex.query(
      api.users.getUsersStripeConnectId,
      {
        userId,
      }
    );

    if (existingStripeConnectId) {
      console.log(`User already has Stripe Connect account: ${existingStripeConnectId}`);
      return { account: existingStripeConnectId };
    }

    // Create new connect account
    const account = await stripe.accounts.create({
      type: "express",
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    console.log(`Created Stripe Connect account: ${account.id}`);

    // Update user with stripe connect id
    await convex.mutation(api.users.updateOrCreateUserStripeConnectId, {
      userId,
      stripeConnectId: account.id,
    });

    console.log(`Updated user ${userId} with Stripe Connect ID: ${account.id}`);

    return { account: account.id };
  } catch (error) {
    console.error("Error in createStripeConnectCustomer:", error);
    
    if (error instanceof Error) {
      throw new Error(`Kunne ikke opprette Stripe-konto: ${error.message}`);
    }
    
    throw new Error("En ukjent feil oppstod ved opprettelse av Stripe-konto");
  }
}
