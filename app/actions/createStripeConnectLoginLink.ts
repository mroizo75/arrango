"use server";

import { stripe } from "@/lib/stripe";
import { getConvexClient } from "@/lib/convex";
import { api } from "@/convex/_generated/api";
import { requireAuth } from "@/lib/auth-utils";

export async function createStripeConnectLoginLink(stripeAccountId?: string) {
  let accountId = stripeAccountId;

  if (!accountId) {
    const convex = getConvexClient();
    const user = await requireAuth();
    const userId = user.id;

    const fetchedAccountId = await convex.query(
      api.users.getUsersStripeConnectId,
      {
        userId,
      }
    );

    accountId = fetchedAccountId ?? undefined;
  }

  if (!accountId) {
    throw new Error("Stripe account ID not available");
  }

  try {
    const loginLink = await stripe.accounts.createLoginLink(accountId);
    return loginLink.url;
  } catch (error) {
    console.error("Error creating Stripe Connect login link:", error);
    throw new Error("Failed to create Stripe Connect login link");
  }
}
