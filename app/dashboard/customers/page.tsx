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
import { CustomerListTable } from "@/components/CustomerListTable";

export default async function SellerCustomersPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const data = await getSellerDashboardData({ userId });
  const { customersLight } = data;

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Kunder</h1>
        <p className="text-muted-foreground">
          Oversikt over alle kunder som har kjøpt billetter til dine eventer
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kundeliste</CardTitle>
          <CardDescription>
            {customersLight.length} kunde{customersLight.length !== 1 ? "r" : ""} totalt
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CustomerListTable customers={customersLight} />
        </CardContent>
      </Card>
    </div>
  );
}

