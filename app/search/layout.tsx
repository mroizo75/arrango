import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Søk etter arrangementer – finn billetter",
  description: "Søk etter konserter, festivaler, teater og andre arrangementer og finn billetter på Arrango.",
  alternates: {
    canonical: "/search",
  },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
