"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Mail, Shield, CheckCircle, Loader2, CloudUpload } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (email: string, token: string) => void;
}

type Step = "email" | "otp" | "success";

export default function EmailLoginModal({ isOpen, onClose, onSuccess }: Props) {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!isOpen) {
      // Reset on close
      setTimeout(() => { setStep("email"); setOtp(["","","","","",""]); setError(""); }, 300);
    }
  }, [isOpen]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) { setError("Please enter a valid email."); return; }
    setError("");
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to send OTP."); return; }
      setStep("otp");
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
    // Auto-submit when all filled
    if (newOtp.every(d => d) && newOtp.join("").length === 6) {
      handleVerifyOTP(newOtp.join(""));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async (code?: string) => {
    const otpCode = code || otp.join("");
    if (otpCode.length !== 6) { setError("Enter all 6 digits."); return; }
    setError("");
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpCode }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Verification failed."); return; }
      setStep("success");
      setTimeout(() => {
        onSuccess(data.email, data.token);
        onClose();
      }, 1800);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl p-6 sm:p-8"
        style={{
          background: "var(--bg-2)",
          border: "1px solid var(--border)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors cursor-pointer"
          style={{ color: "var(--text-3)", background: "transparent", border: "none" }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--text-1)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--text-3)")}
        >
          <X className="w-4 h-4" />
        </button>

        {/* ── Step: Email ── */}
        {step === "email" && (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-xl flex items-center justify-center" style={{ width: 44, height: 44, background: "rgba(61,179,113,0.12)", color: "var(--green)" }}>
                <CloudUpload className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-lg leading-tight" style={{ color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                  Save Your Progress
                </h2>
                <p className="text-xs" style={{ color: "var(--text-3)" }}>Sync across all devices</p>
              </div>
            </div>

            <p className="text-sm mb-5 leading-relaxed" style={{ color: "var(--text-2)" }}>
              Enter your email and we'll send a verification code. No password needed.
            </p>

            <form onSubmit={handleSendOTP} className="flex flex-col gap-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-3)" }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(""); }}
                  placeholder="your@email.com"
                  autoFocus
                  className="w-full rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-all"
                  style={{
                    background: "var(--bg-3)",
                    border: "1px solid var(--border)",
                    color: "var(--text-1)",
                    fontFamily: "var(--font-inter), sans-serif",
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = "var(--green)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "var(--border)")}
                />
              </div>

              {error && <p className="text-xs font-medium" style={{ color: "#f87171" }}>{error}</p>}

              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full flex items-center justify-center gap-2 rounded-xl py-3 font-bold text-sm text-white transition-opacity cursor-pointer"
                style={{ background: "var(--green)", border: "none", opacity: isLoading || !email ? 0.6 : 1 }}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                {isLoading ? "Sending..." : "Send Verification Code"}
              </button>
            </form>
          </>
        )}

        {/* ── Step: OTP ── */}
        {step === "otp" && (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-xl flex items-center justify-center" style={{ width: 44, height: 44, background: "rgba(96,165,250,0.12)", color: "#60a5fa" }}>
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-lg leading-tight" style={{ color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                  Check Your Email
                </h2>
                <p className="text-xs" style={{ color: "var(--text-3)" }}>{email}</p>
              </div>
            </div>

            <p className="text-sm mb-6 leading-relaxed" style={{ color: "var(--text-2)" }}>
              We sent a 6-digit code. Enter it below. Valid for 10 minutes.
            </p>

            {/* OTP input boxes */}
            <div className="flex gap-2 justify-center mb-5">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={el => { otpRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(i, e)}
                  className="rounded-xl text-center text-xl font-black outline-none transition-all"
                  style={{
                    width: 44, height: 52,
                    background: "var(--bg-3)",
                    border: `1px solid ${digit ? "var(--green)" : "var(--border)"}`,
                    color: "var(--text-1)",
                    fontFamily: "var(--font-space-grotesk), sans-serif",
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = "var(--green)")}
                  onBlur={e => (e.currentTarget.style.borderColor = digit ? "var(--green)" : "var(--border)")}
                />
              ))}
            </div>

            {error && <p className="text-xs font-medium text-center mb-3" style={{ color: "#f87171" }}>{error}</p>}

            <button
              onClick={() => handleVerifyOTP()}
              disabled={isLoading || otp.some(d => !d)}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-3 font-bold text-sm text-white transition-opacity cursor-pointer"
              style={{ background: "#60a5fa", border: "none", opacity: isLoading || otp.some(d => !d) ? 0.6 : 1 }}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
              {isLoading ? "Verifying..." : "Verify Code"}
            </button>

            <button
              onClick={() => { setStep("email"); setOtp(["","","","","",""]); setError(""); }}
              className="w-full text-center text-xs mt-3 cursor-pointer"
              style={{ color: "var(--text-3)", background: "none", border: "none" }}
            >
              ← Use a different email
            </button>
          </>
        )}

        {/* ── Step: Success ── */}
        {step === "success" && (
          <div className="flex flex-col items-center text-center py-4">
            <div className="rounded-full flex items-center justify-center mb-4 animate-pulse" style={{ width: 60, height: 60, background: "rgba(61,179,113,0.15)", color: "var(--green)" }}>
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="font-bold text-xl mb-2" style={{ color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
              Progress Synced!
            </h2>
            <p className="text-sm" style={{ color: "var(--text-2)" }}>
              Your MCQ progress is now saved to <strong style={{ color: "var(--text-1)" }}>{email}</strong>. Load it on any device.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
