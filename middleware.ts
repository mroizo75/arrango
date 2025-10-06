import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Du kan legge til custom logikk her hvis nødvendig
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const path = req.nextUrl.pathname;

        // Offentlige ruter som ikke krever autentisering
        const publicRoutes = [
          "/",
          "/sign-in",
          "/sign-up",
          "/become-organizer",
          "/arrangorer",
          "/privacy",
          "/terms",
          "/cookies",
          "/search",
        ];

        // API-ruter og webhooks skal alltid være tilgjengelige
        if (
          path.startsWith("/api/webhooks") ||
          path.startsWith("/api/auth") ||
          path.startsWith("/api/image-proxy") ||
          path.startsWith("/_next") ||
          path.includes(".")
        ) {
          return true;
        }

        // Event og organizer sider er offentlige
        if (path.startsWith("/event/") || path.startsWith("/organizer/")) {
          return true;
        }

        // Sjekk om ruten er offentlig
        if (publicRoutes.some((route) => path === route)) {
          return true;
        }

        // Alle andre ruter krever autentisering
        return !!token;
      },
    },
    pages: {
      signIn: "/sign-in",
    },
  }
);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};