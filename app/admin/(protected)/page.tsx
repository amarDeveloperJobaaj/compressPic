import { redirect } from "next/navigation";

/** /admin → /admin/dashboard (keeps the short URL working, never 404s). */
export default function AdminIndexPage() {
  redirect("/admin/dashboard");
}
