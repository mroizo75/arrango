"use server";

import { stripe } from "@/lib/stripe";
import { getConvexClient } from "@/lib/convex";
import { getStripeCurrencyCode, safeCurrencyCode } from "@/lib/currency";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import baseUrl from "@/lib/baseUrl";
import { requireAuth } from "@/lib/auth-utils";
import { DURATIONS } from "@/convex/constants";

export type StripeCheckoutMetaData = {
  eventId: Id<"events">;
  userId: string;
  waitingListId: Id<"waitingList">;
  ticketTypeId?: Id<"ticketTypes">;
  cart?: Array<{
    ticketTypeId: Id<"ticketTypes">;
    quantity: number;
  }>;
  tickets?: Array<{
    ticketTypeId: Id<"ticketTypes">;
    recipientName: string;
    recipientEmail: string;
    id: string;
  }>;
  paymentMethod: 'card' | 'invoice';
};

export async function createStripeCheckoutSession({
  eventId,
  ticketTypeId,
  cart,
  tickets,
  paymentMethod = 'card',
}: {
  eventId: Id<"events">;
  ticketTypeId?: Id<"ticketTypes">;
  cart?: Array<{
    ticketTypeId: Id<"ticketTypes">;
    quantity: number;
  }>;
  tickets?: Array<{
    ticketTypeId: Id<"ticketTypes">;
    recipientName: string;
    recipientEmail: string;
    id: string;
  }>;
  paymentMethod?: 'card' | 'invoice';
}) {
  const user = await requireAuth();
  const userId = user.id;

  const convex = getConvexClient();

  // Get event details
  const event = await convex.query(api.events.getById, { eventId });
  if (!event) throw new Error("Event not found");

  // Get waiting list entry (optional for buying additional tickets)
  const queuePosition = await convex.query(api.waitingList.getQueuePosition, {
    eventId,
    userId,
  });

  // If no valid offer exists, create a temporary one for additional purchases
  let validQueuePosition = queuePosition;
  if (!queuePosition || queuePosition.status !== "offered") {
    // Create a temporary offer for additional ticket purchases
    await convex.mutation(api.waitingList.createTemporaryOffer, {
      eventId,
      userId,
    });
    // Re-fetch the queue position to get the enriched data
    validQueuePosition = await convex.query(api.waitingList.getQueuePosition, {
      eventId,
      userId,
    });
  }

  if (!validQueuePosition || validQueuePosition.status !== "offered") {
    throw new Error("Could not create ticket offer");
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

  if (!validQueuePosition.offerExpiresAt) {
    throw new Error("Ticket offer has no expiration date");
  }

  // Handle cart or single ticket type
  const lineItems: Array<{
    price_data: {
      currency: string;
      product_data: { name: string; description?: string };
      unit_amount: number;
    };
    quantity: number;
  }> = [];
  let totalAmount = 0;

  if (cart && cart.length > 0) {
    // Bulk purchase - create line items for each cart item
    for (const cartItem of cart) {
      const ticketTypeData = await convex.query(api.ticketTypes.getTicketTypeWithAvailability, {
        ticketTypeId: cartItem.ticketTypeId,
      });

      if (!ticketTypeData) {
        throw new Error(`Ticket type not found: ${cartItem.ticketTypeId}`);
      }

      if (ticketTypeData.availableQuantity < cartItem.quantity) {
        throw new Error(`Not enough tickets available for ${ticketTypeData.name}`);
      }

      const itemTotal = ticketTypeData.price * cartItem.quantity;
      totalAmount += itemTotal;

      lineItems.push({
        price_data: {
          currency: getStripeCurrencyCode(safeCurrencyCode(ticketTypeData.currency)),
          product_data: {
            name: `${event.name} - ${ticketTypeData.name}`,
            description: ticketTypeData.description || event.description,
          },
          unit_amount: ticketTypeData.price,
        },
        quantity: cartItem.quantity,
      });
    }
  } else if (ticketTypeId) {
    // Single ticket purchase (backward compatibility)
    const ticketTypeData = await convex.query(api.ticketTypes.getTicketTypeWithAvailability, {
      ticketTypeId,
    });

    if (!ticketTypeData) {
      throw new Error("Ticket type not found");
    }

    if (ticketTypeData.isSoldOut) {
      throw new Error("Selected ticket type is sold out");
    }

    totalAmount = ticketTypeData.price;

    lineItems.push({
      price_data: {
        currency: getStripeCurrencyCode(safeCurrencyCode(ticketTypeData.currency)),
        product_data: {
          name: ticketTypeData ? `${event.name} - ${ticketTypeData.name}` : event.name,
          description: ticketTypeData?.description || event.description,
        },
        unit_amount: ticketTypeData.price,
      },
      quantity: 1,
    });
  } else {
    // Fallback to event price (should not happen with new system)
    totalAmount = event.price;

    lineItems.push({
      price_data: {
        currency: getStripeCurrencyCode(safeCurrencyCode(event.currency)),
        product_data: {
          name: event.name,
          description: event.description,
        },
        unit_amount: Math.round(event.price * 100),
      },
      quantity: 1,
    });
  }

  const metadata = {
    eventId,
    userId,
    waitingListId: validQueuePosition._id,
    ticketTypeId: ticketTypeId || null,
    cart: cart ? JSON.stringify(cart) : null,
    tickets: tickets ? JSON.stringify(tickets) : null,
    paymentMethod,
  };

  // Create Stripe Checkout Session
  const session = await stripe.checkout.sessions.create(
    {
      payment_method_types: paymentMethod === 'invoice' ? ["klarna"] : ["card"],
      line_items: lineItems,
      payment_intent_data: {
        application_fee_amount: Math.round(totalAmount * 0.01),
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
