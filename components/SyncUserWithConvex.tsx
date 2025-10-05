"use client";

import { api } from "@/convex/_generated/api";
import { useSession } from "next-auth/react";
import { useMutation } from "convex/react";
import { useEffect } from "react";

export default function SyncUserWithConvex() {
  const { data: session } = useSession();
  const updateUser = useMutation(api.users.updateUser);

  useEffect(() => {
    if (!session?.user) return;

    const syncUser = async () => {
      try {
        console.log("Syncing user with Convex:", {
          userId: session.user.id,
          isOrganizer: session.user.isOrganizer,
        });
        
        await updateUser({
          userId: session.user.id,
          name: session.user.name,
          email: session.user.email,
          isOrganizer: session.user.isOrganizer,
        });

        console.log("✅ User synced successfully");
      } catch (error) {
        console.error("❌ Error syncing user:", error);
      }
    };

    syncUser();
  }, [session, updateUser]);

  return null;
}