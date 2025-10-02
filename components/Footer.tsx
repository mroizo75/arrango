"use client";

import Link from "next/link";
import {
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import Image from "next/image";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-12 md:flex-row md:justify-between">
        <div className="flex flex-col gap-3 text-sm text-muted-foreground">
          <Image src="/logo-light.png" alt="arrango" width={100} height={100} />
          <p>
            The platform for modern event organizers. Track sales, manage
            customers, and market smarter.
          </p>
          <div className="flex items-center gap-4 text-muted-foreground">
            <Link href="mailto:team@arrango.app" className="flex items-center gap-2">
              <Mail className="h-4 w-4" /> team@arrango.no
            </Link>
            <span className="flex items-center gap-2">
              <Link href="tel:+4791540854" className="flex items-center gap-2">
              <Phone className="h-4 w-4" /> +47 91 54 08 24
              </Link>
            </span>
          </div>
          <span className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" /> Lier, Norway
          </span>
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
        <span className="text-sm font-semibold text-foreground">Betalingsmetoder</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded border text-sm">
                <Image src="/visa.svg" alt="Visa" width={100} height={100} />
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded border text-sm">
                <Image src="/mastercard.svg" alt="Mastercard" width={100} height={100} />
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded border text-sm">
                  <Image src="/klarna.svg" alt="Klarna" width={100} height={100} />
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded border text-sm">
                <Image src="/swish.svg" alt="Swish" width={100} height={100} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Vi støtter sikre betalingsmetoder for alle kunder
            </p>
        </div>
      </div>

      {/* Payment Methods
      <div className="border-t bg-background">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold text-foreground">Betalingsmetoder</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded border text-sm">
                <Image src="/visa.svg" alt="Visa" width={35} height={35} />
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded border text-sm">
                <Image src="/mastercard.svg" alt="Mastercard" width={35} height={35} />
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded border text-sm">
                <Image src="/klarna.svg" alt="Klarna" width={35} height={35} />
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded border text-sm">
                <Image src="/swish.svg" alt="Swish" width={35} height={35} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Vi støtter sikre betalingsmetoder for alle kunder
            </p>
          </div>
        </div>
      </div> */}

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
