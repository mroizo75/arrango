"use server";

import { stripe } from "@/lib/stripe";

export type AccountStatus = {
  isActive: boolean;
  requiresInformation: boolean;
  requirements: {
    currently_due: string[];
    eventually_due: string[];
    past_due: string[];
  };
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
};

export async function getStripeConnectAccountStatus(
  stripeAccountId: string
): Promise<AccountStatus> {
  if (!stripeAccountId) {
    throw new Error("Ingen Stripe-konto ID oppgitt");
  }

  try {
    console.log(`Fetching Stripe Connect account status for: ${stripeAccountId}`);
    
    const account = await stripe.accounts.retrieve(stripeAccountId);

    const status = {
      isActive:
        account.details_submitted &&
        !account.requirements?.currently_due?.length,
      requiresInformation: !!(
        account.requirements?.currently_due?.length ||
        account.requirements?.eventually_due?.length ||
        account.requirements?.past_due?.length
      ),
      requirements: {
        currently_due: account.requirements?.currently_due || [],
        eventually_due: account.requirements?.eventually_due || [],
        past_due: account.requirements?.past_due || [],
      },
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
    };

    console.log(`Stripe account status for ${stripeAccountId}:`, {
      isActive: status.isActive,
      chargesEnabled: status.chargesEnabled,
      payoutsEnabled: status.payoutsEnabled,
      requirementsCount: status.requirements.currently_due.length,
    });

    return status;
  } catch (error) {
    console.error(`Error fetching Stripe Connect account status for ${stripeAccountId}:`, error);
    
    if (error instanceof Error) {
      throw new Error(`Kunne ikke hente Stripe-kontostatus: ${error.message}`);
    }
    
    throw new Error("Kunne ikke hente Stripe-kontostatus");
  }
}
