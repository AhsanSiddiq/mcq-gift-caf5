"use client";

import { useEffect, useRef } from "react";
import { usePro } from "@/hooks/usePro";

export const ADSENSE_CLIENT = "ca-pub-1174752834339259";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * Loads the AdSense script for free users only — Pro members get a fully ad-free site.
 * Rendered once from the root layout.
 */
export function AdsLoader() {
  const { pro, loading } = usePro();
  useEffect(() => {
    if (loading || pro) return;
    if (document.querySelector("script[data-cah-ads]")) return;
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
    s.crossOrigin = "anonymous";
    s.dataset.cahAds = "1";
    document.head.appendChild(s);
  }, [pro, loading]);
  return null;
}

/**
 * A responsive in-content ad unit. Renders nothing for Pro members or when no slot is configured
 * (set NEXT_PUBLIC_ADSENSE_SLOT in Vercel to an AdSense "display ad" slot id).
 */
export default function AdSlot({ slot = process.env.NEXT_PUBLIC_ADSENSE_SLOT, className = "" }: { slot?: string; className?: string }) {
  const { pro, loading } = usePro();
  const pushed = useRef(false);

  useEffect(() => {
    if (loading || pro || !slot || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // ad blockers / script not ready — ignore
    }
  }, [loading, pro, slot]);

  if (loading || pro || !slot) return null;

  return (
    <div className={`w-full my-6 ${className}`} aria-label="Advertisement">
      <ins
        className="adsbygoogle"
        style={{ display: "block", minHeight: 90 }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
