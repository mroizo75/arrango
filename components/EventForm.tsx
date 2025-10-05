"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { Id } from "@/convex/_generated/dataModel";
import { Loader2, AlertCircle, Upload, X, Calendar, MapPin, Ticket, Image as ImageIcon, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useStorageUrl } from "@/lib/hooks";
import { CURRENCIES, detectCurrencyFromLocation, safeCurrencyCode, CurrencyCode } from "@/lib/currency";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import Link from "next/link";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(1, "Arrangement navn er påkrevd"),
  description: z.string().min(1, "Beskrivelse er påkrevd"),
  location: z.string().min(1, "Sted er påkrevd"),
  eventDate: z
    .date()
    .min(
      new Date(new Date().setHours(0, 0, 0, 0)),
      "Dato må være i fremtiden"
    ),
  currency: z.string().optional(),
  price: z.number().min(0, "Pris må være 0 eller høyere"),
  totalTickets: z.number().min(1, "Må ha minst 1 billett"),
  checkInTime: z.string().optional(),
  refundPolicy: z.string().optional(),
  ageRestriction: z.string().optional(),
  dressCode: z.string().optional(),
  parkingInfo: z.string().optional(),
  additionalInfo: z.array(z.string()).optional(),
  venueDetails: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface InitialEventData {
  _id: Id<"events">;
  id?: string;
  name: string;
  description: string;
  location: string;
  eventDate: number;
  currency?: string;
  price: number;
  totalTickets: number;
  imageStorageId?: Id<"_storage">;
  checkInTime?: string;
  refundPolicy?: string;
  ageRestriction?: string;
  dressCode?: string;
  parkingInfo?: string;
  additionalInfo?: string[];
  venueDetails?: string;
}

interface EventFormProps {
  mode: "create" | "edit";
  initialData?: InitialEventData;
}

const STEPS = [
  { id: 1, name: "Grunnleggende info", icon: Calendar },
  { id: 2, name: "Billetter og pris", icon: Ticket },
  { id: 3, name: "Arrangement bilde", icon: ImageIcon },
];

