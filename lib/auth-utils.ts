import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

// Helper function to get session on server side
export async function getAuthSession() {
  return await getServerSession(authOptions);
}

// Helper to get userId from session or throw error
export async function requireAuth() {
  const session = await getAuthSession();
  
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }
  
  return session.user;
}
