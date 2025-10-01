import { getConvexClient } from "@/lib/convex";
import { api } from "@/convex/_generated/api";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Ticket from "@/components/Ticket";

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
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h1 className="text-3xl font-bold text-yellow-900 mb-4">
              ⏳ Behandler bestillingen...
            </h1>
            <p className="text-lg text-yellow-800 mb-2">
              Vennligst vent mens vi bekrefter betalingen din.
            </p>
            <p className="text-sm text-yellow-700">
              Dette tar vanligvis bare noen sekunder.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 text-left">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Ser du ikke billetten din?
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li>• <strong>Refresh siden</strong> om noen sekunder</li>
              <li>• Sjekk <a href="/tickets" className="text-blue-600 hover:underline">Mine Billetter</a></li>
              <li>• Session ID: <code className="text-xs bg-gray-100 px-2 py-1 rounded">{sessionId || "N/A"}</code></li>
            </ul>
            <p className="mt-4 text-sm text-gray-600">
              Hvis problemet vedvarer etter 1 minutt, kontakt support med Session ID over.
            </p>
          </div>
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
