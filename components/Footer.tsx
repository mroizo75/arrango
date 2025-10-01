"use client";

import Link from "next/link";
import {
  Twitter,
  Facebook,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-12 md:flex-row md:justify-between">
        <div className="flex flex-col gap-3 text-sm text-muted-foreground">
          <span className="text-lg font-semibold text-foreground">arrango</span>
          <p>
            The platform for modern event organizers. Track sales, manage
            customers, and market smarter.
          </p>
          <div className="flex items-center gap-4 text-muted-foreground">
            <Link href="mailto:team@arrango.app" className="flex items-center gap-2">
              <Mail className="h-4 w-4" /> team@arrango.app
            </Link>
            <span className="flex items-center gap-2">
              <Phone className="h-4 w-4" /> +47 55 55 55 55
            </span>
          </div>
          <span className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" /> Oslo, Norway
          </span>
        </div>

        <div className="flex flex-col gap-4 text-sm">
          <span className="text-sm font-semibold text-foreground">
            Product
          </span>
          <Link href="/search" className="text-muted-foreground hover:text-foreground">
            Browse events
          </Link>
          <Link href="/seller" className="text-muted-foreground hover:text-foreground">
            Seller dashboard
          </Link>
          <Link
            href="/seller/new-event"
            className="text-muted-foreground hover:text-foreground"
          >
            Create event
          </Link>
          <Link href="/seller/events" className="text-muted-foreground hover:text-foreground">
            Manage listings
          </Link>
        </div>

        <div className="flex flex-col gap-4 text-sm">
          <span className="text-sm font-semibold text-foreground">Resources</span>
          <Link href="/help" className="text-muted-foreground hover:text-foreground">
            Help center
          </Link>
          <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
            Privacy policy
          </Link>
          <Link href="/terms" className="text-muted-foreground hover:text-foreground">
            Terms &amp; conditions
          </Link>
        </div>

        <div className="flex flex-col gap-4 text-sm">
          <span className="text-sm font-semibold text-foreground">Connect</span>
          <div className="flex items-center gap-3 text-muted-foreground">
            <Link href="#" className="hover:text-foreground">
              <Twitter className="h-4 w-4" />
            </Link>
            <Link href="#" className="hover:text-foreground">
              <Facebook className="h-4 w-4" />
            </Link>
            <Link href="#" className="hover:text-foreground">
              <Linkedin className="h-4 w-4" />
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            Join our newsletter for marketing tips and product updates.
          </p>
        </div>
      </div>
      <div className="border-t bg-background">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© {year} arrango. Built for event creators everywhere.</p>
          <div className="flex items-center gap-3">
            <Link href="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Terms
            </Link>
            <Link href="/cookies" className="hover:text-foreground">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
