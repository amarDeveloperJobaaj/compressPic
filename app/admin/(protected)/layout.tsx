import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin/session";
import { AdminShell } from "@/components/admin/AdminShell";

/**
 * Real authentication gate for every /admin route except /admin/login.
 *
 * The proxy.ts file does a cheap cookie-presence check; this layout is the
 * authoritative verification (HMAC signature + expiry) because it runs on the
 * Node runtime where the session helper lives.
 */
export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authenticated = await isAdmin();
  if (!authenticated) {
    redirect("/admin/login");
  }

  return <AdminShell>{children}</AdminShell>;
}
