'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useTransition } from "react";
import { toggleTicketVip } from "@/app/actions/toggleTicketVip";

type TicketRow = {
  ticketId: string;
  eventName: string;
  customerName: string;
  customerEmail: string;
  amount: string;
  status: string;
  purchasedAt: number;
  isVip: boolean;
};

type SellerTicketsTableProps = {
  data: TicketRow[];
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange?: (nextPage: number) => void;
};

export function SellerTicketsTable({
  data,
  page,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
}: SellerTicketsTableProps) {
  const [pending, startTransition] = useTransition();

  const handleVipToggle = (ticketId: string, nextValue: boolean) => {
    startTransition(() => {
      void toggleTicketVip({ ticketId, isVip: nextValue });
    });
  };

  const goToPage = (nextPage: number) => {
    if (onPageChange) {
      onPageChange(nextPage);
    }
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Kunde</TableHead>
            <TableHead>E-post</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>Beløp</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>VIP</TableHead>
            <TableHead>Dato</TableHead>
            <TableHead className="text-right">Handlinger</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground">
                Ingen billetter funnet
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow key={row.ticketId} className={row.isVip ? "bg-blue-50/50" : undefined}>
                <TableCell className="font-medium">{row.customerName}</TableCell>
                <TableCell>{row.customerEmail}</TableCell>
                <TableCell>{row.eventName}</TableCell>
                <TableCell>{row.amount}</TableCell>
                <TableCell>
                  <Badge variant={row.status === "refunded" ? "secondary" : "default"}>
                    {statusLabel(row.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={row.isVip}
                    onCheckedChange={(checked) => handleVipToggle(row.ticketId, checked)}
                    disabled={pending}
                  />
                </TableCell>
                <TableCell>{new Date(row.purchasedAt).toLocaleString("nb-NO")}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      Send billett
                    </Button>
                    <Button variant="destructive" size="sm">
                      Fjern billett
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
        <TableCaption className="flex items-center justify-between">
          <span>
            Side {page} av {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!hasPreviousPage || pending || !onPageChange}
              onClick={() => goToPage(page - 1)}
            >
              Forrige
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!hasNextPage || pending || !onPageChange}
              onClick={() => goToPage(page + 1)}
            >
              Neste
            </Button>
          </div>
        </TableCaption>
      </Table>
    </div>
  );
}

function statusLabel(status: string) {
  const s = status.toLowerCase();
  if (s === "valid") return "Gyldig";
  if (s === "used") return "Brukt";
  if (s === "refunded") return "Refundert";
  if (s === "cancelled") return "Kansellert";
  return status;
}
