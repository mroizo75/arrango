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
        },
      });
      console.log("Purchase ticket mutation completed:", result);
    } catch (error) {
      console.error("Error processing webhook:", error);
      return new Response("Error processing webhook", { status: 500 });
    }
  }

  return new Response(null, { status: 200 });
}
