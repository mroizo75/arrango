"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import axios from "axios";
import { api } from "./_generated/api";

// Fiken API configuration
const FIKEN_BASE_URL = "https://api.fiken.no/api/v2";

// Interface for Fiken credentials stored in database
export interface FikenCredentials {
  companySlug: string;
  accessToken: string;
  refreshToken?: string;
  tokenExpiresAt?: number;
}

export const testFikenConnection = action({
  args: { userId: v.string() },
  handler: async (ctx, { userId }): Promise<any> => {
    const credentials = await ctx.runQuery(api.fikenQueries.getFikenCredentials, { userId });

    if (!credentials) {
      return { success: false, error: "Fiken credentials not found" };
    }

    try {
      const response = await axios.get(
        `${FIKEN_BASE_URL}/companies/${credentials.companySlug}`,
        {
          headers: {
            "Authorization": `Bearer ${credentials.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      return {
        success: true,
        company: response.data,
      };
    } catch (error) {
      console.error("Fiken API error:", error);
      return {
        success: false,
        error: (error as any).response?.data?.message || (error as any).message,
      };
    }
  },
});

export const createFikenInvoice = action({
  args: {
    userId: v.string(),
    ticketId: v.id("tickets"),
  },
  handler: async (ctx, { userId, ticketId }): Promise<any> => {
    // Get credentials
    const credentials = await ctx.runQuery(api.fikenQueries.getFikenCredentials, { userId });
    if (!credentials) {
      throw new Error("Fiken credentials not found");
    }

    // Get ticket with details
    const ticket = await ctx.runQuery(api.tickets.getTicketById, { ticketId });
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    // Get event
    const event = await ctx.runQuery(api.events.getById, { eventId: ticket.eventId });
    if (!event) {
      throw new Error("Event not found");
    }

    // Get user
    const user = await ctx.runQuery(api.users.getUserById, { userId: ticket.userId });
    if (!user) {
      throw new Error("User not found");
    }

    // Get ticket type name from ticket data
    const ticketTypeName = ticket.ticketTypeName;

    try {
      // Create invoice in Fiken
      const invoiceData = {
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days
        customerId: await getOrCreateFikenCustomer(credentials, user),
        lines: [{
          description: `${event.name} - ${ticketTypeName || 'Billett'}`,
          vat: 0, // Assuming ticket sales are VAT exempt in Norway for cultural events
          unitPrice: ticket.amount / 100, // Convert from øre to NOK
          quantity: 1,
        }],
      };

      const response = await axios.post(
        `${FIKEN_BASE_URL}/companies/${credentials.companySlug}/invoices`,
        invoiceData,
        {
          headers: {
            "Authorization": `Bearer ${credentials.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Store invoice reference in our database
      await ctx.runMutation(api.fikenMutations.saveFikenInvoice, {
        ticketId: ticketId,
        fikenInvoiceId: response.data.invoiceId,
        fikenInvoiceNumber: response.data.invoiceNumber,
      });

      return {
        success: true,
        invoiceId: response.data.invoiceId,
        invoiceNumber: response.data.invoiceNumber,
      };
    } catch (error) {
      console.error("Fiken invoice creation error:", error);
      return {
        success: false,
        error: (error as any).response?.data?.message || (error as any).message,
      };
    }
  },
});

// Helper function to get or create customer in Fiken
async function getOrCreateFikenCustomer(credentials: FikenCredentials, user: any) {
  try {
    // Try to find existing customer by email
    const searchResponse = await axios.get(
      `${FIKEN_BASE_URL}/companies/${credentials.companySlug}/contacts`,
      {
        headers: {
          "Authorization": `Bearer ${credentials.accessToken}`,
          "Content-Type": "application/json",
        },
        params: {
          email: user.email,
        },
      }
    );

    if (searchResponse.data.length > 0) {
      return searchResponse.data[0].contactId;
    }

    // Create new customer
    const customerData = {
      name: user.name || user.email,
      email: user.email,
      address: {
        address1: user.address || "",
        city: user.city || "",
        country: "Norway",
      },
    };

    const createResponse = await axios.post(
      `${FIKEN_BASE_URL}/companies/${credentials.companySlug}/contacts`,
      customerData,
      {
        headers: {
          "Authorization": `Bearer ${credentials.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return createResponse.data.contactId;
  } catch (error) {
    console.error("Fiken customer creation error:", error);
    throw new Error("Failed to create/find customer in Fiken");
  }
}
