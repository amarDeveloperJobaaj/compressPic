"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function RouteChromeGuard() {
  const pathname = usePathname();
  useEffect(() => {
    const header = document.querySelector("header");
    const footer = document.querySelector("footer");
    const isPf = pathname.startsWith("/portfolio");
    if (header) header.style.display = isPf ? "none" : "";
    if (footer) footer.style.display = isPf ? "none" : "";
    return () => { if (header) header.style.display = ""; if (footer) footer.style.display = ""; };
  }, [pathname]);
  return null;
}
