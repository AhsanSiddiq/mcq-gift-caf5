import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <div className="max-w-3xl mx-auto w-full pt-20 sm:pt-24 pb-20 px-3 sm:px-4 animate-pulse">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4 gap-2">
          <span className="rounded-xl" style={{ height: 40, width: 72, background: "var(--bg-2)", border: "1px solid var(--border)", display: "block" }} />
          <span className="rounded-xl" style={{ height: 40, width: 80, background: "var(--bg-2)", border: "1px solid var(--border)", display: "block" }} />
        </div>
        
        {/* Progress bar */}
        <div className="w-full h-2 rounded-full mb-5" style={{ background: "var(--border)" }}>
          <div className="h-2 rounded-full" style={{ width: "30%", background: "var(--green)", opacity: 0.35 }} />
        </div>

        {/* Card skeleton */}
        <div className="rounded-2xl p-6 sm:p-8 flex flex-col gap-5" style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>
          <span className="rounded" style={{ display: "block", height: 13, width: 90, background: "var(--border)" }} />
          <span className="rounded" style={{ display: "block", height: 22, width: "80%", background: "var(--border)" }} />
          <span className="rounded" style={{ display: "block", height: 22, width: "55%", background: "var(--border)" }} />
          
          <div className="flex flex-col gap-3 mt-2">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="rounded-xl p-4 flex items-center gap-3" style={{ background: "var(--bg-3)", border: "1px solid var(--border)" }}>
                <span className="rounded-full shrink-0" style={{ width: 20, height: 20, background: "var(--border)", display: "block" }} />
                <span className="rounded flex-1" style={{ height: 14, width: `${40 + n * 12}%`, background: "var(--border)", display: "block" }} />
              </div>
            ))}
          </div>
        </div>
        
        <p className="text-center text-sm font-medium mt-6" style={{ color: "var(--text-3)" }}>Loading interface…</p>
      </div>
    </div>
  );
}
