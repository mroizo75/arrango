"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { SellerTicketsTable } from "./SellerTicketsTable";
import Spinner from "./Spinner";

type TicketData = {
  ticketId: string;
  userId: string;
  eventName: string;
  customerName: string;
  customerEmail: string;
  amount: string;
  status: string;
  purchasedAt: number;
  isVip: boolean;
};

type TicketsQueryResult = {
  data: TicketData[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export function SellerTicketsClientWrapper() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Use Convex queries for real-time data
  const ticketsQuery = useQuery(
    api.tickets.getSellerTicketsPaginated,
    pageSize > 0 ? { page, pageSize } : "skip"
  );

  const [data, setData] = useState<TicketsQueryResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (ticketsQuery !== undefined) {
      setData(ticketsQuery);
      setIsLoading(false);
    }
  }, [ticketsQuery]);

  const handleRefresh = () => {
    setIsLoading(true);
    // Force re-query by temporarily setting to undefined
    setTimeout(() => setIsLoading(false), 100);
  };

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Billetter</h1>
          <p className="text-muted-foreground">
            Oversikt over alle solgte billetter til dine arrangementer
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Oppdater
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Solgte billetter</CardTitle>
          <CardDescription>
            {data.totalCount} billett{data.totalCount !== 1 ? "er" : ""} totalt
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SellerTicketsTable
            data={data.data}
            page={data.page}
            totalPages={data.totalPages}
            hasNextPage={data.hasNextPage}
            hasPreviousPage={data.hasPreviousPage}
            onPageChange={setPage}
          />

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Viser {data.data.length} av {data.totalCount} billetter
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={!data.hasPreviousPage}
              >
                <ChevronLeft className="h-4 w-4" />
                Forrige
              </Button>
              <span className="text-sm">
                Side {data.page} av {data.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={!data.hasNextPage}
              >
                Neste
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

