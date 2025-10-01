"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice, safeCurrencyCode } from "@/lib/currency";
import { CheckCircle, Users, AlertCircle } from "lucide-react";

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

interface TicketTypeSelectorProps {
  eventId: Id<"events">;
  selectedTypeId?: Id<"ticketTypes">;
  onTypeSelect: (ticketType: TicketType) => void;
}

export function TicketTypeSelector({
  eventId,
  selectedTypeId,
  onTypeSelect
}: TicketTypeSelectorProps) {
  const ticketTypes = useQuery(api.ticketTypes.getPublicEventTicketTypes, { eventId });

  if (!ticketTypes || ticketTypes.length === 0) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Ingen billett-typer tilgjengelig</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2">Velg billett-type</h3>
        <p className="text-sm text-muted-foreground">
          Velg den billett-typen som passer best for deg
        </p>
      </div>

      <div className="grid gap-4">
        {ticketTypes.map((ticketType) => (
          <Card
            key={ticketType._id}
            className={`cursor-pointer transition-all ${
              selectedTypeId === ticketType._id
                ? "ring-2 ring-blue-500 border-blue-500"
                : "hover:shadow-md"
            } ${ticketType.isSoldOut ? "opacity-50" : ""}`}
            onClick={() => !ticketType.isSoldOut && onTypeSelect(ticketType)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-base">{ticketType.name}</CardTitle>
                  {selectedTypeId === ticketType._id && (
                    <CheckCircle className="w-5 h-5 text-blue-600" />
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

              {/* Popular badge for certain types */}
              {ticketType.name.toLowerCase().includes("vip") && (
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">
                  Populær
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedTypeId && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-900">
              {ticketTypes.find(t => t._id === selectedTypeId)?.name} valgt
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
