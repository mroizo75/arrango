import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { getConvexClient } from "@/lib/convex";
import { api } from "@/convex/_generated/api";
import Stripe from "stripe";
import { StripeCheckoutMetaData } from "@/app/actions/createStripeCheckoutSession";
import { Id } from "@/convex/_generated/dataModel";

export async function POST(req: Request) {
  console.log("=== STRIPE WEBHOOK RECEIVED ===");
  console.log("Timestamp:", new Date().toISOString());
  console.log("Request URL:", req.url);

  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature") as string;

  console.log("Webhook signature:", signature ? "Present" : "Missing");
  console.log("Body length:", body.length);

  let event: Stripe.Event;

  try {
    console.log("Attempting to construct webhook event");
    
    // For local development without Stripe CLI, skip signature verification
    if (process.env.NODE_ENV === 'development' && !process.env.STRIPE_WEBHOOK_SECRET) {
      console.log("Development mode: Skipping webhook signature verification");
      event = JSON.parse(body) as Stripe.Event;
    } else {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    }
    
    console.log("Webhook event constructed successfully:", event.type);
  } catch (err) {
    console.error("Webhook construction failed:", err);
    return new Response(`Webhook Error: ${(err as Error).message}`, {
      status: 400,
    });
  }

  const convex = getConvexClient();

  if (event.type === "checkout.session.completed") {
    console.log("Processing checkout.session.completed");
    const session = event.data.object as Stripe.Checkout.Session;

    // Validate required metadata
    if (!session.metadata?.eventId || !session.metadata?.userId || !session.metadata?.waitingListId) {
      console.error("Missing required metadata in session");
      return new Response("Missing required metadata", { status: 400 });
    }

    const metadata: StripeCheckoutMetaData = {
      eventId: session.metadata.eventId as Id<"events">,
      userId: session.metadata.userId,
      waitingListId: session.metadata.waitingListId as Id<"waitingList">,
      ticketTypeId: session.metadata.ticketTypeId as Id<"ticketTypes">,
      cart: session.metadata.cart ? JSON.parse(session.metadata.cart) : undefined,
      tickets: session.metadata.tickets ? JSON.parse(session.metadata.tickets) : undefined,
      paymentMethod: (session.metadata.paymentMethod as 'card' | 'invoice') || 'card',
    };

    console.log("Session metadata:", metadata);
    console.log("Convex client:", convex);

    try {
      if (!session.payment_intent) {
        throw new Error("No payment intent found in session");
      }

      const result = await convex.mutation(api.events.purchaseTicket, {
        eventId: metadata.eventId,
        userId: metadata.userId,
        waitingListId: metadata.waitingListId,
        paymentInfo: {
          paymentIntentId: session.payment_intent as string,
          amount: session.amount_total ?? 0,
          ticketTypeId: metadata.ticketTypeId,
          currency: session.currency?.toUpperCase(),
          cart: metadata.cart,
          tickets: metadata.tickets,
        },
      });
      console.log("Purchase ticket mutation completed:", result);

      // Create invoices in Fiken for paid tickets
      try {
        // Find tickets created with this payment intent
        const tickets = await convex.query(api.tickets.getTicketsByPaymentIntent, {
          paymentIntentId: session.payment_intent as string,
        });

        // Create Fiken invoices for each ticket
        for (const ticket of tickets) {
          try {
            const invoiceResult = await convex.action(api.fiken.createFikenInvoice, {
              userId: metadata.userId,
              ticketId: ticket._id,
            });
            console.log("Fiken invoice created:", invoiceResult);
          } catch (invoiceError) {
            console.error("Failed to create Fiken invoice for ticket:", ticket._id, invoiceError);
            // Don't fail the webhook if invoice creation fails
          }
        }
      } catch (fikenError) {
        console.error("Error in Fiken invoice creation:", fikenError);
        // Don't fail the webhook if Fiken integration fails
      }
    } catch (error) {
      console.error("Error processing webhook:", error);
      return new Response("Error processing webhook", { status: 500 });
    }
  }

  return new Response(null, { status: 200 });
}
