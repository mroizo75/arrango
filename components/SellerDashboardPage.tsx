'use client'

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Chart } from "@/components/ui/chart";
import Link from "next/link";
import {
  ArrowUpRight,
  Users,
  Ticket,
  Wallet,
  TrendingUp,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type OverviewData = {
  totalEvents: number;
  activeEvents: number;
  upcomingEvents: number;
  soldTickets: number;
  refundedTickets: number;
  revenue: string;
  averageRevenuePerTicket: string;
};

export type SellerDashboardCustomers = {
  data: Array<{
    ticketId: string;
    customerName: string;
    customerEmail: string;
    eventName: string;
    amount: string;
    status: string;
    purchasedAt: number;
  }>;
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

type TrendPoint = {
  date: string;
  tickets: number;
  revenue: string;
};

type EventPerformance = {
  eventId: string;
  name: string;
  soldTickets: number;
  revenue: string;
};

type SellerDashboardPageProps = {
  overview: OverviewData;
  customers: SellerDashboardCustomers;
  salesTrend: TrendPoint[];
  eventPerformance: EventPerformance[];
  currentPage: number;
};

export function SellerDashboardPage({
  overview,
  customers,
  salesTrend,
  eventPerformance,
  currentPage,
}: SellerDashboardPageProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Omsetning"
          value={overview.revenue}
          description="Total omsetning fra billetter"
          icon={<Wallet className="h-5 w-5 text-blue-600" />}
        />
        <StatsCard
          title="Solgte billetter"
          value={`${overview.soldTickets}`}
          description={`${overview.refundedTickets} refundert`}
          icon={<Ticket className="h-5 w-5 text-green-600" />}
        />
        <StatsCard
          title="Aktive events"
          value={`${overview.activeEvents}`}
          description={`${overview.totalEvents} events totalt`}
          icon={<Users className="h-5 w-5 text-purple-600" />}
        />
        <StatsCard
          title="Gj.snitt pris"
          value={overview.averageRevenuePerTicket}
          description="På tvers av aktive events"
          icon={<TrendingUp className="h-5 w-5 text-amber-600" />}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-lg font-semibold">
                Salg siste 14 dager
              </CardTitle>
              <CardDescription>Billetter og omsetning per dag</CardDescription>
            </div>
            <Button variant="outline" asChild>
              <Link href="/seller/events">Administrer events</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Chart
              type="area"
              data={salesTrend}
              config={{
                xKey: "date",
                areas: [
                  {
                    key: "tickets",
                    color: "#2563eb",
                    name: "Billetter",
                    fill: "#2563eb",
                  },
                  {
                    key: "revenue",
                    color: "#22c55e",
                    name: "Omsetning",
                    fill: "#22c55e",
                  },
                ],
                yLabel: "Salg",
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">
              Bestselgere
            </CardTitle>
            <CardDescription>Topp events basert på billetter</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {eventPerformance.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Ingen data å vise ennå.
              </p>
            ) : (
              eventPerformance.map((event) => (
                <div
                  key={event.eventId}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {event.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {event.soldTickets} billetter
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {event.revenue}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Kunder</CardTitle>
            <CardDescription>
              Viser {customers.data.length} av {customers.totalCount} siste kjøpere
            </CardDescription>
          </div>
          <Button variant="secondary" asChild>
            <Link href="/seller/customers">
              Se alle kunder
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kunde</TableHead>
                <TableHead>E-post</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Beløp</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Dato</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Ingen kunder ennå
                  </TableCell>
                </TableRow>
              ) : (
                customers.data.map((row) => (
                  <TableRow key={row.ticketId}>
                    <TableCell className="font-medium">
                      {row.customerName}
                    </TableCell>
                    <TableCell>{row.customerEmail}</TableCell>
                    <TableCell>{row.eventName}</TableCell>
                    <TableCell>{row.amount}</TableCell>
                    <TableCell>
                      <StatusBadge status={row.status} />
                    </TableCell>
                    <TableCell>
                      {new Date(row.purchasedAt).toLocaleString("nb-NO")}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Side {customers.page} av {customers.totalPages}
            </span>
            <div className="flex items-center gap-2">
              <PageLink
                direction="previous"
                disabled={!customers.hasPreviousPage}
                page={currentPage - 1}
              />
              <PageLink
                direction="next"
                disabled={!customers.hasNextPage}
                page={currentPage + 1}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Stripe Connect dashboard</CardTitle>
          <CardDescription>
            Gå til Stripe for utbetalinger, detaljerte rapporter og kundeservice.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild size="lg" className="gap-2">
            <Link href="/seller/stripe-dashboard">
              Åpne Stripe-dashboard
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function StatsCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  const variant =
    normalized === "valid" || normalized === "used"
      ? "default"
      : normalized === "refunded"
        ? "secondary"
        : "outline";

  const label =
    normalized === "valid"
      ? "Gyldig"
      : normalized === "used"
        ? "Brukt"
        : normalized === "refunded"
          ? "Refundert"
          : normalized;

  return <Badge variant={variant}>{label}</Badge>;
}

function PageLink({
  direction,
  disabled,
  page,
}: {
  direction: "previous" | "next";
  disabled: boolean;
  page: number;
}) {
  const label = direction === "previous" ? "Forrige" : "Neste";
  return (
    <Button variant="outline" size="sm" asChild disabled={disabled}>
      <Link
        href={disabled ? "#" : `/seller?page=${page}`}
        aria-disabled={disabled}
        className={cn(disabled && "pointer-events-none text-muted-foreground")}
      >
        {label}
      </Link>
    </Button>
  );
}

