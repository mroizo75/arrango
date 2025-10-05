"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect } from "react";
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
  ticketTypeName: string;
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
      <div className="flex items-center justify-center py-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="px-4 py-4 lg:px-6">
        <div className="max-w-full lg:max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Billetter</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Oversikt over alle solgte billetter til dine arrangementer
                </p>
              </div>
              <Button onClick={handleRefresh} variant="outline" size="sm" className="flex-shrink-0">
                <RefreshCw className="mr-2 h-4 w-4" />
                Oppdater
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Solgte billetter</h2>
                <p className="text-sm text-gray-500">
                  {data.totalCount} billett{data.totalCount !== 1 ? "er" : ""} totalt
                </p>
              </div>

              <SellerTicketsTable
                data={data.data}
                page={data.page}
                totalPages={data.totalPages}
                hasNextPage={data.hasNextPage}
                hasPreviousPage={data.hasPreviousPage}
                onPageChange={setPage}
              />

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t">
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
                    <ChevronLeft className="h-4 w-4 sm:mr-1" />
                    <span className="hidden sm:inline">Forrige</span>
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
                    <span className="hidden sm:inline">Neste</span>
                    <ChevronRight className="h-4 w-4 sm:ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

