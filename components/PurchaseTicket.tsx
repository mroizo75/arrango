"use client";

import { createStripeCheckoutSession } from "@/app/actions/createStripeCheckoutSession";
import { createDirectPurchase } from "@/app/actions/createDirectPurchase";
import { Id } from "@/convex/_generated/dataModel";
import { useEffect, useState, useMemo } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import ReleaseTicket from "./ReleaseTicket";
import { TicketTypeSelector } from "./TicketTypeSelector";
import { Ticket } from "lucide-react";

export default function PurchaseTicket({ eventId }: { eventId: Id<"events"> }) {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
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

  const totalPrice = useMemo(() => {
    return cart.reduce((total, item) =>
      total + (item.ticketType.price * item.quantity), 0
    );
  }, [cart]);

  // Klarna er tilgjengelig for alle kunder når det er aktivert på plattform-nivå
  const canUseKlarna = totalPrice > 0; // Klarna håndterer selv land og tilgjengelighet
  const canUseCard = totalPrice > 0;

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'klarna'>('card');

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

      if (totalPrice === 0) {
        // Free tickets - create directly without Stripe
        const directPurchase = await createDirectPurchase({
          eventId,
          tickets: allTickets,
          userId: user.id,
        });

        if (directPurchase.success) {
          router.push(`/tickets/purchase-success?free=true`);
        } else {
          throw new Error(directPurchase.error || "Failed to create free tickets");
        }
                  } else {
                    // Paid tickets - use Stripe
                    const { sessionUrl } = await createStripeCheckoutSession({
                      eventId,
                      tickets: allTickets,
                      paymentMethod: paymentMethod === 'klarna' ? 'invoice' : 'card',
                    });

        if (sessionUrl) {
          router.push(sessionUrl);
        }
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

        {/* Payment Method Selection */}
        {canUseCard && canUseKlarna && (
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Betalingsmetode</h4>
            <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'card' | 'klarna')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                  <CreditCard className="w-4 h-4" />
                  Kortbetaling (Visa, Mastercard)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="klarna" id="klarna" />
                <Label htmlFor="klarna" className="flex items-center gap-2 cursor-pointer">
                  <FileText className="w-4 h-4" />
                  Klarna (Pay in 3, Pay later, etc.)
                </Label>
              </div>
            </RadioGroup>
          </div>
        )}

        <button
          onClick={handlePurchase}
          disabled={isExpired || isLoading || cart.length === 0}
          className={`w-full px-8 py-4 rounded-lg font-bold shadow-md transform hover:scale-[1.02] transition-all duration-200 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:hover:scale-100 text-lg ${
            totalPrice === 0
              ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
              : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
          }`}
        >
          {isLoading
            ? "Behandler..."
            : totalPrice === 0
            ? (userTicket ? "Registrer flere gratis billetter →" : "Registrer gratis billett →")
            : (userTicket ? "Kjøp flere billetter nå →" : "Purchase Your Ticket Now →")}
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
