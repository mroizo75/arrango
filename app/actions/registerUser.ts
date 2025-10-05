"use server";

import { hash } from "bcrypt";
import { getConvexClient } from "@/lib/convex";
import { api } from "@/convex/_generated/api";

export async function registerUserAction({
  name,
  email,
  password,
  isOrganizer = false,
  organizationNumber,
  organizerName,
}: {
  name: string;
  email: string;
  password: string;
  isOrganizer?: boolean;
  organizationNumber?: string;
  organizerName?: string;
}) {
  try {
    // Hash password on server
    const hashedPassword = await hash(password, 12);

    const convex = getConvexClient();

    // Register user in Convex
    const result = await convex.mutation(api.users.registerUser, {
      name,
      email,
      hashedPassword,
      isOrganizer,
      organizationNumber,
      organizerName,
    });

    return { success: true, userId: result.userIdString };
  } catch (error: unknown) {
    console.error("Registration error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Registrering feilet" };
  }
}
