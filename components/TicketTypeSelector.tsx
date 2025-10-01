"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

interface CartItem {
  ticketType: TicketType;
  quantity: number;
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
      // Legg til ny item i cart
      onCartUpdate([...cart, { ticketType, quantity: 1 }]);
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
      cart.map(item =>
        item.ticketType._id === ticketTypeId
          ? { ...item, quantity: clampedQuantity }
          : item
      )
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
    </div>
  );
}
