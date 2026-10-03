"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Crown, Loader2, Timer, Ban, Rocket, Heart, Sparkles } from "lucide-react";
import EmailLoginModal from "@/components/EmailLoginModal";
import { usePro } from "@/hooks/usePro";
import { formatPrice, type PlanId, type PriceBook } from "@/data/regions";

const AUTH_KEY = "mcq_gift_auth_v1"; // shared with useProgress

interface PaddleConfig {
  clientToken?: string;
  env: "sandbox" | "production";
  monthlyPriceId?: string;
  sittingPriceId?: string;
}

interface PaddleGlobal {
  Environment: { set: (env: string) => void };
  Initialize: (opts: { token: string; eventCallback?: (e: { name: string }) => void }) => void;
  Checkout: { open: (opts: Record<string, unknown>) => void };
}

declare global {
  interface Window {
    Paddle?: PaddleGlobal;
  }
}

let paddleReady: Promise<PaddleGlobal> | null = null;
function loadPaddle(cfg: PaddleConfig, onCompleted: () => void): Promise<PaddleGlobal> {
  if (paddleReady) return paddleReady;
  paddleReady = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    s.async = true;
    s.onload = () => {
      const P = window.Paddle!;
      if (cfg.env === "sandbox") P.Environment.set("sandbox");
      P.Initialize({
        token: cfg.clientToken!,
        eventCallback: (e) => { if (e.name === "checkout.completed") onCompleted(); },
      });
      resolve(P);
    };
    s.onerror = () => { paddleReady = null; reject(new Error("Paddle failed to load")); };
    document.head.appendChild(s);
  });
  return paddleReady;
}

