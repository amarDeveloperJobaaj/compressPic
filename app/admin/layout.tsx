import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — Vizo Tool",
  description: "Vizo Tool admin panel — manage the blog.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
