"use client";

import { useState, useEffect } from "react";
import { Search, Compass, BookOpen, UserCircle, FileText, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function CommandMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const ACTIONS = [
    { label: "Go to Home", icon: <Compass />, link: "/" },
    { label: "MCQ Practice Engine", icon: <BookOpen />, link: "/practice" },
    { label: "Build Big-4 Induction CV", icon: <FileText />, link: "/cv-maker" },
    { label: "Articleship Hub Blog", icon: <Compass />, link: "/blog" },
    { label: "Contact Developer", icon: <UserCircle />, link: "/contact" },
  ];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden sm:flex fixed bottom-6 right-6 z-40 p-3 rounded-full shadow-2xl transition-transform hover:scale-105 items-center gap-2"
        style={{ background: "var(--bg-2)", border: "1px solid var(--border)", color: "var(--text-2)", boxShadow: "0 10px 40px rgba(0,0,0,0.4)" }}
      >
        <Search className="w-5 h-5" />
        <span className="text-xs font-mono font-bold mr-1">⌘+K</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh] px-4"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(5px)" }}
            onClick={() => setOpen(false)}
          >
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl"
              style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center px-4 py-3.5 border-b gap-3" style={{ borderColor: "var(--border)" }}>
                <Search className="w-5 h-5" style={{ color: "var(--text-3)" }} />
                <input autoFocus placeholder="What are you looking for?"
                  className="flex-1 bg-transparent border-none text-base sm:text-sm outline-none w-full placeholder-gray-500"
                  style={{ color: "var(--text-1)", fontFamily: "var(--font-inter), sans-serif" }} 
                  onChange={(e) => {
                    // Simple fuzzy search could be added here, currently static menu
                  }}
                />
                <kbd className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded font-mono font-bold" style={{ background: "var(--bg-3)", color: "var(--text-3)" }}>ESC</kbd>
              </div>
              <div className="p-2 py-3 max-h-[60vh] overflow-y-auto">
                <p className="px-3 py-2 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-3)" }}>Quick Links</p>
                <div className="space-y-1">
                  {ACTIONS.map((action) => (
                    <button key={action.label}
                      onClick={() => { router.push(action.link); setOpen(false); }}
                      className="w-full text-left flex items-center justify-between px-3 py-3 rounded-xl transition-colors cursor-pointer group"
                      style={{ color: "var(--text-1)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-3)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <div className="flex items-center gap-3">
                        <span style={{ color: "var(--green)" }}>{action.icon}</span>
                        <span className="text-sm font-semibold">{action.label}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--text-3)" }} />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
