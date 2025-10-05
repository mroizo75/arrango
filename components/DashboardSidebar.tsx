'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Ticket,
  Users,
  Megaphone,
  Settings,
  PlusCircle,
  ScanLine,
  HelpCircle,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const NAV_ITEMS = [
  { name: "Oversikt", href: "/dashboard", icon: LayoutDashboard },
  { name: "Scan billetter", href: "/dashboard/scan", icon: ScanLine },
  { name: "Billetter", href: "/dashboard/tickets", icon: Ticket },
  { name: "Kunder", href: "/dashboard/customers", icon: Users },
  { name: "Markedsføring", href: "/dashboard/marketing", icon: Megaphone },
  { name: "Innstillinger", href: "/dashboard/settings", icon: Settings },
  { name: "Hjelp", href: "/dashboard/help", icon: HelpCircle },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const SidebarContent = () => (
    <>
      <div className="border-b px-6 py-6">
        <Link href="/dashboard" className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
          <Image
            src="/logo-light.png"
            alt="Arrango"
            width={200}
            height={60}
            className="h-14 w-auto"
          />
        </Link>
        <p className="mt-3 text-sm text-muted-foreground">
          Administrer arrangementer, billetter og kunder på ett sted.
        </p>
        <Link
          href="/dashboard/new-event"
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <PlusCircle className="h-4 w-4" />
          Lag nytt event
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {NAV_ITEMS.map(({ name, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t px-4 py-4 space-y-4">
        <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
          Beløp vises i kroner (NOK).
        </div>
        <Button 
          variant="outline" 
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logg ut
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-background border-b px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard">
          <Image
            src="/logo-light.png"
            alt="Arrango"
            width={120}
            height={40}
            className="h-10 w-auto"
          />
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 mt-[57px]"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "lg:hidden fixed top-[57px] left-0 bottom-0 w-72 bg-background border-r z-50 flex flex-col transition-transform duration-300",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex h-screen w-72 flex-col border-r bg-background fixed left-0 top-0 bottom-0">
        <SidebarContent />
      </aside>
    </>
  );
}