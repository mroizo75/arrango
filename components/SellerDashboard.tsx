"use client";
import { createStripeConnectAccountLink } from "@/app/actions/createStripeConnectAccountLink";
import { createStripeConnectCustomer } from "@/app/actions/createStripeConnectCustomer";
import { api } from "@/convex/_generated/api";
import { useSession } from "next-auth/react";
import { useQuery } from "convex/react";

import { useRouter } from "next/navigation";
import React, { useState, useEffect, useCallback } from "react";
import { createStripeConnectLoginLink } from "@/app/actions/createStripeConnectLoginLink";
import { getStripeConnectAccountStatus } from "@/app/actions/getStripeConnectAccountStatus";
import type { AccountStatus } from "@/app/actions/getStripeConnectAccountStatus";
import { CalendarDays, Cog, Plus, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import Spinner from "./Spinner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SellerDashboard() {
  const [accountCreatePending, setAccountCreatePending] = useState(false);
  const [accountLinkCreatePending, setAccountLinkCreatePending] =
    useState(false);
  const [error, setError] = useState(false);
  const [accountStatus, setAccountStatus] = useState<AccountStatus | null>(
    null
  );
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  const stripeConnectId = useQuery(api.users.getUsersStripeConnectId, {
    userId: user?.id || "",
  });

  const fetchAccountStatus = useCallback(async () => {
    if (!stripeConnectId) return;

    try {
      const status = await getStripeConnectAccountStatus(stripeConnectId);
      setAccountStatus(status);
    } catch (error) {
      console.error("Error fetching account status:", error);
    }
  }, [stripeConnectId]);

  const isReadyToAcceptPayments =
    accountStatus?.isActive && accountStatus?.payoutsEnabled;

  useEffect(() => {
    if (stripeConnectId) {
      fetchAccountStatus();
    }
  }, [stripeConnectId, fetchAccountStatus]);

  if (stripeConnectId === undefined) {
    return <Spinner />;
  }

  const handleManageAccount = async () => {
    try {
      if (stripeConnectId && accountStatus?.isActive) {
        const loginUrl = await createStripeConnectLoginLink(stripeConnectId);
        window.location.href = loginUrl;
      }
    } catch (error) {
      console.error("Error accessing Stripe Connect portal:", error);
      setError(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header Card */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white border-0">
        <CardHeader>
          <CardTitle className="text-2xl">Seller Dashboard</CardTitle>
          <CardDescription className="text-blue-100">
            Manage your seller profile and payment settings
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Main Content */}
      {isReadyToAcceptPayments && (
        <Card>
          <CardHeader>
            <CardTitle>Sell tickets for your events</CardTitle>
            <CardDescription>
              List your tickets for sale and manage your listings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center gap-4">
              <Button asChild>
                <Link href="/seller/new-event">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Event
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/seller/events">
                  <CalendarDays className="w-4 h-4 mr-2" />
                  View My Events
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Account Creation Section */}
      {!stripeConnectId && !accountCreatePending && (
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Start Accepting Payments</CardTitle>
            <CardDescription>
              Create your seller account to start receiving payments securely through Stripe
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button
              onClick={async () => {
                setAccountCreatePending(true);
                setError(false);
                try {
                  await createStripeConnectCustomer();
                  setAccountCreatePending(false);
                } catch (error) {
                  console.error("Error creating Stripe Connect customer:", error);
                  setError(true);
                  setAccountCreatePending(false);
                }
              }}
              className="w-full"
            >
              Create Seller Account
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Account Status Section */}
      {stripeConnectId && accountStatus && (
        <div className="space-y-6">
          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Account Status Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Account Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full mr-2 ${
                      accountStatus.isActive ? "bg-green-500" : "bg-yellow-500"
                    }`}
                  />
                  <Badge variant={accountStatus.isActive ? "default" : "secondary"}>
                    {accountStatus.isActive ? "Active" : "Pending Setup"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Payments Status Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Payment Capability
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center">
                  {accountStatus.chargesEnabled ? (
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 mr-2 text-gray-400" />
                  )}
                  <span className="text-sm">
                    {accountStatus.chargesEnabled
                      ? "Can accept payments"
                      : "Cannot accept payments yet"}
                  </span>
                </div>
                <div className="flex items-center">
                  {accountStatus.payoutsEnabled ? (
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 mr-2 text-gray-400" />
                  )}
                  <span className="text-sm">
                    {accountStatus.payoutsEnabled
                      ? "Can receive payouts"
                      : "Cannot receive payouts yet"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Requirements Section */}
          {accountStatus.requiresInformation && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertCircle className="h-4 w-4 text-yellow-800" />
              <AlertDescription className="text-yellow-800">
                <div className="space-y-2">
                  <p className="font-medium">Required Information</p>

                  {accountStatus.requirements.currently_due.length > 0 && (
                    <div>
                      <p className="font-medium mb-1">Action Required:</p>
                      <ul className="list-disc pl-5 text-sm">
                        {accountStatus.requirements.currently_due.map((req) => (
                          <li key={req}>{req.replace(/_/g, " ")}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {accountStatus.requirements.eventually_due.length > 0 && (
                    <div>
                      <p className="font-medium mb-1">Eventually Needed:</p>
                      <ul className="list-disc pl-5 text-sm">
                        {accountStatus.requirements.eventually_due.map((req) => (
                          <li key={req}>{req.replace(/_/g, " ")}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {!accountLinkCreatePending && (
                    <Button
                      onClick={async () => {
                        setAccountLinkCreatePending(true);
                        setError(false);
                        try {
                          const { url } = await createStripeConnectAccountLink(
                            stripeConnectId
                          );
                          router.push(url);
                        } catch (error) {
                          console.error(
                            "Error creating Stripe Connect account link:",
                            error
                          );
                          setError(true);
                        }
                        setAccountLinkCreatePending(false);
                      }}
                      className="mt-3 bg-yellow-600 hover:bg-yellow-700"
                    >
                      Complete Requirements
                    </Button>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-3">
                {accountStatus.isActive && (
                  <Button onClick={handleManageAccount}>
                    <Cog className="w-4 h-4 mr-2" />
                    Seller Dashboard
                  </Button>
                )}
                <Button variant="outline" onClick={fetchAccountStatus}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Status
                </Button>
              </div>

              {error && (
                <Alert className="mt-4 border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-800" />
                  <AlertDescription className="text-red-800">
                    Unable to access Stripe dashboard. Please complete all requirements first.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Loading States */}
      {accountCreatePending && (
        <Card>
          <CardContent className="text-center py-8">
            <div className="flex items-center justify-center">
              <Spinner />
              <span className="ml-2">Creating your seller account...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {accountLinkCreatePending && (
        <Card>
          <CardContent className="text-center py-8">
            <div className="flex items-center justify-center">
              <Spinner />
              <span className="ml-2">Preparing account setup...</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
