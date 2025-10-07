"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";

export default function MigrateTicketTypesPage() {
  const [result, setResult] = useState<{
    totalEvents: number;
    eventsWithoutTicketTypes: number;
    ticketTypesCreated: number;
    errors?: string[];
  } | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createDefaultTicketTypes = useMutation(api.events.createDefaultTicketTypes);

  const handleMigration = async () => {
    setIsRunning(true);
    setError(null);
    try {
      const migrationResult = await createDefaultTicketTypes();
      setResult(migrationResult);
    } catch (err: any) {
      console.error("Migration failed:", err);
      setError(err.message || "En ukjent feil oppstod");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Migrer ticket types</CardTitle>
            <CardDescription>
              Oppretter standard ticket types for eventer som ikke har noen
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-900 font-semibold mb-1">Feil under migrasjon:</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {!result ? (
              <Button 
                onClick={handleMigration} 
                disabled={isRunning}
                className="w-full"
              >
                {isRunning && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isRunning ? "Kjører migrasjon..." : "Kjør migrasjon"}
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-6 h-6" />
                  <span className="font-semibold">Migrasjon fullført!</span>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Totalt antall eventer:</span>
                    <span className="font-semibold">{result.totalEvents}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Eventer uten ticket types:</span>
                    <span className="font-semibold">{result.eventsWithoutTicketTypes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Ticket types opprettet:</span>
                    <span className="font-semibold text-green-600">{result.ticketTypesCreated}</span>
                  </div>
                </div>

                {result.errors && result.errors.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-900 font-semibold mb-2">
                      Advarsler ({result.errors.length}):
                    </p>
                    <ul className="text-yellow-700 text-sm space-y-1 max-h-40 overflow-y-auto">
                      {result.errors.map((err, i) => (
                        <li key={i} className="break-all">• {err}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <Button 
                  onClick={() => window.location.href = "/"}
                  variant="outline"
                  className="w-full"
                >
                  Tilbake til forsiden
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
