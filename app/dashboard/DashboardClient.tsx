"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";

interface DashboardClientProps {
  children: React.ReactNode;
}

export default function DashboardClient({ children }: DashboardClientProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  const hasCompletedOnboarding = useQuery(
    api.organizerProfile.hasCompletedOrganizerOnboarding,
    session?.user?.id ? { userId: session.user.id } : "skip"
  );

  useEffect(() => {
    if (status === "loading" || !session) return;

    const checkOnboarding = async () => {
      // Check if user is an organizer
      const isOrganizer = session.user.isOrganizer;

      console.log("Dashboard check:", { 
        isOrganizer, 
        hasCompletedOnboarding,
        userId: session.user.id 
      });

      // If organizer hasn't completed onboarding, redirect to Stripe setup
      // hasCompletedOnboarding checks if user has organizationNumber
      if (isOrganizer && hasCompletedOnboarding === false) {
        console.log("Redirecting to Stripe onboarding - missing org info");
        router.push("/dashboard/onboarding/stripe");
      } else {
        console.log("Allowing dashboard access");
        setIsChecking(false);
      }
    };

    if (hasCompletedOnboarding !== undefined) {
      checkOnboarding();
    }
  }, [session, status, hasCompletedOnboarding, router]);

  if (status === "loading" || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return <>{children}</>;
}