import { getConvexClient } from "@/lib/convex";
import { api } from "@/convex/_generated/api";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import Ticket from "@/components/Ticket";
import { Id } from "@/convex/_generated/dataModel";

async function TicketSuccess({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const params = await searchParams;
  const sessionId = params.session_id;

  const convex = getConvexClient();

  // Wait for webhook to process the payment (give it up to 5 seconds)
  if (sessionId) {
    const maxAttempts = 5;
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      const tickets = await convex.query(api.events.getUserTickets, { userId });
      
      if (tickets.length > 0) {
        // Ticket found! Webhook processed it
        break;
      }
      
      // Wait 1 second before next attempt
      await new Promise((resolve) => setTimeout(resolve, 1000));
      attempts++;
    }
  }

  // Get the latest ticket
  const tickets = await convex.query(api.events.getUserTickets, { userId });
  const latestTicket = tickets[tickets.length - 1];

  if (!latestTicket) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Behandler bestillingen...
          </h1>
          <p className="mt-2 text-gray-600">
            Vennligst vent mens vi bekrefter betalingen din.
          </p>
          <p className="mt-4 text-sm text-gray-500">
            Dette tar vanligvis bare noen sekunder. Hvis du ikke ser billetten din snart, vennligst refresh siden.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Billettkjøp vellykket! 🎉
          </h1>
          <p className="mt-2 text-gray-600">
            Billetten din er bekreftet og klar til bruk
          </p>
        </div>

        <Ticket ticketId={latestTicket._id} />
      </div>
    </div>
  );
}

export default TicketSuccess;
