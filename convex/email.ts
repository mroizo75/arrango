"use node";

import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { Resend } from "resend";
import { v } from "convex/values";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const sendTicketEmail = action({
  args: {
    ticketId: v.id("tickets"),
    recipientEmail: v.string(),
    recipientName: v.optional(v.string()),
  },
  handler: async (ctx, { ticketId, recipientEmail, recipientName }) => {
    if (!resend) {
      console.warn("Resend API key not configured, skipping email send");
      return { success: false, error: "Email service not configured" };
    }
    // Get ticket details
    const ticket = await ctx.runQuery(api.tickets.getTicketById, { ticketId });
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    // Get event details
    const event = await ctx.runQuery(api.events.getById, { eventId: ticket.eventId });
    if (!event) {
      throw new Error("Event not found");
    }

    // Get organizer details
    const organizer = await ctx.runQuery(api.users.getUserById, { userId: event.userId });

    const ticketUrl = `${process.env.NEXT_PUBLIC_APP_URL}/tickets/${ticketId}`;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Din billett til ${event.name}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb;">Din billett er klar!</h1>

            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="margin-top: 0;">${event.name}</h2>
              <p><strong>Dato:</strong> ${new Date(event.eventDate).toLocaleDateString('nb-NO')}</p>
              <p><strong>Sted:</strong> ${event.location}</p>
              ${event.checkInTime ? `<p><strong>Innsjekking:</strong> ${event.checkInTime}</p>` : ''}
              ${ticket.ticketTypeName ? `<p><strong>Billetttype:</strong> ${ticket.ticketTypeName}</p>` : ''}
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${ticketUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Se din billett
              </a>
            </div>

            <p>
              Denne billetten er personlig og kan ikke overføres til andre.
              Vennligst ha QR-koden klar ved ankomst.
            </p>

            ${organizer?.name ? `<p><strong>Arrangør:</strong> ${organizer.name}</p>` : ''}

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

            <p style="font-size: 14px; color: #6b7280;">
              Har du spørsmål? Kontakt arrangøren direkte.
            </p>
          </div>
        </body>
      </html>
    `;

    try {
      const result = await resend.emails.send({
        from: "Arrango <noreply@arrango.no>",
        to: recipientEmail,
        subject: `Din billett til ${event.name}`,
        html: emailHtml,
      });

      console.log("Email sent successfully:", result);
      return { success: true, emailId: result.data?.id };
    } catch (error) {
      console.error("Failed to send email:", error);
      throw new Error("Failed to send ticket email");
    }
  },
});

export const sendTicketsToRecipients = action({
  args: {
    tickets: v.array(v.object({
      ticketId: v.id("tickets"),
      recipientEmail: v.string(),
      recipientName: v.optional(v.string()),
    })),
  },
  handler: async (ctx, { tickets }): Promise<Array<{
    ticketId: string;
    success: boolean;
    emailId?: string;
    error?: string;
  }>> => {
    if (!resend) {
      console.warn("Resend API key not configured, skipping bulk email send");
      return tickets.map(ticket => ({
        ticketId: ticket.ticketId,
        success: false,
        error: "Email service not configured"
      }));
    }
    const results = [];

    for (const ticket of tickets) {
      try {
        if (ticket.recipientEmail) {
          const result: { success: boolean; emailId?: string; error?: string } = await ctx.runAction(api.email.sendTicketEmail, {
            ticketId: ticket.ticketId,
            recipientEmail: ticket.recipientEmail,
            recipientName: ticket.recipientName,
          });
          if (result.success) {
            results.push({ ticketId: ticket.ticketId, success: true, emailId: result.emailId });
          } else {
            results.push({ ticketId: ticket.ticketId, success: false, error: result.error });
          }
        } else {
          // No recipient email specified, skip
          results.push({ ticketId: ticket.ticketId, success: false, error: "No recipient email" });
        }
      } catch (error) {
        console.error(`Failed to send email for ticket ${ticket.ticketId}:`, error);
        results.push({ ticketId: ticket.ticketId, success: false, error: error instanceof Error ? error.message : "Unknown error" });
      }
    }

    return results;
  },
});
