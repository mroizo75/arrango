"use server";

import { api } from "@/convex/_generated/api";
import { requireAuth } from "@/lib/auth-utils";
import { ConvexHttpClient } from "convex/browser";

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error("NEXT_PUBLIC_CONVEX_URL is not set");
}

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export async function getStripeConnectAccount() {
  const user = await requireAuth();
  const userId = user.id;

  const stripeConnectId = await convex.query(
    api.users.getUsersStripeConnectId,
    {
      userId,
    }
  );

  return {
    stripeConnectId: stripeConnectId || null,
  };
}