function readAuth(): { email: string; token: string } | null {
  try { const raw = localStorage.getItem(AUTH_KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
}

const PERKS = [
  { icon: Timer, title: "Unlimited timed Exam Simulator", desc: "Full-length, auto-submitting timed exams for every subject. Free users get one a day." },
  { icon: Ban, title: "Zero ads, everywhere", desc: "Every page, every quiz, every CV — completely ad-free." },
  { icon: Rocket, title: "First access to new exam banks", desc: "ACCA, ICAI, CIMA and more as they launch — Pro members get in first." },
  { icon: Heart, title: "Keep the free tier free", desc: "Your plan funds new questions and explanations for every student." },
];

const TUTOR_PERK = { icon: Sparkles, title: "AI tutor on every question", desc: "Ask why an answer is right, get a simpler explanation, or find out exactly where your reasoning went wrong — 40 a day (free accounts get 3)." };

export default function ProCheckout({ prices, localRails, paymentDetails, paddle, tutor = false }: {
  tutor?: boolean;
  prices: PriceBook;
  localRails: string[];
  paymentDetails: Record<string, string>;
  paddle: PaddleConfig;
}) {
  const { pro, plan: activePlan, expiresAt, loading, email, refresh } = usePro();
  const [plan, setPlan] = useState<PlanId>("sitting");
  const [showLogin, setShowLogin] = useState(false);
  const [pendingAction, setPendingAction] = useState<"card" | "local" | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [rail, setRail] = useState(localRails[0] ?? "");
  const [reference, setReference] = useState("");
  const [localStep, setLocalStep] = useState<"idle" | "form" | "sent">("idle");
  const [paid, setPaid] = useState(false);

  const cardEnabled = !!(paddle.clientToken && paddle.monthlyPriceId && paddle.sittingPriceId);

  const onCheckoutCompleted = () => {
    setPaid(true);
    // The webhook usually lands within seconds; poll a few times.
    let n = 0;
    const tick = () => { n++; refresh(true); if (n < 6) setTimeout(tick, 4000); };
    setTimeout(tick, 2000);
  };

  const startCard = async () => {
    const auth = readAuth();
    if (!auth) { setPendingAction("card"); setShowLogin(true); return; }
    setBusy(true); setError("");
    try {
      const P = await loadPaddle(paddle, onCheckoutCompleted);
      P.Checkout.open({
        items: [{ priceId: plan === "monthly" ? paddle.monthlyPriceId : paddle.sittingPriceId, quantity: 1 }],
        customer: { email: auth.email },
        customData: { email: auth.email, plan },
      });
    } catch {
      setError("Card checkout couldn't load. Please disable ad-blockers for this page and try again.");
    } finally {
      setBusy(false);
    }
  };

  const startLocal = () => {
    if (!readAuth()) { setPendingAction("local"); setShowLogin(true); return; }
    setLocalStep("form");
  };

  const submitLocal = async (e: React.FormEvent) => {
    e.preventDefault();
    const auth = readAuth();
    if (!auth) { setPendingAction("local"); setShowLogin(true); return; }
    setBusy(true); setError("");
    try {
      const res = await fetch("/api/pro/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...auth, plan, method: rail, reference }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setLocalStep("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const onSignedIn = (em: string, tok: string) => {
    localStorage.setItem(AUTH_KEY, JSON.stringify({ email: em, token: tok }));
    setShowLogin(false);
    refresh(true);
    if (pendingAction === "card") setTimeout(startCard, 50);
    if (pendingAction === "local") setLocalStep("form");
    setPendingAction(null);
  };

  const card = (id: PlanId, title: string, sub: string, badge?: string) => {
    const selected = plan === id;
    return (
      <button type="button" onClick={() => setPlan(id)}
        className="text-left rounded-2xl p-5 sm:p-6 flex flex-col gap-2 transition-all cursor-pointer relative"
        style={{
          background: selected ? "rgba(61,179,113,0.08)" : "var(--bg-2)",
          border: `2px solid ${selected ? "var(--green)" : "var(--border)"}`,
        }}>
        {badge && (
          <span className="absolute -top-3 right-4 text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full text-white"
            style={{ background: "var(--gold)" }}>{badge}</span>
        )}
        <span className="text-sm font-bold" style={{ color: "var(--text-2)" }}>{title}</span>
        <span className="font-black" style={{ fontSize: "2rem", color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif", lineHeight: 1 }}>
          {formatPrice(prices, prices[id])}
        </span>
        <span className="text-xs" style={{ color: "var(--text-3)" }}>{sub}</span>
      </button>
    );
  };

  if (!loading && pro) {
    return (
      <div className="rounded-2xl p-8 text-center max-w-lg" style={{ background: "var(--bg-2)", border: "1px solid rgba(245,166,35,0.4)" }}>
        <Crown className="w-10 h-10 mx-auto mb-3" style={{ color: "var(--gold)" }} />
        <h2 className="font-bold text-2xl mb-2" style={{ color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>You&apos;re Pro 🎉</h2>
        <p className="text-sm mb-6" style={{ color: "var(--text-2)" }}>
          {email} · {activePlan === "sitting" ? "Exam-sitting pass" : "Monthly"}
          {expiresAt ? ` · active until ${new Date(expiresAt).toLocaleDateString()}` : ""}
        </p>
        <Link href="/practice" className="inline-block font-bold rounded-xl px-6 py-3 text-white" style={{ background: "var(--green)", textDecoration: "none" }}>
          Start a timed exam
        </Link>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10">
      <EmailLoginModal isOpen={showLogin} onClose={() => { setShowLogin(false); setPendingAction(null); }} onSuccess={onSignedIn} />

      {/* Perks */}
      <div className="flex flex-col gap-5">
        {(tutor ? [PERKS[0], TUTOR_PERK, ...PERKS.slice(1)] : PERKS).map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex gap-4">
            <span className="shrink-0 rounded-xl flex items-center justify-center" style={{ width: 44, height: 44, background: "rgba(61,179,113,0.10)", color: "var(--green)" }}>
              <Icon className="w-5 h-5" />
            </span>
            <div>
              <p className="font-bold" style={{ color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>{title}</p>
              <p className="text-sm" style={{ color: "var(--text-2)", lineHeight: 1.6 }}>{desc}</p>
            </div>
          </div>
        ))}
        <div className="rounded-2xl p-5 mt-2" style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>
          <p className="text-sm font-bold mb-2" style={{ color: "var(--text-1)" }}>Always free</p>
          {["Every MCQ with explanations", "Topical drills & random mocks", "Marathon mode & flags", "Cloud progress sync", "CA induction CV maker"].map((f) => (
            <p key={f} className="text-sm flex items-center gap-2" style={{ color: "var(--text-2)" }}>
              <Check className="w-4 h-4" style={{ color: "var(--green)" }} /> {f}
            </p>
          ))}
        </div>
      </div>

      {/* Checkout */}
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          {card("monthly", "Monthly", "Cancel anytime")}
          {card("sitting", "Exam-sitting pass", "4 months · one payment", "Best value")}
        </div>

        {paid ? (
          <div className="rounded-2xl p-5 text-sm" style={{ background: "rgba(61,179,113,0.08)", border: "1px solid rgba(61,179,113,0.3)", color: "var(--text-1)" }}>
            <Loader2 className="w-4 h-4 inline animate-spin mr-2" /> Payment received — activating Pro on your account…
          </div>
        ) : (
          <>
            {cardEnabled && (
              <button onClick={startCard} disabled={busy}
                className="w-full rounded-xl px-6 py-4 font-bold text-white transition-transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-60"
                style={{ background: "var(--green)" }}>
                {busy ? <Loader2 className="w-4 h-4 inline animate-spin" /> : `Pay ${formatPrice(prices, prices[plan])} by card`}
              </button>
            )}

            {localRails.length > 0 && localStep === "idle" && (
              <button onClick={startLocal}
                className="w-full rounded-xl px-6 py-4 font-bold transition-colors cursor-pointer"
                style={{ background: cardEnabled ? "var(--bg-2)" : "var(--green)", color: cardEnabled ? "var(--text-1)" : "#fff", border: "1px solid var(--border)" }}>
                Pay with {localRails.join(" / ")}
              </button>
            )}

            {localStep === "form" && (
              <form onSubmit={submitLocal} className="rounded-2xl p-5 flex flex-col gap-3" style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>
                <div className="flex gap-2 flex-wrap">
                  {localRails.map((r) => (
                    <button type="button" key={r} onClick={() => setRail(r)} className="text-xs font-bold px-3 py-1.5 rounded-full cursor-pointer"
                      style={{ background: rail === r ? "var(--green)" : "var(--bg-3)", color: rail === r ? "#fff" : "var(--text-2)" }}>
                      {r}
                    </button>
                  ))}
                </div>
                <p className="text-sm" style={{ color: "var(--text-2)", lineHeight: 1.6 }}>
                  1. Send <strong style={{ color: "var(--text-1)" }}>{formatPrice(prices, prices[plan])}</strong> to{" "}
                  <strong style={{ color: "var(--text-1)" }}>{paymentDetails[rail]}</strong>.<br />
                  2. Paste the transaction ID below. We activate Pro on your email after confirming — usually within a few hours.
                </p>
                <input value={reference} onChange={(e) => setReference(e.target.value)} required minLength={4} maxLength={64}
                  placeholder="Transaction ID (TID)"
                  className="rounded-xl px-4 py-3 text-sm outline-none"
                  style={{ background: "var(--bg-3)", border: "1px solid var(--border)", color: "var(--text-1)" }} />
                <button type="submit" disabled={busy} className="rounded-xl px-5 py-3 font-bold text-white cursor-pointer disabled:opacity-60" style={{ background: "var(--green)" }}>
                  {busy ? <Loader2 className="w-4 h-4 inline animate-spin" /> : "I've paid — activate my Pro"}
                </button>
              </form>
            )}

            {localStep === "sent" && (
              <div className="rounded-2xl p-5 text-sm" style={{ background: "rgba(61,179,113,0.08)", border: "1px solid rgba(61,179,113,0.3)", color: "var(--text-1)", lineHeight: 1.6 }}>
                ✅ Got it. We&apos;ll verify your {rail} payment and switch on Pro for <strong>{readAuth()?.email}</strong>. Refresh this page later to see your status.
              </div>
            )}

            {!cardEnabled && localRails.length === 0 && (
              <div className="rounded-2xl p-5 text-sm" style={{ background: "var(--bg-2)", border: "1px solid var(--border)", color: "var(--text-2)", lineHeight: 1.6 }}>
                Online checkout for your region is opening soon. <Link href="/contact" style={{ color: "var(--green)" }}>Message us</Link> and we&apos;ll set you up manually today.
              </div>
            )}
          </>
        )}

        {error && <p className="text-sm" style={{ color: "#f87171" }}>{error}</p>}
        <p className="text-xs" style={{ color: "var(--text-3)", lineHeight: 1.6 }}>
          Pro is linked to your verified email — sign in with the same email on any device. Card payments are processed securely by Paddle.
          {email ? ` Signed in as ${email}.` : ""}
        </p>
      </div>
    </div>
  );
}
