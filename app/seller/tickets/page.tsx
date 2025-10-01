import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getSellerDashboardData } from "@/app/actions/getSellerDashboardData";
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

function statusLabel(status: string) {
  const s = status.toLowerCase();
  if (s === "valid") return "Gyldig";
  if (s === "used") return "Brukt";
  if (s === "refunded") return "Refundert";
  if (s === "cancelled") return "Kansellert";
  return status;
}

export default async function SellerTicketsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const params = (await searchParams) ?? {};
  const pageParam = params.page;
  const page = Array.isArray(pageParam)
    ? parseInt(pageParam[0] ?? "1", 10)
    : parseInt((pageParam as string) ?? "1", 10);

  const data = await getSellerDashboardData({
    userId,
    page: Number.isNaN(page) || page < 1 ? 1 : page,
  });

  const { customersFormatted } = data;

  return (
    <div className="space-y-6 p-8">
      <Card>
        <CardHeader>
          <CardTitle>Billetter</CardTitle>
          <CardDescription>
            Oversikt over alle kunder og billetter. VIP-billetter er sponsede og tas ikke med i regnskap.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
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
                {customersFormatted.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      Ingen billetter funnet
                    </TableCell>
                  </TableRow>
                ) : (
                  customersFormatted.data.map((row) => (
                    <TableRow key={row.ticketId}>
                      <TableCell className="font-medium">{row.customerName}</TableCell>
                      <TableCell>{row.customerEmail}</TableCell>
                      <TableCell>{row.eventName}</TableCell>
                      <TableCell>{row.amount}</TableCell>
                      <TableCell>
                        <Badge variant={row.status === "refunded" ? "secondary" : "default"}>
                          {statusLabel(row.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(row.purchasedAt).toLocaleString("nb-NO")}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <p>
              Side {customersFormatted.page} av {customersFormatted.totalPages}
            </p>
            <p>
              {customersFormatted.totalCount} {customersFormatted.totalCount === 1 ? "billett" : "billetter"} totalt
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}