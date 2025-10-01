"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { formatPrice, safeCurrencyCode } from "@/lib/currency";
import {
  Plus,
  Trash2,
  Edit3,
  Save,
  X,
  CheckCircle,
  Users,
  DollarSign,
} from "lucide-react";

interface TicketType {
  _id: Id<"ticketTypes">;
  name: string;
  description?: string;
  price: number;
  currency: string;
  maxQuantity: number;
  soldQuantity: number;
  sortOrder: number;
  isActive: boolean;
  benefits?: string[];
  availableQuantity: number;
  isSoldOut: boolean;
}

interface TicketTypeManagerProps {
  eventId: Id<"events">;
  eventCurrency: string;
}

export function TicketTypeManager({ eventId, eventCurrency }: TicketTypeManagerProps) {
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [editingId, setEditingId] = useState<Id<"ticketTypes"> | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form state for new/editing ticket type
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    maxQuantity: 50,
    sortOrder: 0,
    benefits: [] as string[],
  });

  const { toast } = useToast();
  const fetchedTicketTypes = useQuery(api.ticketTypes.getEventTicketTypes, { eventId });
  const createTicketType = useMutation(api.ticketTypes.createTicketType);
  const updateTicketType = useMutation(api.ticketTypes.updateTicketType);
  const deleteTicketType = useMutation(api.ticketTypes.deleteTicketType);

  useEffect(() => {
    if (fetchedTicketTypes) {
      setTicketTypes(fetchedTicketTypes);
    }
  }, [fetchedTicketTypes]);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      maxQuantity: 50,
      sortOrder: ticketTypes.length,
      benefits: [],
    });
    setEditingId(null);
    setIsAdding(false);
  };

  const startEditing = (ticketType: TicketType) => {
    setFormData({
      name: ticketType.name,
      description: ticketType.description || "",
      price: ticketType.price,
      maxQuantity: ticketType.maxQuantity,
      sortOrder: ticketType.sortOrder,
      benefits: ticketType.benefits || [],
    });
    setEditingId(ticketType._id);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Feil",
        description: "Billett-type må ha et navn",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingId) {
        // Update existing
        await updateTicketType({
          ticketTypeId: editingId,
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          price: formData.price,
          currency: eventCurrency,
          maxQuantity: formData.maxQuantity,
          sortOrder: formData.sortOrder,
          benefits: formData.benefits.length > 0 ? formData.benefits : undefined,
        });
        toast({
          title: "Oppdatert",
          description: "Billett-type er oppdatert",
        });
      } else {
        // Create new
        await createTicketType({
          eventId,
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          price: formData.price,
          currency: eventCurrency,
          maxQuantity: formData.maxQuantity,
          sortOrder: formData.sortOrder,
          benefits: formData.benefits.length > 0 ? formData.benefits : undefined,
        });
        toast({
          title: "Opprettet",
          description: "Ny billett-type er lagt til",
        });
      }
      resetForm();
    } catch (error) {
      console.error("Failed to save ticket type:", error);
      toast({
        title: "Feil",
        description: "Kunne ikke lagre billett-type",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (ticketTypeId: Id<"ticketTypes">) => {
    if (!confirm("Er du sikker på at du vil slette denne billett-typen?")) {
      return;
    }

    try {
      await deleteTicketType({ ticketTypeId });
      toast({
        title: "Slettet",
        description: "Billett-type er fjernet",
      });
    } catch (error) {
      console.error("Failed to delete ticket type:", error);
      toast({
        title: "Feil",
        description: "Kunne ikke slette billett-type",
        variant: "destructive",
      });
    }
  };

  const addBenefit = () => {
    setFormData(prev => ({
      ...prev,
      benefits: [...prev.benefits, ""],
    }));
  };

  const updateBenefit = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.map((benefit, i) => i === index ? value : benefit),
    }));
  };

  const removeBenefit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Billett-typer</h3>
          <p className="text-sm text-muted-foreground">
            Definer forskjellige typer billetter med ulike priser og fordeler
          </p>
        </div>
        <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
          <Plus className="mr-2 h-4 w-4" />
          Legg til type
        </Button>
      </div>

      {/* Existing Ticket Types */}
      <div className="space-y-4">
        {ticketTypes.map((ticketType) => (
          <Card key={ticketType._id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-base">{ticketType.name}</CardTitle>
                  {ticketType.isSoldOut && (
                    <Badge variant="destructive">Utsolgt</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startEditing(ticketType)}
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(ticketType._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {ticketType.description && (
                <p className="text-sm text-muted-foreground">{ticketType.description}</p>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span>{formatPrice(ticketType.price, safeCurrencyCode(ticketType.currency))}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span>{ticketType.availableQuantity} / {ticketType.maxQuantity} igjen</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-orange-600" />
                  <span>{ticketType.soldQuantity} solgt</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Rekkefølge:</span>
                  <span>{ticketType.sortOrder}</span>
                </div>
              </div>

              {ticketType.benefits && ticketType.benefits.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Fordeler:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {ticketType.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {editingId ? "Rediger billett-type" : "Ny billett-type"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Navn *</Label>
                <Input
                  id="name"
                  placeholder="f.eks. VIP, Early Bird, Standing"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Pris</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0"
                  value={formData.price / 100} // Convert from øre to currency units
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    price: Math.round(Number(e.target.value) * 100)
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxQuantity">Maks antall</Label>
                <Input
                  id="maxQuantity"
                  type="number"
                  placeholder="50"
                  value={formData.maxQuantity}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    maxQuantity: Number(e.target.value)
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sortOrder">Rekkefølge</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  placeholder="0"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    sortOrder: Number(e.target.value)
                  }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Beskrivelse (valgfritt)</Label>
              <Textarea
                id="description"
                placeholder="Beskriv denne billett-typen..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            {/* Benefits */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Fordeler (valgfritt)</Label>
                <Button type="button" size="sm" variant="outline" onClick={addBenefit}>
                  <Plus className="h-4 w-4 mr-2" />
                  Legg til fordel
                </Button>
              </div>

              {formData.benefits.map((benefit, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="f.eks. VIP access, Free drink"
                    value={benefit}
                    onChange={(e) => updateBenefit(index, e.target.value)}
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => removeBenefit(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={resetForm}>
                Avbryt
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                {editingId ? "Oppdater" : "Lagre"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {ticketTypes.length === 0 && !isAdding && (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Ingen billett-typer ennå</h3>
            <p className="text-muted-foreground mb-4">
              Legg til forskjellige typer billetter med ulike priser og fordeler
            </p>
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Opprett første billett-type
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
