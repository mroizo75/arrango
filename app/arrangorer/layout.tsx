import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Arrangører – finn og selg billetter",
  description: "Oversikt over arrangører på Arrango. Finn arrangører og deres arrangementer, og selg billetter til dine egne arrangementer.",
  alternates: {
    canonical: "/arrangorer",
  },
};

export default function ArrangorerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