export default function EventForm({ mode, initialData }: EventFormProps) {
  const { data: session } = useSession();
  const user = session?.user;
  const createEvent = useMutation(api.events.create);
  const updateEvent = useMutation(api.events.updateEvent);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const currentImageUrl = useStorageUrl(initialData?.imageStorageId);

  // Multi-step state
  const [currentStep, setCurrentStep] = useState(1);

  // Check if user has Stripe connected
  const stripeConnectId = useQuery(api.users.getUsersStripeConnectId, {
    userId: user?.id || "",
  });
  const hasStripe = !!stripeConnectId;

  // Image upload
  const imageInput = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const deleteImage = useMutation(api.storage.deleteImage);

  const [removedCurrentImage, setRemovedCurrentImage] = useState(false);

  // Calculate initial price based on Stripe availability
  const initialPrice = (() => {
    if (!initialData) return 0;
    const eventPrice = initialData.price / 100;
    // If editing and no Stripe, force price to 0
    return hasStripe ? eventPrice : 0;
  })();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      location: initialData?.location ?? "",
      eventDate: initialData ? new Date(initialData.eventDate) : new Date(),
      currency: initialData?.currency ? safeCurrencyCode(initialData.currency) : detectCurrencyFromLocation(initialData?.location ?? ""),
      price: initialPrice,
      totalTickets: initialData?.totalTickets ?? 1,
      checkInTime: initialData?.checkInTime ?? "",
      refundPolicy: initialData?.refundPolicy ?? "",
      ageRestriction: initialData?.ageRestriction ?? "",
      dressCode: initialData?.dressCode ?? "",
      parkingInfo: initialData?.parkingInfo ?? "",
      additionalInfo: initialData?.additionalInfo ?? [],
      venueDetails: initialData?.venueDetails ?? "",
    },
  });

  async function onSubmit(values: FormData) {
    if (!user?.id) return;

    // Validate Stripe requirement for paid events
    if (values.price > 0 && !hasStripe) {
      toast({
        title: "Stripe påkrevd",
        description: "Du må koble til Stripe for å selge billetter med pris.",
        variant: "destructive",
      });
      return;
    }

    startTransition(() => {
      (async () => {
        try {
          let imageStorageId: Id<"_storage"> | null = null;

          // Handle image changes
          if (selectedImage) {
            imageStorageId = await handleImageUpload(selectedImage) as Id<"_storage"> | null;
            if (mode === "edit" && !removedCurrentImage && currentImageUrl) {
              await deleteImage({ storageId: initialData!.imageStorageId! });
            }
          } else if (removedCurrentImage && mode === "edit" && initialData?.imageStorageId) {
            await deleteImage({ storageId: initialData.imageStorageId });
          } else if (mode === "edit" && initialData?.imageStorageId) {
            imageStorageId = initialData.imageStorageId;
          }

          const eventData = {
            name: values.name,
            description: values.description,
            location: values.location,
            eventDate: values.eventDate.getTime(),
            currency: values.currency || "NOK",
            price: Math.round(values.price * 100),
            totalTickets: values.totalTickets,
            checkInTime: values.checkInTime,
            refundPolicy: values.refundPolicy,
            ageRestriction: values.ageRestriction,
            dressCode: values.dressCode,
            parkingInfo: values.parkingInfo,
            additionalInfo: values.additionalInfo,
            venueDetails: values.venueDetails,
            ...(imageStorageId && { imageStorageId }),
          };

          if (mode === "create") {
            await createEvent({
              userId: user.id,
              ...eventData,
            });

            toast({
              title: "Arrangement opprettet! 🎉",
              description: "Ditt arrangement er nå publisert",
            });

            router.push(`/dashboard/events`);
          } else if (initialData) {
            await updateEvent({
              eventId: initialData._id,
              ...eventData,
            });

            toast({
              title: "Arrangement oppdatert",
              description: "Endringene dine er lagret",
            });

            router.push(`/dashboard/events`);
          }
        } catch (error) {
          console.error("Failed to handle event:", error);
          toast({
            variant: "destructive",
            title: "Noe gikk galt",
            description: "Kunne ikke lagre arrangementet. Prøv igjen.",
          });
        }
      })();
    });
  }

  async function handleImageUpload(file: File): Promise<string | null> {
    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();
      return storageId;
    } catch (error) {
      console.error("Failed to upload image:", error);
      return null;
    }
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateStep = async (step: number): Promise<boolean> => {
    if (step === 1) {
      return await form.trigger(["name", "description", "location", "eventDate"]);
    } else if (step === 2) {
      return await form.trigger(["currency", "price", "totalTickets"]);
    }
    return true;
  };

  const nextStep = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Stripe Warning */}
      {!hasStripe && mode === "create" && (
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <AlertCircle className="h-5 w-5 text-blue-600" />
          <AlertTitle className="text-blue-900">Gratis arrangementer</AlertTitle>
          <AlertDescription className="text-blue-800">
            Du har ikke koblet til Stripe ennå, så du kan bare opprette <strong>gratis arrangementer</strong>.{" "}
            <Link href="/dashboard/settings#stripe" className="underline font-medium hover:text-blue-900">
              Koble til Stripe
            </Link>{" "}
            for å selge billetter.
          </AlertDescription>
        </Alert>
      )}

      {/* Stripe Warning for Edit Mode */}
      {!hasStripe && mode === "edit" && initialData && initialData.price > 0 && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <AlertTitle className="text-red-900">Stripe kreves</AlertTitle>
          <AlertDescription className="text-red-800">
            Dette arrangementet har en pris, men du har ikke Stripe koblet til. Prisen er nå satt til <strong>gratis</strong>.{" "}
            <Link href="/dashboard/settings#stripe" className="underline font-medium hover:text-red-900">
              Koble til Stripe
            </Link>{" "}
            for å kunne selge billetter med pris.
          </AlertDescription>
        </Alert>
      )}

      {!hasStripe && mode === "edit" && initialData && initialData.price === 0 && (
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <AlertCircle className="h-5 w-5 text-blue-600" />
          <AlertTitle className="text-blue-900">Gratis arrangement</AlertTitle>
          <AlertDescription className="text-blue-800">
            Du kan kun redigere til <strong>gratis arrangementer</strong> uten Stripe.{" "}
            <Link href="/dashboard/settings#stripe" className="underline font-medium hover:text-blue-900">
              Koble til Stripe
            </Link>{" "}
            for å kunne selge billetter med pris.
          </AlertDescription>
        </Alert>
      )}

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => {
            const StepIcon = step.icon;
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all",
                      isCompleted && "bg-green-500 border-green-500 text-white",
                      isCurrent && "bg-blue-600 border-blue-600 text-white",
                      !isCompleted && !isCurrent && "bg-white border-gray-300 text-gray-400"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <StepIcon className="w-6 h-6" />
                    )}
                  </div>
                  <p
                    className={cn(
                      "mt-2 text-sm font-medium text-center",
                      isCurrent && "text-blue-600",
                      !isCurrent && "text-gray-500"
                    )}
                  >
                    {step.name}
                  </p>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "flex-1 h-1 mx-4 transition-all",
                      isCompleted ? "bg-green-500" : "bg-gray-200"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Grunnleggende info
                </CardTitle>
                <CardDescription>
                  Beskriv arrangementet ditt
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Arrangementets navn *</FormLabel>
                      <FormControl>
                        <Input placeholder="Summer Festival 2024" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Beskrivelse *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Fortell om arrangementet ditt..."
                          className="min-h-[120px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Sted *
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Oslo Spektrum" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="eventDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Dato *</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP", { locale: nb })
                                ) : (
                                  <span>Velg dato</span>
                                )}
                                <Calendar className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date(new Date().setHours(0, 0, 0, 0))
                              }
                              locale={nb}
                              weekStartsOn={1}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Pricing */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ticket className="w-5 h-5" />
                  Billetter og pris
                </CardTitle>
                <CardDescription>
                  Sett priser og antall billetter
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valuta</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || "NOK"}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Velg valuta" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(CURRENCIES).map((currency) => (
                            <SelectItem key={currency.code} value={currency.code}>
                              {currency.symbol} {currency.code}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => {
                    const selectedCurrency = form.watch("currency");
                    const currencySymbol = selectedCurrency ? CURRENCIES[selectedCurrency as CurrencyCode]?.symbol || "kr" : "kr";

                    return (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          Pris per billett *
                          {!hasStripe && (
                            <span className="text-xs font-normal text-muted-foreground">(kun gratis)</span>
                          )}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                              {currencySymbol}
                            </span>
                            <Input
                              type="number"
                              onChange={(e) => {
                                if (!hasStripe) {
                                  field.onChange(0);
                                } else {
                                  field.onChange(Number(e.target.value));
                                }
                              }}
                              value={!hasStripe ? 0 : field.value}
                              disabled={!hasStripe}
                              className="pl-8"
                              placeholder="0"
                            />
                            {!hasStripe && (
                              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                                  Gratis
                                </span>
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="totalTickets"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Antall billetter *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="100"
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {/* Step 3: Image Upload */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Arrangement bilde
                </CardTitle>
                <CardDescription>
                  Last opp et bilde som vises på arrangementet (valgfritt)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {imagePreview || (!removedCurrentImage && currentImageUrl) ? (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
                      <Image
                        src={imagePreview || currentImageUrl || ""}
                        alt="Event preview"
                        fill
                        className="object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setSelectedImage(null);
                          setImagePreview(null);
                          setRemovedCurrentImage(true);
                          if (imageInput.current) {
                            imageInput.current.value = "";
                          }
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed rounded-lg p-12 text-center hover:border-primary/50 transition-colors">
                      <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-lg font-medium mb-2">
                        Last opp arrangementsbilde
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Klikk på knappen under for å velge et bilde
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          imageInput.current?.click();
                        }}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Velg bilde
                      </Button>
                    </div>
                  )}
                  <input
                    ref={imageInput}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 pt-4">
            {currentStep > 1 && (
              <Button 
                type="button" 
                variant="outline"
                onClick={prevStep}
                size="lg"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Forrige
              </Button>
            )}
            
            {currentStep < 3 ? (
              <Button 
                type="button" 
                onClick={nextStep}
                className="flex-1"
                size="lg"
              >
                Neste
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <>
                <Button 
                  type="submit" 
                  disabled={isPending} 
                  className="flex-1" 
                  size="lg"
                >
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {mode === "create" ? "Opprett arrangement" : "Lagre endringer"}
                </Button>
                {!imagePreview && !currentImageUrl && (
                  <Button 
                    type="submit" 
                    variant="outline"
                    disabled={isPending} 
                    size="lg"
                  >
                    Hopp over bilde
                  </Button>
                )}
              </>
            )}

            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.back()} 
              size="lg"
            >
              Avbryt
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}