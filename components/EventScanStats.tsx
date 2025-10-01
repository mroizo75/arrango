"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertCircle, Users, Ticket } from "lucide-react";
import Spinner from "./Spinner";

export function EventScanStats({ eventId }: { eventId: Id<"events"> }) {
  const stats = useQuery(api.ticketScanning.getEventScanStats, { eventId });
  const scans = useQuery(api.ticketScanning.getEventScans, { eventId });

  if (stats === undefined || scans === undefined) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Kunne ikke laste statistikk</p>
      </div>
    );
  }

  const scanPercentage =
    stats.validTickets > 0
      ? Math.round((stats.scannedTickets / stats.validTickets) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totalt billetter</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTickets}</div>
            <p className="text-xs text-muted-foreground">
              {stats.refundedTickets} refundert
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scannede</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.scannedTickets}
            </div>
            <p className="text-xs text-muted-foreground">
              {scanPercentage}% av gyldige
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ikke scannet</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.unscannedTickets}
            </div>
            <p className="text-xs text-muted-foreground">Venter på inngang</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ugyldige forsøk</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.invalidScans + stats.alreadyScannedAttempts}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.alreadyScannedAttempts} allerede scannet
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Scan History */}
      <Card>
        <CardHeader>
          <CardTitle>Scan-historikk</CardTitle>
          <CardDescription>
            Siste {scans.length} scan-forsøk for dette eventet
          </CardDescription>
        </CardHeader>
        <CardContent>
          {scans.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Ingen billetter er scannet ennå</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tidspunkt</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Billettinnehaver</TableHead>
                    <TableHead>E-post</TableHead>
                    <TableHead>Billett-ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scans.map((scan) => (
                    <TableRow key={scan._id}>
                      <TableCell className="font-medium">
                        {new Date(scan.scannedAt).toLocaleString("nb-NO")}
                      </TableCell>
                      <TableCell>
                        {scan.scanResult === "valid" && (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Gyldig
                          </Badge>
                        )}
                        {scan.scanResult === "already_scanned" && (
                          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                            <AlertCircle className="mr-1 h-3 w-3" />
                            Allerede scannet
                          </Badge>
                        )}
                        {scan.scanResult === "invalid" && (
                          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                            <XCircle className="mr-1 h-3 w-3" />
                            Ugyldig
                          </Badge>
                        )}
                        {scan.scanResult === "cancelled" && (
                          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                            <XCircle className="mr-1 h-3 w-3" />
                            Kansellert
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {scan.ticketHolder?.name || "Ukjent"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {scan.ticketHolder?.email || "-"}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {scan.ticketId.substring(0, 8)}...
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

