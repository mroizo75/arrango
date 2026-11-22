import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bli arrangør – selg billetter med Arrango",
  description: "Bli arrangør på Arrango og selg billetter til konserter, festivaler, teater og andre arrangementer. Gratis å komme i gang.",
  alternates: {
    canonical: "/become-organizer",
  },
};

export default function BecomeOrganizerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
