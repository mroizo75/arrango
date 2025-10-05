'use client';

import { useSession } from "next-auth/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Header from "./Header";

export default function HeaderWrapper() {
  const { data: session } = useSession();
  
  // Check if user has events
  const events = useQuery(api.events.getSellerEvents, {
    userId: session?.user?.id ?? "",
  });

  // Check if user is an organizer in Convex
  const organizerProfile = useQuery(
    api.organizerProfile.getOrganizerProfileByUserId,
    session?.user?.id ? { userId: session.user.id } : "skip"
  );

  // User is a seller if they have events OR if they're an organizer
  const isSeller = (events && events.length > 0) || (organizerProfile?.isOrganizer === true);

  return <Header isSeller={isSeller} />;
}