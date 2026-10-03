"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { applyBodyTheme } from "@/lib/bodyTheme";

/** Re-resolves <html data-body> on client-side navigation (the inline script covers first paint). */
export default function BodyThemeSync() {
  const pathname = usePathname();
  useEffect(() => {
    applyBodyTheme();
  }, [pathname]);
  return null;
}
