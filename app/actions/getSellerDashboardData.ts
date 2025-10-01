
import { api } from "@/convex/_generated/api";
import { getConvexClient } from "@/lib/convex";

const NOK_FORMAT = new Intl.NumberFormat("nb-NO", {
  style: "currency",
  currency: "NOK",
  minimumFractionDigits: 0,
});

function formatNok(amount: number | undefined) {
  return NOK_FORMAT.format((amount ?? 0) / 100);
}

type Overview = {
  totalEvents: number;
  activeEvents: number;
  upcomingEvents: number;
  soldTickets: number;
  refundedTickets: number;
  revenue: string;
  averageRevenuePerTicket: string;
};

type CustomerRow = {
  ticketId: string;
  customerName: string;
  customerEmail: string;
  eventName: string;
  amount: number;
  status: string;
  purchasedAt: number;
  isVip?: boolean;
};

 type CustomerRowFormatted = Omit<CustomerRow, "amount"> & {
  amount: string;
};

type Customers = {
  data: CustomerRow[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

type CustomersFormatted = {
  data: CustomerRowFormatted[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

type SalesTrendPoint = {
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

type CustomersLight = Array<{
  userId: string;
  name: string;
  email: string;
  phone?: string;
}>;

export type SellerDashboardData = {
  overview: Overview;
  customers: Customers;
  customersFormatted: CustomersFormatted;
  salesTrend: SalesTrendPoint[];
  eventPerformance: EventPerformance[];
  customersLight: CustomersLight;
};

export async function getSellerDashboardData({
  userId,
  page = 1,
}: {
  userId: string;
  page?: number;
}): Promise<SellerDashboardData> {
  const convex = getConvexClient();

  const [overviewRaw, customers, salesTrendRaw, eventPerformanceRaw, customersLightRaw] =
    await Promise.all([
      convex.query(api.sellerDashboard.getOverview, { userId }),
      convex.query(api.sellerDashboard.getCustomers, { userId, page }),
      convex.query(api.sellerDashboard.getSalesTrend, { userId }),
      convex.query(api.sellerDashboard.getEventPerformance, { userId }),
      convex.query(api.sellerDashboard.getCustomersLight, { userId }),
    ]);

  const overview: Overview = {
    totalEvents: overviewRaw.totalEvents,
    activeEvents: overviewRaw.activeEvents,
    upcomingEvents: overviewRaw.upcomingEvents,
    soldTickets: overviewRaw.soldTickets,
    refundedTickets: overviewRaw.refundedTickets,
    revenue: formatNok(overviewRaw.revenue),
    averageRevenuePerTicket: formatNok(overviewRaw.averageRevenuePerTicket),
  };

  const customersFormatted: CustomersFormatted = {
    ...customers,
    data: customers.data.map((ticket) => ({
      ...ticket,
      amount: formatNok(ticket.amount),
    })),
  };

  const salesTrend: SalesTrendPoint[] = salesTrendRaw.map((point) => ({
    ...point,
    revenue: formatNok(point.revenue),
  }));

  const eventPerformance: EventPerformance[] = eventPerformanceRaw.map((event) => ({
    ...event,
    revenue: formatNok(event.revenue),
  }));

  const customersLight: CustomersLight = customersLightRaw.map((customer) => ({
    ...customer,
    phone: customer.phone ?? "-",
  }));

  return {
    overview,
    customers,
    customersFormatted,
    salesTrend,
    eventPerformance,
    customersLight,
  };
}

