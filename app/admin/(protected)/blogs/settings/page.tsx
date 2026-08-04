import { redirect } from "next/navigation";

/** Old settings URL kept working — redirects to the new /admin/settings. */
export default function OldSettingsRedirect() {
  redirect("/admin/settings");
}
