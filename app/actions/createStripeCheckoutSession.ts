"use server";

import { stripe } from "@/lib/stripe";
import { getConvexClient } from "@/lib/convex";
import { getStripeCurrencyCode, safeCurrencyCode } from "@/lib/currency";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import baseUrl from "@/lib/baseUrl";
import { auth } from "@clerk/nextjs/server";
import { DURATIONS } from "@/convex/constants";

export type StripeCheckoutMetaData = {
  eventId: Id<"events">;
  userId: string;
  waitingListId: Id<"waitingList">;
  ticketTypeId?: Id<"ticketTypes">;
};

export async function createStripeCheckoutSession({
  eventId,
  ticketTypeId,
}: {
  eventId: Id<"events">;
  ticketTypeId?: Id<"ticketTypes">;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const convex = getConvexClient();

  // Get event details
  const event = await convex.query(api.events.getById, { eventId });
  if (!event) throw new Error("Event not found");

  // Get waiting list entry
  const queuePosition = await convex.query(api.waitingList.getQueuePosition, {
    eventId,
    userId,
  });

  if (!queuePosition || queuePosition.status !== "offered") {
    throw new Error("No valid ticket offer found");
  }

  const stripeConnectId = await convex.query(
    api.users.getUsersStripeConnectId,
    {
      userId: event.userId,
    }
  );

  if (!stripeConnectId) {
    throw new Error("Stripe Connect ID not found for owner of the event!");
  }

  if (!queuePosition.offerExpiresAt) {
    throw new Error("Ticket offer has no expiration date");
  }

  // Get ticket type information if provided
  let ticketPrice = event.price;
  let ticketCurrency = event.currency || "NOK";
  let ticketTypeData = null;

  if (ticketTypeId) {
    ticketTypeData = await convex.query(api.ticketTypes.getTicketTypeWithAvailability, {
      ticketTypeId,
    });

    if (!ticketTypeData) {
      throw new Error("Ticket type not found");
    }

    if (ticketTypeData.isSoldOut) {
      throw new Error("Selected ticket type is sold out");
    }

    ticketPrice = ticketTypeData.price / 100; // Convert from øre to currency units
    ticketCurrency = ticketTypeData.currency;
  }

  const metadata: StripeCheckoutMetaData = {
    eventId,
    userId,
    waitingListId: queuePosition._id,
    ticketTypeId,
  };

  // Create Stripe Checkout Session
  const session = await stripe.checkout.sessions.create(
    {
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: getStripeCurrencyCode(safeCurrencyCode(ticketCurrency)),
            product_data: {
              name: ticketTypeData ? `${event.name} - ${ticketTypeData.name}` : event.name,
              description: ticketTypeData?.description || event.description,
            },
            unit_amount: Math.round(ticketPrice * 100),
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: Math.round(ticketPrice * 100 * 0.01),
      },
      expires_at: Math.floor(Date.now() / 1000) + DURATIONS.TICKET_OFFER / 1000, // 30 minutes (stripe checkout minimum expiration time)
      mode: "payment",
      success_url: `${baseUrl}/tickets/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/event/${eventId}`,
      metadata,
    },
    {
      stripeAccount: stripeConnectId,
    }
  );

  return { sessionId: session.id, sessionUrl: session.url };
}
