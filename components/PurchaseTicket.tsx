"use client";

import { createStripeCheckoutSession } from "@/app/actions/createStripeCheckoutSession";
import { Id } from "@/convex/_generated/dataModel";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import ReleaseTicket from "./ReleaseTicket";
import { TicketTypeSelector } from "./TicketTypeSelector";
import { Ticket } from "lucide-react";

export default function PurchaseTicket({ eventId }: { eventId: Id<"events"> }) {
  const router = useRouter();
  const { user } = useUser();
  const queuePosition = useQuery(api.waitingList.getQueuePosition, {
    eventId,
    userId: user?.id ?? "",
  });

  const userTicket = useQuery(api.tickets.getUserTicketForEvent, {
    eventId,
    userId: user?.id ?? "",
  });

  const [timeRemaining, setTimeRemaining] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cart, setCart] = useState<Array<{
    ticketType: {
      _id: Id<"ticketTypes">;
      name: string;
      description?: string;
      price: number;
      currency: string;
      maxQuantity: number;
      soldQuantity: number;
      availableQuantity: number;
      isSoldOut: boolean;
      benefits?: string[];
    };
    quantity: number;
    tickets: Array<{
      ticketType: {
        _id: Id<"ticketTypes">;
        name: string;
        description?: string;
        price: number;
        currency: string;
        maxQuantity: number;
        soldQuantity: number;
        availableQuantity: number;
        isSoldOut: boolean;
        benefits?: string[];
      };
      recipientName: string;
      recipientEmail: string;
      id: string;
    }>;
  }>>([]);

  const offerExpiresAt = queuePosition?.offerExpiresAt ?? 0;
  const isExpired = Date.now() > offerExpiresAt;

  useEffect(() => {
    const calculateTimeRemaining = () => {
      if (isExpired) {
        setTimeRemaining("Expired");
        return;
      }

      const diff = offerExpiresAt - Date.now();
      const minutes = Math.floor(diff / 1000 / 60);
      const seconds = Math.floor((diff / 1000) % 60);

      if (minutes > 0) {
        setTimeRemaining(
          `${minutes} minute${minutes === 1 ? "" : "s"} ${seconds} second${
            seconds === 1 ? "" : "s"
          }`
        );
      } else {
        setTimeRemaining(`${seconds} second${seconds === 1 ? "" : "s"}`);
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, [offerExpiresAt, isExpired]);

  const handlePurchase = async () => {
    if (!user || cart.length === 0) return;

    try {
      setIsLoading(true);

      // Send individual tickets with recipient info for bulk purchase
      const allTickets = cart.flatMap(item =>
        item.tickets.map(ticket => ({
          ticketTypeId: ticket.ticketType._id,
          recipientName: ticket.recipientName,
          recipientEmail: ticket.recipientEmail,
          id: ticket.id,
        }))
      );

      const { sessionUrl } = await createStripeCheckoutSession({
        eventId,
        tickets: allTickets,
      });

      if (sessionUrl) {
        router.push(sessionUrl);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // PurchaseTicket now works for both new purchases and additional tickets

  if (!user) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-amber-200">
      <div className="space-y-4">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <Ticket className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {userTicket ? "Kjøp flere billetter" : "Ticket Reserved"}
                </h3>
                {!userTicket && (
                  <p className="text-sm text-gray-500">
                    Expires in {timeRemaining}
                  </p>
                )}
              </div>
            </div>

            <div className="text-sm text-gray-600 leading-relaxed">
              {userTicket
                ? "Du har allerede en billett til dette arrangementet. Ønsker du å kjøpe flere billetter?"
                : "A ticket has been reserved for you. Complete your purchase before the timer expires to secure your spot at this event."
              }
            </div>
          </div>
        </div>

        {/* Ticket Selection */}
        <div className="bg-gray-50 rounded-lg p-4">
          <TicketTypeSelector
            eventId={eventId}
            cart={cart}
            onCartUpdate={setCart}
          />
        </div>

        <button
          onClick={handlePurchase}
          disabled={isExpired || isLoading || cart.length === 0}
          className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-4 rounded-lg font-bold shadow-md hover:from-amber-600 hover:to-amber-700 transform hover:scale-[1.02] transition-all duration-200 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:hover:scale-100 text-lg"
        >
          {isLoading
            ? "Redirecting to checkout..."
            : userTicket
            ? "Kjøp flere billetter nå →"
            : "Purchase Your Ticket Now →"}
        </button>

        {queuePosition && (
          <div className="mt-4">
            <ReleaseTicket eventId={eventId} waitingListId={queuePosition._id} />
          </div>
        )}
      </div>
    </div>
  );
}
