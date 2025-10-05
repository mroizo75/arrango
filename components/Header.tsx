import React, { useState } from "react";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import dynamic from "next/dynamic";
import { useClerkMode } from "@/hooks/useClerkMode";

// Lazy load UserButton for better initial load
const LazyUserButton = dynamic(
  () => import("@clerk/nextjs").then(mod => ({ default: mod.UserButton })),
  {
    loading: () => <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />,
    ssr: false
  }
);
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo-light.png";
import { Menu, X } from "lucide-react";

interface HeaderProps {
  isSeller?: boolean;
}

function Header({ isSeller = false }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const clerkMode = useClerkMode();

  return (
    <div className="border-b">
      <div className="flex flex-col lg:flex-row items-center gap-4 p-4">
        <div className="flex items-center justify-between w-full lg:w-auto">
          <Link href="/" className="font-bold shrink-0">
            <Image
              src={logo}
              alt="logo"
              width={200}
              height={200}
              className="w-24 lg:w-28"
            />
          </Link>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <SignedIn>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label={isMobileMenuOpen ? "Lukk meny" : "Åpne meny"}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </SignedIn>
            <SignedOut>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label={isMobileMenuOpen ? "Lukk meny" : "Åpne meny"}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </SignedOut>
          </div>
        </div>



        <div className="hidden lg:block ml-auto">
          <SignedIn>
            <div className="flex items-center gap-3">
              {isSeller && (
                <Link href="/dashboard">
                  <button className="bg-blue-600 text-white px-3 py-1.5 text-sm rounded-lg hover:bg-blue-700 transition">
                    Dashboard
                  </button>
                </Link>
              )}

              <Link href="/tickets">
                <button className="bg-gray-100 text-gray-800 px-3 py-1.5 text-sm rounded-lg hover:bg-gray-200 transition border border-gray-300">
                  Mine billetter
                </button>
              </Link>
              <LazyUserButton />
            </div>
          </SignedIn>

          <SignedOut>
            <div className="flex items-center gap-4">
              <Link href="/arrangorer" className="text-gray-800 hover:text-blue-600 text-lg">
                Arrangører
              </Link>
              <SignInButton mode={clerkMode}>
                <button className="bg-gray-100 text-gray-800 px-3 py-1.5 text-sm rounded-lg hover:bg-gray-200 transition border border-gray-300">
                  Logg inn
                </button>
              </SignInButton>
            </div>
          </SignedOut>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden w-full border-t border-gray-200 pt-4 mt-4">
            <SignedIn>
              <div className="flex flex-col gap-3">
                {isSeller && (
                  <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full bg-blue-600 text-white px-4 py-3 text-sm rounded-lg hover:bg-blue-700 transition">
                      Dashboard
                    </button>
                  </Link>
                )}
                <Link href="/tickets" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="w-full bg-gray-100 text-gray-800 px-4 py-3 text-sm rounded-lg hover:bg-gray-200 transition border border-gray-300">
                    Mine billetter
                  </button>
                </Link>
                <div className="pt-2 border-t border-gray-200 mt-2">
                  <LazyUserButton />
                </div>
              </div>
            </SignedIn>

            <SignedOut>
              <div className="flex flex-col gap-3">
                <Link
                  href="/arrangorer"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 text-sm rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-medium text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Bli arrangør
                </Link>
                <SignInButton mode={clerkMode}>
                  <button
                    className="w-full bg-gray-100 text-gray-800 px-4 py-3 text-sm rounded-lg hover:bg-gray-200 transition border border-gray-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Logg inn
                  </button>
                </SignInButton>
              </div>
            </SignedOut>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
