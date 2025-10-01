"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, XCircle, AlertCircle, Camera, CameraOff } from "lucide-react";

type ScanResult = {
  success: boolean;
  result: "valid" | "already_scanned" | "invalid" | "cancelled";
  message: string;
  ticket: {
    _id: string;
    userId: string;
    purchasedAt: number;
    status: string;
    event?: {
      name: string;
      eventDate: number;
      location: string;
    };
    holder?: {
      name: string;
      email: string;
    } | null;
  } | null;
};

export function TicketScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanResult, setLastScanResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scanTicket = useMutation(api.ticketScanning.scanTicket);

  const startScanner = async () => {
    try {
      setError(null);
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        async (decodedText) => {
          // Stop scanner temporarily to process result
          await stopScanner();

          // Try to scan the ticket
          try {
            const result = await scanTicket({
              ticketId: decodedText as Id<"tickets">,
            });

            setLastScanResult(result);

            // Auto-restart scanner after 2 seconds if successful
            if (result.success) {
              setTimeout(() => {
                startScanner();
              }, 2000);
            } else {
              // For failed scans, wait 3 seconds before restarting
              setTimeout(() => {
                startScanner();
              }, 3000);
            }
          } catch (err) {
            console.error("Scan error:", err);
            setLastScanResult({
              success: false,
              result: "invalid",
              message: "Kunne ikke scanne billett. Prøv igjen.",
              ticket: null,
            });
            setTimeout(() => {
              startScanner();
            }, 3000);
          }
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (errorMessage) => {
          // Ignore scanning errors (happens continuously while searching for QR)
        }
      );

      setIsScanning(true);
    } catch (err) {
      console.error("Failed to start scanner:", err);
      setError("Kunne ikke starte kamera. Sjekk at du har gitt tillatelse til kamera.");
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
        scannerRef.current = null;
      } catch (err) {
        console.error("Failed to stop scanner:", err);
      }
    }
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  const getResultColor = (result: ScanResult["result"]) => {
    switch (result) {
      case "valid":
        return "bg-green-50 border-green-500";
      case "already_scanned":
        return "bg-yellow-50 border-yellow-500";
      case "invalid":
      case "cancelled":
        return "bg-red-50 border-red-500";
      default:
        return "bg-gray-50 border-gray-500";
    }
  };

  const getResultIcon = (result: ScanResult["result"]) => {
    switch (result) {
      case "valid":
        return <CheckCircle2 className="w-16 h-16 text-green-600" />;
      case "already_scanned":
        return <AlertCircle className="w-16 h-16 text-yellow-600" />;
      case "invalid":
      case "cancelled":
        return <XCircle className="w-16 h-16 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Scan QR-kode</CardTitle>
          <CardDescription>
            Skann billettens QR-kode for å verifisere inngang
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Scanner Container */}
          <div className="relative">
            <div
              id="qr-reader"
              className="w-full rounded-lg overflow-hidden border-2 border-gray-200"
              style={{ minHeight: isScanning ? "300px" : "0px" }}
            />
            {!isScanning && !lastScanResult && (
              <div className="flex items-center justify-center p-12 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Klar til å scanne billetter</p>
                  <Button onClick={startScanner} size="lg">
                    <Camera className="mr-2 h-5 w-5" />
                    Start scanning
                  </Button>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {isScanning && (
            <Button onClick={stopScanner} variant="destructive" className="w-full">
              <CameraOff className="mr-2 h-5 w-5" />
              Stopp scanning
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Scan Result */}
      {lastScanResult && (
        <Card className={`border-2 ${getResultColor(lastScanResult.result)}`}>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                {getResultIcon(lastScanResult.result)}
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-2">
                  {lastScanResult.result === "valid" && "✓ Gyldig billett"}
                  {lastScanResult.result === "already_scanned" && "⚠ Allerede scannet"}
                  {lastScanResult.result === "invalid" && "✗ Ugyldig billett"}
                  {lastScanResult.result === "cancelled" && "✗ Kansellert"}
                </h3>
                <p className="text-lg text-gray-700">{lastScanResult.message}</p>
              </div>

              {lastScanResult.ticket && (
                <div className="mt-4 pt-4 border-t border-gray-200 text-left space-y-2">
                  {lastScanResult.ticket.holder && (
                    <>
                      <p className="text-sm">
                        <span className="font-medium">Billettinnehaver:</span>{" "}
                        {lastScanResult.ticket.holder.name}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">E-post:</span>{" "}
                        {lastScanResult.ticket.holder.email}
                      </p>
                    </>
                  )}
                  {lastScanResult.ticket.event && (
                    <>
                      <p className="text-sm">
                        <span className="font-medium">Event:</span>{" "}
                        {lastScanResult.ticket.event.name}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Dato:</span>{" "}
                        {new Date(lastScanResult.ticket.event.eventDate).toLocaleDateString(
                          "nb-NO"
                        )}
                      </p>
                    </>
                  )}
                  <p className="text-xs text-gray-500 break-all">
                    Billett-ID: {lastScanResult.ticket._id}
                  </p>
                </div>
              )}

              {!isScanning && (
                <Button
                  onClick={() => {
                    setLastScanResult(null);
                    startScanner();
                  }}
                  className="w-full mt-4"
                >
                  Scan neste billett
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

