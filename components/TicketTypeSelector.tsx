"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPrice, safeCurrencyCode } from "@/lib/currency";
import { CheckCircle, Users, AlertCircle, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TicketType {
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
}

interface CartTicket {
  ticketType: TicketType;
  recipientName: string;
  recipientEmail: string;
  id: string; // Unique ID for this specific ticket
}

interface CartItem {
  ticketType: TicketType;
  quantity: number;
  tickets: CartTicket[]; // Individual tickets with recipient info
}

interface TicketTypeSelectorProps {
  eventId: Id<"events">;
  cart: CartItem[];
  onCartUpdate: (cart: CartItem[]) => void;
}

export function TicketTypeSelector({
  eventId,
  cart,
  onCartUpdate
}: TicketTypeSelectorProps) {
  const ticketTypes = useQuery(api.ticketTypes.getPublicEventTicketTypes, { eventId });

  const getCartItem = (ticketTypeId: Id<"ticketTypes">) => {
    return cart.find(item => item.ticketType._id === ticketTypeId);
  };

  const addToCart = (ticketType: TicketType) => {
    const existingItem = getCartItem(ticketType._id);
    if (existingItem) {
      // Øk quantity hvis allerede i cart
      updateQuantity(ticketType._id, existingItem.quantity + 1);
    } else {
      // Legg til ny item i cart med én ticket
      const newTicket: CartTicket = {
        ticketType,
        recipientName: "",
        recipientEmail: "",
        id: `${ticketType._id}-${Date.now()}`,
      };
      onCartUpdate([...cart, {
        ticketType,
        quantity: 1,
        tickets: [newTicket]
      }]);
    }
  };

  const removeFromCart = (ticketTypeId: Id<"ticketTypes">) => {
    onCartUpdate(cart.filter(item => item.ticketType._id !== ticketTypeId));
  };

  const updateQuantity = (ticketTypeId: Id<"ticketTypes">, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(ticketTypeId);
      return;
    }

    const ticketType = ticketTypes?.find(tt => tt._id === ticketTypeId);
    if (!ticketType) return;

    // Sjekk at vi ikke overskrider tilgjengelig quantity
    const maxAllowed = ticketType.availableQuantity;
    const clampedQuantity = Math.min(newQuantity, maxAllowed);

    onCartUpdate(
      cart.map(item => {
        if (item.ticketType._id === ticketTypeId) {
          const currentTickets = item.tickets.length;
          let newTickets = [...item.tickets];

          if (clampedQuantity > currentTickets) {
            // Legg til flere tickets
            for (let i = currentTickets; i < clampedQuantity; i++) {
              newTickets.push({
                ticketType,
                recipientName: "",
                recipientEmail: "",
                id: `${ticketType._id}-${Date.now()}-${i}`,
              });
            }
          } else if (clampedQuantity < currentTickets) {
            // Fjern noen tickets
            newTickets = newTickets.slice(0, clampedQuantity);
          }

          return {
            ...item,
            quantity: clampedQuantity,
            tickets: newTickets
          };
        }
        return item;
      })
    );
  };

  const updateTicketRecipient = (ticketId: string, field: 'recipientName' | 'recipientEmail', value: string) => {
    onCartUpdate(
      cart.map(item => ({
        ...item,
        tickets: item.tickets.map(ticket =>
          ticket.id === ticketId
            ? { ...ticket, [field]: value }
            : ticket
        )
      }))
    );
  };

  const getTotalTickets = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.ticketType.price * item.quantity), 0);
  };

  if (!ticketTypes || ticketTypes.length === 0) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Ingen billett-typer tilgjengelig</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Velg billetter</h3>
        <p className="text-sm text-muted-foreground">
          Velg antall og type billetter du ønsker å kjøpe
        </p>
      </div>

      <div className="grid gap-4">
        {ticketTypes.map((ticketType) => {
          const cartItem = getCartItem(ticketType._id);
          const quantity = cartItem?.quantity || 0;

          return (
            <Card
              key={ticketType._id}
              className={`transition-all ${ticketType.isSoldOut ? "opacity-50" : ""}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-base">{ticketType.name}</CardTitle>
                    {quantity > 0 && (
                      <Badge className="bg-green-100 text-green-800">
                        {quantity} valgt
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">
                      {formatPrice(ticketType.price, safeCurrencyCode(ticketType.currency))}
                    </div>
                    {ticketType.isSoldOut && (
                      <Badge variant="destructive" className="mt-1">Utsolgt</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {ticketType.description && (
                  <p className="text-sm text-muted-foreground">{ticketType.description}</p>
                )}

                {/* Availability */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span>
                      {ticketType.availableQuantity} / {ticketType.maxQuantity} tilgjengelig
                    </span>
                  </div>
                  <div className="text-muted-foreground">
                    {ticketType.soldQuantity} solgt
                  </div>
                </div>

                {/* Benefits */}
                {ticketType.benefits && ticketType.benefits.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Fordeler:</h4>
                    <ul className="space-y-1">
                      {ticketType.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Quantity Selector */}
                {!ticketType.isSoldOut && (
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm font-medium">Antall:</span>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(ticketType._id, quantity - 1)}
                        disabled={quantity === 0}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center font-medium">{quantity}</span>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => addToCart(ticketType)}
                        disabled={quantity >= ticketType.availableQuantity}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Popular badge for certain types */}
                {ticketType.name.toLowerCase().includes("vip") && (
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">
                    Populær
                  </Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Cart Summary */}
      {cart.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-blue-900">Handlekurv</h4>
            <Badge className="bg-blue-100 text-blue-800">
              {getTotalTickets()} billett{getTotalTickets() !== 1 ? 'er' : ''}
            </Badge>
          </div>

          <div className="space-y-2">
            {cart.map((item) => (
              <div key={item.ticketType._id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span>
                    {item.quantity}x {item.ticketType.name}
                  </span>
                </div>
                <span className="font-medium">
                  {formatPrice(
                    item.ticketType.price * item.quantity,
                    safeCurrencyCode(item.ticketType.currency)
                  )}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 mt-2 border-t border-blue-200">
            <span className="font-medium text-blue-900">Total:</span>
            <span className="text-lg font-bold text-blue-900">
              {formatPrice(getTotalPrice(), safeCurrencyCode(cart[0]?.ticketType.currency || "NOK"))}
            </span>
          </div>
        </div>
      )}

      {/* Recipient Information */}
      {cart.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-3">Mottaker informasjon</h4>
          <div className="space-y-4">
            {cart.map((item) =>
              item.tickets.map((ticket, ticketIndex) => (
                <div key={ticket.id} className="bg-white rounded-lg p-3 border border-green-100">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      Billett {ticketIndex + 1} - {item.ticketType.name}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor={`name-${ticket.id}`} className="text-sm text-gray-700">
                        Navn på mottaker
                      </Label>
                      <Input
                        id={`name-${ticket.id}`}
                        type="text"
                        placeholder="F.eks. Ola Nordmann"
                        value={ticket.recipientName}
                        onChange={(e) => updateTicketRecipient(ticket.id, 'recipientName', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`email-${ticket.id}`} className="text-sm text-gray-700">
                        E-post til mottaker
                      </Label>
                      <Input
                        id={`email-${ticket.id}`}
                        type="email"
                        placeholder="F.eks. ola@example.com"
                        value={ticket.recipientEmail}
                        onChange={(e) => updateTicketRecipient(ticket.id, 'recipientEmail', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <p className="text-xs text-green-700 mt-3">
            💡 La feltene stå tomme hvis billettene er til deg selv. Vi sender automatisk bekreftelse på e-post til alle mottakere etter kjøp.
          </p>
        </div>
      )}
    </div>
  );
}
