import { NextRequest, NextResponse } from "next/server";
import { getConvexClient } from "@/lib/convex";
import { api } from "@/convex/_generated/api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID required" },
        { status: 400 }
      );
    }

    const convex = getConvexClient();

    // Get all tickets for the user within date range
    const tickets = await convex.query(api.tickets.getSellerTicketsForExport, {
      userId,
      startDate: startDate ? new Date(startDate).getTime() : undefined,
      endDate: endDate ? new Date(endDate).getTime() : undefined,
    });

    // Generate CSV content
    const csvHeaders = [
      "Dato",
      "Arrangement",
      "Billett type",
      "Kundenavn",
      "E-post",
      "Beløp (NOK)",
      "Status",
      "Stripe Payment ID",
      "Fiken Faktura ID"
    ];

    const csvRows = tickets.map((ticket) => [
      new Date(ticket.purchasedAt).toLocaleDateString("nb-NO"),
      ticket.eventName,
      ticket.ticketTypeName || "Standard",
      ticket.customerName,
      ticket.customerEmail,
      (ticket.amount / 100).toFixed(2), // Convert from øre to NOK
      ticket.status,
      ticket.paymentIntentId || "",
      ticket.fikenInvoiceNumber || ""
    ]);

    const csvContent = [
      csvHeaders.join(","),
      ...csvRows.map(row => row.map(field => `"${field}"`).join(","))
    ].join("\n");

    // Return CSV file
    const response = new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="regnskapsrapport-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });

    return response;
  } catch (error) {
    console.error("Export accounting error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
