'use client';

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Header from "./Header";

export default function HeaderWrapper() {
  const { user } = useUser();
  const events = useQuery(api.events.getSellerEvents, {
    userId: user?.id ?? "",
  });

  const isSeller = events ? events.length > 0 : false;

  return <Header isSeller={isSeller} />;
}
