import React from "react";

export default function Loading() {
  return (
    <main className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 pt-28 pb-20 animate-pulse">
        {/* Back Link Placeholder */}
        <div className="inline-flex items-center gap-2 mb-10">
          <span className="rounded" style={{ height: 16, width: 80, background: "var(--bg-2)", border: "1px solid var(--border)", display: "block" }} />
        </div>
        
        {/* Header Placeholder */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <span className="rounded-full mb-3" style={{ height: 24, width: 80, background: "var(--bg-2)", border: "1px solid var(--border)", display: "inline-block" }} />
            <span className="rounded mb-3" style={{ height: 40, width: "60%", background: "var(--bg-2)", border: "1px solid var(--border)", display: "block" }} />
            <span className="rounded" style={{ height: 16, width: "80%", background: "var(--bg-2)", border: "1px solid var(--border)", display: "block" }} />
          </div>
        </div>
        
        {/* Grid Cards Placeholder */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           {[1, 2, 3, 4].map(i => (
             <div key={i} className="rounded-2xl p-6 flex flex-col gap-4" style={{ background: "var(--bg-2)", border: "1px solid var(--border)", height: 180 }}>
                <div className="flex items-start justify-between gap-3">
                  <span className="rounded-xl shrink-0" style={{ width: 44, height: 44, background: "var(--border)", display: "block" }} />
                </div>
                <div>
                   <span className="rounded block mb-2" style={{ height: 20, width: "40%", background: "var(--border)" }} />
                   <span className="rounded block" style={{ height: 14, width: "80%", background: "var(--border)" }} />
                </div>
                <div className="mt-auto">
                   <span className="rounded block" style={{ height: 14, width: "30%", background: "var(--border)" }} />
                </div>
             </div>
           ))}
        </div>
      </div>
    </main>
  );
}
