"use client";

import { useCallback, useEffect, useState } from "react";

const AUTH_KEY = "mcq_gift_auth_v1"; // shared with useProgress
const CACHE_KEY = "cah_pro_v1";
const CACHE_TTL = 6 * 60 * 60 * 1000;
const EVENT = "cah:pro-changed";

interface ProCache {
  email: string;
  pro: boolean;
  plan?: string;
  expiresAt?: string | null;
  checkedAt: number;
}

function readAuth(): { email: string; token: string } | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function readCache(): ProCache | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** Synchronous best guess, used to decide whether to load ads before the network check returns. */
export function cachedIsPro(): boolean {
  if (typeof window === "undefined") return false;
  const auth = readAuth();
  const cache = readCache();
  if (!auth || !cache || cache.email !== auth.email || !cache.pro) return false;
  return !cache.expiresAt || new Date(cache.expiresAt).getTime() > Date.now();
}

export function usePro() {
  const [pro, setPro] = useState(false);
  const [plan, setPlan] = useState<string | undefined>();
  const [expiresAt, setExpiresAt] = useState<string | null | undefined>();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);

  const refresh = useCallback(async (force = false) => {
    const auth = readAuth();
    setEmail(auth?.email ?? null);
    if (!auth) {
      setPro(false);
      setLoading(false);
      return;
    }
    const cache = readCache();
    if (!force && cache && cache.email === auth.email && Date.now() - cache.checkedAt < CACHE_TTL) {
      setPro(cachedIsPro());
      setPlan(cache.plan);
      setExpiresAt(cache.expiresAt);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/pro/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(auth),
      });
      const data = await res.json();
      const next: ProCache = { email: auth.email, pro: !!data.pro, plan: data.plan, expiresAt: data.expiresAt, checkedAt: Date.now() };
      localStorage.setItem(CACHE_KEY, JSON.stringify(next));
      setPro(next.pro);
      setPlan(next.plan);
      setExpiresAt(next.expiresAt);
      window.dispatchEvent(new Event(EVENT));
    } catch {
      setPro(cachedIsPro());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const onChange = () => {
      setPro(cachedIsPro());
      const c = readCache();
      setPlan(c?.plan);
      setExpiresAt(c?.expiresAt);
    };
    window.addEventListener(EVENT, onChange);
    return () => window.removeEventListener(EVENT, onChange);
  }, [refresh]);

  return { pro, plan, expiresAt, loading, email, refresh };
}
