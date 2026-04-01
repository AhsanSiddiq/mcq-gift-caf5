"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion, useScroll, useTransform,
  useMotionValue, useSpring, AnimatePresence,
} from "framer-motion";
import { ArrowRight, CheckCircle2, BookOpen, FileText, Target } from "lucide-react";
import { blogs } from "@/data/blogs";

/* ── Framer Variants ── */
const fadeUp: import("framer-motion").Variants = {
  hidden: { opacity: 0, y: 40, filter: "blur(4px)" },
  show:   { opacity: 1, y: 0,  filter: "blur(0px)", transition: { duration: 0.9, ease: [0.16,1,0.3,1] } },
};
const stagger: import("framer-motion").Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.11 } },
};
const slideLeft: import("framer-motion").Variants = {
  hidden: { opacity: 0, x: -50 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.9, ease: [0.16,1,0.3,1] } },
};
const slideRight: import("framer-motion").Variants = {
  hidden: { opacity: 0, x: 50 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.9, ease: [0.16,1,0.3,1] } },
};
const scaleIn: import("framer-motion").Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  show:   { opacity: 1, scale: 1, transition: { duration: 0.7, ease: [0.16,1,0.3,1] } },
};

/* ── Data ── */
const MARQUEE_ITEMS = [
  "PRC - 3 Papers","CAF - 8 Papers","CFAP - 6 Papers","Strategic Case - 1 Paper",
  "ICAP 2025 Scheme","Audit and Assurance Essentials",
  "Financial Accounting and Reporting","Taxation Principles and Compliance","Corporate Laws and Governance","Daily Study Plans",
  "Strategic Business Finance","Data, Systems and Risks","Past Papers",
];

const STAGES = [
  {
    step:"01", label:"PRC", color:"#3DB371",
    title:"Stop reading. Start solving.",
    body:"PRC is an MCQ speed test. You don't need to memorize a 500-page book. You need fast pattern recognition.",
    what:"Do 100 MCQs daily. Practice beats reading here.",
    image:"/images/journey/prc.png",
    subjects:["Fundamentals of Accounting","Quantitative Analysis for Business","Business and Economic Insights"],
  },
  {
    step:"02", label:"CAF", color:"#F5A623",
    title:"Stop treating it like high school.",
    body:"Examiners don't care if you know the standard. They care if you can actually apply it to a messy business problem under pressure.",
    what:"Look at the last 6 past papers first. Study what actually gets tested.",
    image:"/images/journey/caf.png",
    subjects:["Financial Accounting and Reporting","Taxation Principles and Compliance","Data, Systems and Risks","Business Law Dynamics","Management Accounting","Corporate Reporting","Business Insights and Analysis","Audit and Assurance Essentials"],
  },
  {
    step:"03", label:"Articleship", color:"#60A5FA",
    title:"12-hour shifts leave zero motivation.",
    body:"Big 4 busy season will drain you. You won't have the energy to 'figure out what to study' when you get home.",
    what:"Use our daily planner. One topic, one hour, every single day. No thinking involved.",
    image:"/images/journey/articleship.png",
    subjects:[],
  },
  {
    step:"04", label:"CFAP", color:"#A78BFA",
    title:"You can't cover it all. So don't.",
    body:"Six final exams at once is heavy. You simply can't learn 100% of the syllabus. You need to know exactly which 20% brings 80% of the marks.",
    what:"Get our frequency guide. It shows exactly what topics actually matter.",
    image:"/images/journey/cfap.png",
    subjects:[],
  },
  {
    step:"05", label:"Strategic Case", color:"#F472B6",
    title:"Books won't save you here.",
    body:"It's an open-book exam, but it requires pure business sense. If you can't connect the dots in real-time, 20 reference books won't help.",
    what:"Index your frameworks and do strict, timed mocks. The clock is your actual enemy.",
    image:"/images/journey/strategic_case.png",
    subjects:["Strategic Business Management & Governance"],
  },
];





/* ── Interactive Hub Ecosystem ── */
function HeroEcosystem() {
  return (
    <div className="relative w-full mx-auto flex items-center justify-center h-[260px] sm:h-[500px]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] flex items-center justify-center scale-[0.60] sm:scale-100 origin-center">
      
        {/* 3D-styled Glowing Checkmark Centerpiece */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex items-center justify-center rounded-full"
          style={{
            width: 180, height: 180,
            background: "linear-gradient(135deg, rgba(61,179,113,0.15) 0%, rgba(61,179,113,0.02) 100%)",
            boxShadow: "0 20px 50px rgba(61,179,113,0.25), inset 0 0 0 1px rgba(61,179,113,0.3), inset 0 0 20px rgba(61,179,113,0.2)",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Glow behind the SVG */}
          <motion.div 
            animate={{ opacity: [0.5, 0.8, 0.5] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full" 
            style={{ background: "radial-gradient(circle, rgba(61,179,113,0.4) 0%, transparent 60%)", filter: "blur(20px)" }} 
          />
          
          {/* The 3D Tick */}
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" style={{ filter: "drop-shadow(0px 10px 15px rgba(0,0,0,0.5))", position: "relative", zIndex: 2 }}>
             {/* Shadow/Back layer */}
             <motion.path
               d="M25 53 L42 70 L80 32"
               stroke="#1A5E3A" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"
               initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
               transition={{ duration: 1.5, delay: 0.1, ease: "easeOut" }}
               style={{ transform: "translateY(4px)" }}
             />
             {/* Main bright layer */}
             <motion.path
               d="M25 50 L42 67 L80 29"
               stroke="#3DB371" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"
               initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
               transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
             />
             {/* Highlight layer */}
             <motion.path
               d="M28 49 L42 63 L77 28"
               stroke="#A3E6C2" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
               initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
               transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
               style={{ mixBlendMode: 'plus-lighter', opacity: 0.8 }}
             />
          </svg>
        </motion.div>

        {/* Orbiting Tool Cards */}
        <FloatingCard delay={0.8} startX={-150} startY={-120} endX={-110} endY={-90} icon={<BookOpen size={18} color="#3DB371" />} text="MCQ Engine" sub="Live Practice" />
        <FloatingCard delay={1.0} startX={150} startY={-100} endX={110} endY={-70} icon={<FileText size={18} color="#60A5FA" />} text="CV Maker" sub="Big 4 Ready" />
        <FloatingCard delay={1.2} startX={-140} startY={120} endX={-90} endY={90} icon={<CheckCircle2 size={18} color="#F5A623" />} text="Daily Planner" sub="Auto-Schedules" />
        <FloatingCard delay={1.4} startX={140} startY={110} endX={100} endY={80} icon={<Target size={18} color="#A78BFA" />} text="Strategy Guides" sub="Examiner Secrets" />
        
        {/* Decorative Orbs */}
        <motion.div className="absolute w-4 h-4 rounded-full bg-green-500 blur-[2px]" initial={{ opacity:0, scale:0 }} animate={{ opacity:0.6, scale:1 }} transition={{ delay: 1.5 }} style={{ top: '15%', left: '30%' }} />
        <motion.div className="absolute w-3 h-3 rounded-full bg-blue-500 blur-[1px]" initial={{ opacity:0, scale:0 }} animate={{ opacity:0.4, scale:1 }} transition={{ delay: 1.7 }} style={{ bottom: '20%', right: '25%' }} />
      </div>
    </div>
  );
}

function FloatingCard({ delay, startX, startY, endX, endY, icon, text, sub }: { delay:number, startX:number, startY:number, endX:number, endY:number, icon:React.ReactNode, text:string, sub:string }) {
  // Use a random duration so they float out of sync
  const floatDuration = 4 + Math.random() * 2;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: startX, y: startY, scale: 0.8 }}
      animate={{ opacity: 1, x: endX, y: endY, scale: 1 }}
      transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
      className="absolute z-20"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: floatDuration, ease: "easeInOut" }}
        className="p-3 rounded-2xl flex items-center gap-3 backdrop-blur-xl"
        style={{
          background: "rgba(24,24,27,0.7)", 
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
          whiteSpace: "nowrap"
        }}
      >
        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          {icon}
        </div>
        <div className="flex flex-col pr-3">
          <span style={{ fontSize: 13, fontWeight: 700, color: "#F4F4F5", fontFamily: "var(--font-inter), sans-serif", letterSpacing:"0.01em" }}>{text}</span>
          <span style={{ fontSize: 11, color: "#A1A1AA", fontFamily: "var(--font-inter), sans-serif" }}>{sub}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Marquee ── */
function Marquee() {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="marquee-wrap border-y py-[18px]" style={{ borderColor:"var(--border)" }}>
      <div style={{ position:"absolute", left:0, top:0, bottom:0, width:80, background:"linear-gradient(to right, var(--bg), transparent)", zIndex:2, pointerEvents:"none" }} />
      <div style={{ position:"absolute", right:0, top:0, bottom:0, width:80, background:"linear-gradient(to left, var(--bg), transparent)", zIndex:2, pointerEvents:"none" }} />
      <div className="marquee-track" style={{ gap:"2.5rem" }}>
        {doubled.map((t,i) => (
          <span key={i} className="flex items-center gap-3 shrink-0" style={{ fontSize:11, fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", color:"var(--text-3)", fontFamily:"var(--font-space-grotesk), system-ui, sans-serif" }}>
            <span style={{ width:5, height:5, borderRadius:"50%", background:"var(--green)", flexShrink:0, display:"inline-block" }} />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Interactive Journey Dashboard ── */
function InteractiveJourney() {
  const [activeStage, setActiveStage] = useState(0);

  return (
    <section id="path" className="py-24 md:py-32 px-6 md:px-16" style={{ background:"var(--bg-2)" }}>
      <div className="max-w-6xl mx-auto">
        <motion.div initial="hidden" whileInView="show" viewport={{ once:true, margin:"-80px" }} variants={stagger} className="mb-16 text-center">
          <motion.p variants={fadeUp} className="flex items-center justify-center gap-2 mb-5 mx-auto" style={{ fontSize:11, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--green)", fontFamily:"var(--font-space-grotesk), system-ui, sans-serif" }}>
             <span style={{ display:"inline-block", width:20, height:1, background:"var(--green)" }} /> The ICAP Journey
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="font-display font-bold tracking-tight leading-tight mx-auto max-w-2xl"
            style={{ fontSize:"clamp(2rem,5vw,3.8rem)", color:"var(--text-1)" }}
          >
            The Real Deal.
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 max-w-xl mx-auto text-lg" style={{ color:"var(--text-2)", fontFamily:"var(--font-inter), sans-serif" }}>
            Every level is a different game. Here is exactly what it takes to win, no fluff.
          </motion.p>
        </motion.div>

        {/* Level Navigation */}
        <div className="flex border-b overflow-x-auto overflow-y-hidden no-scrollbar mb-10 md:mb-16" style={{ borderColor:"var(--border)" }}>
          <div className="flex w-full md:justify-center px-2 md:px-0" style={{ minWidth:"min-content" }}>
            {STAGES.map((s, i) => {
              const isActive = activeStage === i;
              return (
                <button
                  key={s.step}
                  onClick={() => setActiveStage(i)}
                  className="relative px-5 md:px-8 py-4 flex flex-col items-center gap-1.5 group transition-colors flex-shrink-0"
                  style={{ opacity: isActive ? 1 : 0.4 }}
                >
                  <span style={{ fontSize:10, fontWeight:700, letterSpacing:"0.2em", color: isActive ? s.color : "var(--text-2)", fontFamily:"var(--font-space-grotesk), sans-serif", transition:"color 0.3s ease" }}>
                    PHASE {s.step}
                  </span>
                  <span style={{ fontSize:15, fontWeight:700, color:"var(--text-1)", fontFamily:"var(--font-inter), sans-serif" }}>
                    {s.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeJourneyTab"
                      className="absolute bottom-[-1px] left-0 right-0 h-[3px]"
                      style={{ background:s.color, boxShadow:`0 -2px 10px ${s.color}60` }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="relative overflow-hidden rounded-[2rem] p-6 lg:p-12 min-h-[600px] lg:min-h-[550px]" style={{ background:"var(--bg)", border:"1px solid var(--border)", boxShadow:"0 20px 80px rgba(0,0,0,0.6)" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStage}
              initial={{ opacity:0, y:20, filter:"blur(8px)" }}
              animate={{ opacity:1, y:0, filter:"blur(0px)" }}
              exit={{ opacity:0, y:-20, filter:"blur(8px)" }}
              transition={{ duration:0.4, ease:[0.16,1,0.3,1] }}
              className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center h-full"
            >
              {/* Left Side: Truth & Subjects */}
              <div className="flex flex-col h-full justify-center">
                <div className="inline-flex items-center self-start gap-2 mb-6 px-3 py-1 rounded-full" style={{ background:`${STAGES[activeStage].color}15`, border:`1px solid ${STAGES[activeStage].color}30` }}>
                   <span style={{ width:6, height:6, borderRadius:"50%", background:STAGES[activeStage].color, boxShadow:`0 0 8px ${STAGES[activeStage].color}` }} />
                   <span style={{ fontSize:10, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", color:STAGES[activeStage].color, fontFamily:"var(--font-space-grotesk), sans-serif" }}>
                     Phase {STAGES[activeStage].step}
                   </span>
                </div>
                
                <h3 className="font-display font-bold leading-tight mb-6" style={{ fontSize:"clamp(1.6rem,3vw,2.2rem)", color:"var(--text-1)" }}>
                  {STAGES[activeStage].title}
                </h3>
                
                <p className="text-base leading-relaxed mb-6" style={{ color:"var(--text-2)", fontFamily:"var(--font-inter), sans-serif" }}>
                  {STAGES[activeStage].body}
                </p>
                <div className="mb-8 p-5 rounded-xl flex gap-4 items-start" style={{ background:"rgba(255,255,255,0.02)", borderLeft:`3px solid ${STAGES[activeStage].color}` }}>
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color:STAGES[activeStage].color }} />
                  <p className="text-sm font-semibold leading-relaxed" style={{ color:"var(--text-1)", fontFamily:"var(--font-inter), sans-serif", letterSpacing:"0.01em" }}>
                    {STAGES[activeStage].what}
                  </p>
                </div>

                {STAGES[activeStage].subjects.length > 0 && (
                  <div>
                    <h4 className="mb-3" style={{ fontSize:10, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", color:"var(--text-3)", fontFamily:"var(--font-space-grotesk), sans-serif" }}>Tested Subjects</h4>
                    <div className="flex flex-wrap gap-2">
                      {STAGES[activeStage].subjects.map(sub => (
                        <span key={sub} className="px-3 py-1.5 rounded-lg" style={{ fontSize:12, fontWeight:500, background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text-2)", fontFamily:"var(--font-inter), sans-serif" }}>
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Side: Visualizer */}
              <div className="relative w-full aspect-square lg:aspect-auto lg:h-[450px] flex items-center justify-center rounded-2xl overflow-hidden" style={{ background:"rgba(0,0,0,0.15)", border:"1px solid rgba(255,255,255,0.03)", boxShadow:"inset 0 0 50px rgba(0,0,0,0.3)" }}>
                 <JourneyGraphics stageIndex={activeStage} />
              </div>

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function JourneyGraphics({ stageIndex }: { stageIndex: number }) {
  const stage = STAGES[stageIndex];
  
  return (
    <motion.div
      key={stageIndex}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16,1,0.3,1] }}
      className="relative w-full h-full"
    >
      <Image 
        src={stage.image}
        alt={stage.label}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
        priority
      />
      {/* Subtle overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
    </motion.div>
  );
}

/* ── Email Capture ── */
function EmailCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="capture" className="py-32 px-6 md:px-16" style={{ background:"var(--bg-2)", borderTop:"1px solid var(--border)" }}>
      <div className="max-w-4xl mx-auto">
        <motion.div initial="hidden" whileInView="show" viewport={{ once:true }} variants={scaleIn}>
          <div className="relative p-12 md:p-20 text-center rounded-[2.5rem] overflow-hidden" style={{ background:"var(--bg-3)", border:"1px solid rgba(61,179,113,0.15)" }}>
            {/* Glow */}
            <div className="absolute pointer-events-none" style={{ top:0, left:"50%", transform:"translateX(-50%)", width:384, height:160, borderRadius:"50%", opacity:0.18, background:"radial-gradient(circle, #3DB371, transparent 70%)", filter:"blur(40px)" }} />

            <p className="relative flex items-center justify-center gap-2 mb-5" style={{ fontSize:11, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--green)", fontFamily:"var(--font-space-grotesk), system-ui, sans-serif", zIndex:1 }}>
              <span style={{ display:"inline-block", width:20, height:1, background:"var(--green)" }} /> Coming Soon
            </p>
            <h2 className="font-display font-bold tracking-tight mb-6 relative" style={{ fontSize:"clamp(1.8rem,4vw,3rem)", color:"var(--text-1)", zIndex:1 }}>
              The guide I wish existed when I started.
            </h2>
            <p className="text-lg leading-relaxed mb-12 max-w-md mx-auto relative" style={{ color:"var(--text-2)", fontFamily:"var(--font-inter), system-ui, sans-serif", zIndex:1 }}>
              I'm writing a no-fluff guide covering my exact CFAP strategy, time management, and first-attempt blueprint. Drop your email. You'll get it the moment it's ready.
            </p>

            {status === "success" ? (
              <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} className="relative flex items-center justify-center gap-3 px-6 py-4 rounded-full mx-auto max-w-xs" style={{ background:"rgba(61,179,113,0.12)", border:"1px solid rgba(61,179,113,0.3)", zIndex:1 }}>
                <CheckCircle2 className="w-5 h-5" style={{ color:"var(--green)" }} />
                <span className="font-semibold text-sm" style={{ color:"var(--green)", fontFamily:"var(--font-inter), sans-serif" }}>You're on the list. We'll send it soon.</span>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="relative flex flex-col sm:flex-row gap-3 max-w-md mx-auto" style={{ zIndex:1 }}>
                <input
                  type="email" placeholder="your@email.com" required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={status === "loading"}
                  className="flex-1 rounded-full px-5 py-4 text-sm focus:outline-none"
                  style={{ background:"var(--bg)", border:`1px solid ${status === "error" ? "#F87171" : "var(--border)"}`, color:"var(--text-1)", fontFamily:"var(--font-inter), system-ui, sans-serif", transition:"border-color 0.3s" }}
                  onFocus={e => (e.currentTarget.style.borderColor = "var(--green)")}
                  onBlur={e => (e.currentTarget.style.borderColor = status === "error" ? "#F87171" : "var(--border)")}
                />
                <button type="submit" disabled={status === "loading"} className="shimmer-btn shrink-0 font-bold rounded-full px-7 py-4 text-white whitespace-nowrap"
                  style={{ fontSize:14, fontFamily:"var(--font-space-grotesk), system-ui, sans-serif", border:"none", cursor:"pointer", boxShadow:"0 4px 20px rgba(61,179,113,0.3)", opacity: status === "loading" ? 0.7 : 1 }}>
                  {status === "loading" ? "Sending..." : "Notify Me →"}
                </button>
              </form>
            )}
            {status === "error" && (
              <p className="mt-3 text-sm relative" style={{ color:"#F87171", fontFamily:"var(--font-inter), sans-serif", zIndex:1 }}>Something went wrong. Please try again.</p>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════ */
export default function Home() {
  const pageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: pageRef, offset: ["start start","end end"] });
  const lineScale = useTransform(scrollYProgress, [0.12,0.58], [0, 1]);

  const rawX  = useMotionValue(-1000);
  const rawY  = useMotionValue(-1000);
  const orbX  = useSpring(rawX, { damping:28, stiffness:90 });
  const orbY  = useSpring(rawY, { damping:28, stiffness:90 });

  useEffect(() => {
    const move = (e: MouseEvent) => { rawX.set(e.clientX); rawY.set(e.clientY); };
    window.addEventListener("mousemove", move, { passive:true });
    return () => window.removeEventListener("mousemove", move);
  }, [rawX, rawY]);

  return (
    <div ref={pageRef} className="relative">

      {/* Cursor orb */}
      <motion.div
        style={{ left: orbX, top: orbY, translateX:"-50%", translateY:"-50%",
          background:"radial-gradient(circle, rgba(61,179,113,0.13) 0%, rgba(245,166,35,0.05) 50%, transparent 70%)" }}
        className="fixed w-[520px] h-[520px] rounded-full pointer-events-none z-[1]"
      />

      {/* ══ HERO ══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-16 pt-24 pb-16 overflow-hidden">

        {/* Background */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background:"radial-gradient(ellipse 60% 50% at 50% 0%, rgba(61,179,113,0.12) 0%, transparent 65%), radial-gradient(ellipse 40% 40% at 95% 80%, rgba(245,166,35,0.07) 0%, transparent 60%)"
        }} />
        <div className="float-a absolute top-[12%] left-[5%] w-80 h-80 rounded-full pointer-events-none opacity-[0.06]" style={{ background:"radial-gradient(circle, #3DB371, transparent 70%)" }} />

        <div className="relative z-10 w-full max-w-7xl mx-auto">
          
          {/* Mobile purely: Badge on top */}
          <motion.div variants={stagger} initial="hidden" animate="show" className="flex lg:hidden justify-center mb-2">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-3 px-4 py-2 rounded-full" style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
              <span className="relative flex w-[7px] h-[7px]">
                <span className="absolute inline-flex w-full h-full rounded-full opacity-75" style={{ background:"var(--green)", animation:"ping 1.5s cubic-bezier(0,0,0.2,1) infinite" }} />
                <span className="relative rounded-full w-[7px] h-[7px]" style={{ background:"var(--green)" }} />
              </span>
              <span style={{ fontSize:10, fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", color:"var(--text-2)", fontFamily:"var(--font-space-grotesk), system-ui, sans-serif" }}>
                THE ALL-IN-ONE TOOLKIT FOR CA STUDENTS
              </span>
            </motion.div>
          </motion.div>

          {/* ── Two-column grid ── */}
          <div className="grid lg:grid-cols-2 gap-2 lg:gap-16 items-center">

            {/* LEFT - copy */}
            <motion.div variants={stagger} initial="hidden" animate="show" className="order-2 lg:order-1 mt-0">

              {/* Live badge (Desktop only) */}
              <motion.div variants={fadeUp} className="hidden lg:inline-flex items-center gap-3 mb-8 px-4 py-2 rounded-full" style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
                <span className="relative flex w-[7px] h-[7px]">
                  <span className="absolute inline-flex w-full h-full rounded-full opacity-75" style={{ background:"var(--green)", animation:"ping 1.5s cubic-bezier(0,0,0.2,1) infinite" }} />
                  <span className="relative rounded-full w-[7px] h-[7px]" style={{ background:"var(--green)" }} />
                </span>
                <span style={{ fontSize:10, fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", color:"var(--text-2)", fontFamily:"var(--font-space-grotesk), system-ui, sans-serif" }}>
                  THE ALL-IN-ONE TOOLKIT FOR CA STUDENTS
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                variants={fadeUp}
                className="font-display font-bold leading-[1.04] tracking-tight mb-6"
                style={{ fontSize:"clamp(2.5rem,5.5vw,4.8rem)", color:"var(--text-1)" }}
              >
                Top students do not work harder.<br />
                <span style={{ color:"var(--green)" }}>They play a different game.</span>
              </motion.h1>

              {/* Sub */}
              <motion.p
                variants={fadeUp}
                className="text-lg leading-relaxed mb-4 max-w-xl"
                style={{ color:"var(--text-2)", fontFamily:"var(--font-inter), system-ui, sans-serif" }}
              >
                The examiner is not just testing your memory. They are testing how fast you can apply concepts under pressure.
              </motion.p>
              <motion.p
                variants={fadeUp}
                className="text-lg leading-relaxed mb-10 max-w-xl"
                style={{ color:"var(--text-2)", fontFamily:"var(--font-inter), system-ui, sans-serif" }}
              >
                I cleared my finals on the first attempt by practicing smarter. Here is the exact toolkit I built to help you do the same.
              </motion.p>

              {/* CTA */}
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 mb-14">
                <Link
                  href="/practice"
                  className="shimmer-btn inline-flex items-center justify-center gap-2 font-bold rounded-full px-8 py-4 text-white"
                  style={{ fontSize:14, letterSpacing:"0.02em", fontFamily:"var(--font-space-grotesk), system-ui, sans-serif", boxShadow:"0 8px 32px rgba(61,179,113,0.3)", transition:"transform 0.25s ease, box-shadow 0.25s ease" }}
                  onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px) scale(1.02)"; e.currentTarget.style.boxShadow="0 12px 40px rgba(61,179,113,0.45)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 8px 32px rgba(61,179,113,0.3)"; }}
                >
                  Practice MCQs Free <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/cv-maker"
                  className="inline-flex items-center justify-center gap-2 font-bold rounded-full px-8 py-4"
                  style={{ fontSize:14, letterSpacing:"0.02em", fontFamily:"var(--font-space-grotesk), system-ui, sans-serif", color:"var(--text-1)", background:"var(--surface)", border:"1px solid var(--border)", transition:"all 0.25s ease" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(96,165,250,0.5)"; e.currentTarget.style.background = "rgba(96,165,250,0.06)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--surface)"; }}
                >
                  Build Your CV <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>

              {/* Stats - Hidden on mobile, shown on SM+ */}
              <motion.div variants={stagger} className="hidden sm:grid grid-cols-4 gap-6">
                {[
                  { n:"3",  l:"PRC Papers" },
                  { n:"8",  l:"CAF Papers" },
                  { n:"6",  l:"CFAP Papers" },
                  { n:"1",  l:"Strategic Case" },
                ].map(s => (
                  <motion.div key={s.l} variants={scaleIn} className="text-center">
                    <div className="gradient-text font-display font-bold" style={{ fontSize:"clamp(1.8rem,4vw,2.6rem)" }}>{s.n}</div>
                    <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:"var(--text-3)", fontFamily:"var(--font-space-grotesk), system-ui, sans-serif", marginTop:3 }}>{s.l}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* RIGHT - Animated Ecosystem Graphic */}
            <motion.div
              initial={{ opacity:0 }}
              animate={{ opacity:1 }}
              transition={{ duration:1, delay:0.3 }}
              className="relative flex items-center justify-center w-full min-h-[260px] sm:min-h-[500px] order-1 lg:order-2"
            >
              <HeroEcosystem />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ MARQUEE ══ */}
      <Marquee />


      {/* ══ THE PATH ════════════════════════════════════ */}
      <InteractiveJourney />

      {/* ══ MCQ PRACTICE ════════════════════════════════ */}
      <section id="practice" className="py-24 md:py-32 px-6 md:px-16 overflow-hidden" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">

            {/* LEFT – MCQ mockup */}
            <motion.div
              initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} variants={slideLeft}
              className="relative order-2 lg:order-1"
            >
              {/* Glow */}
              <div className="absolute -inset-10 pointer-events-none"
                style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(61,179,113,0.12) 0%, transparent 70%)", filter: "blur(30px)" }} />

              {/* MCQ card mockup */}
              <div className="relative rounded-2xl overflow-hidden"
                style={{ background: "var(--bg-2)", border: "1px solid rgba(61,179,113,0.2)", boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }}>

                {/* Browser bar */}
                <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-3)" }}>
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#f87171" }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#fbbf24" }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#34d399" }} />
                  <div className="flex-1 mx-3 h-5 rounded-md flex items-center px-3" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
                    <span style={{ fontSize: 10, color: "var(--text-3)", fontFamily: "var(--font-inter), sans-serif" }}>thecahub.com/practice</span>
                  </div>
                </div>

                {/* Quiz header bar */}
                <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-3)" }}>
                  <div className="text-xs font-bold px-3 py-1.5 rounded-xl" style={{ color: "var(--text-3)", background: "var(--bg)", border: "1px solid var(--border)" }}>← Exit</div>
                  <div className="text-xs font-black px-3 py-1.5 rounded-xl" style={{ color: "var(--text-1)", background: "var(--bg)", border: "1px solid var(--border)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                    3 <span style={{ color: "var(--text-3)" }}>/ 10</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 w-full" style={{ background: "var(--border)" }}>
                  <div className="h-full" style={{ width: "30%", background: "var(--green)" }} />
                </div>

                {/* Question card */}
                <div className="p-5">
                  <div className="rounded-2xl p-5" style={{ background: "var(--bg-3)", border: "1px solid var(--border)" }}>
                    {/* Chapter tag */}
                    <span className="inline-block text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full mb-4"
                      style={{ color: "var(--green)", background: "rgba(61,179,113,0.10)", border: "1px solid rgba(61,179,113,0.2)" }}>
                      Target Costing
                    </span>

                    {/* Question */}
                    <div className="h-2.5 rounded-full w-full mb-2" style={{ background: "rgba(255,255,255,0.08)" }} />
                    <div className="h-2.5 rounded-full w-5/6 mb-2" style={{ background: "rgba(255,255,255,0.06)" }} />
                    <div className="h-2.5 rounded-full w-4/5 mb-5" style={{ background: "rgba(255,255,255,0.05)" }} />

                    {/* Options */}
                    <div className="flex flex-col gap-2.5">
                      {[
                        { letter: "A", wide: "full",   correct: false, selected: false },
                        { letter: "B", wide: "5/6", correct: true,  selected: true  },
                        { letter: "C", wide: "4/5", correct: false, selected: false },
                        { letter: "D", wide: "3/4", correct: false, selected: false },
                      ].map(opt => (
                        <div key={opt.letter}
                          className="rounded-xl px-3 py-2.5 flex items-center gap-3"
                          style={{
                            border: `1.5px solid ${opt.correct ? "rgba(61,179,113,0.6)" : "var(--border)"}`,
                            background: opt.correct ? "rgba(61,179,113,0.08)" : "var(--bg-2)",
                          }}>
                          <div className="shrink-0 w-5 h-5 rounded-lg flex items-center justify-center text-[9px] font-black"
                            style={{ background: opt.correct ? "var(--green)" : "var(--border)", color: opt.correct ? "#fff" : "var(--text-3)" }}>
                            {opt.letter}
                          </div>
                          <div className="h-1.5 rounded-full flex-1" style={{ width: `${opt.letter === "A" ? 90 : opt.letter === "B" ? 80 : opt.letter === "C" ? 70 : 60}%`, background: opt.correct ? "rgba(61,179,113,0.3)" : "rgba(255,255,255,0.06)" }} />
                          {opt.correct && <div className="text-[10px]" style={{ color: "var(--green)" }}>✓</div>}
                        </div>
                      ))}
                    </div>

                    {/* Explanation */}
                    <div className="mt-4 rounded-xl p-3" style={{ background: "rgba(61,179,113,0.06)", borderLeft: "3px solid var(--green)" }}>
                      <div className="text-[8px] font-black uppercase tracking-widest mb-1.5" style={{ color: "var(--green)" }}>Explanation</div>
                      <div className="h-1.5 rounded-full w-full mb-1" style={{ background: "rgba(255,255,255,0.06)" }} />
                      <div className="h-1.5 rounded-full w-4/5" style={{ background: "rgba(255,255,255,0.04)" }} />
                    </div>

                    {/* Next button */}
                    <div className="mt-4 flex justify-end">
                      <div className="px-4 py-2 rounded-xl text-[9px] font-black tracking-wide text-white"
                        style={{ background: "var(--green)", boxShadow: "0 4px 16px rgba(61,179,113,0.35)" }}>
                        Next Question →
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom */}
                <div className="px-5 py-3 flex items-center justify-between" style={{ borderTop: "1px solid var(--border)", background: "var(--bg-3)" }}>
                  <span style={{ fontSize: 10, color: "var(--text-3)", fontFamily: "var(--font-inter), sans-serif" }}>✦ PRC + CAF — Every question explained</span>
                  <span className="text-xs font-bold" style={{ color: "var(--green)" }}>Free →</span>
                </div>
              </div>

              {/* Floating streak badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                className="absolute -top-4 -left-4 px-4 py-2 rounded-2xl"
                style={{ background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.35)", backdropFilter: "blur(12px)" }}
              >
                <p className="text-xs font-black" style={{ color: "#fbbf24" }}>🔥 5 Streak</p>
              </motion.div>
            </motion.div>

            {/* RIGHT – copy */}
            <motion.div
              initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={stagger}
              className="order-1 lg:order-2"
            >
              <motion.p variants={fadeUp} className="flex items-center gap-2 mb-5"
                style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--green)", fontFamily: "var(--font-space-grotesk), system-ui, sans-serif" }}>
                <span style={{ display: "inline-block", width: 20, height: 1, background: "var(--green)" }} /> Free MCQ Practice
              </motion.p>

              <motion.h2 variants={fadeUp} className="font-display font-bold tracking-tight mb-6"
                style={{ fontSize: "clamp(2rem,5vw,3.6rem)", color: "var(--text-1)", lineHeight: 1.08 }}>
                Practice that<br />
                <span style={{ color: "var(--green)" }}>actually sticks.</span>
              </motion.h2>

              <motion.p variants={fadeUp} className="text-lg leading-relaxed mb-10"
                style={{ color: "var(--text-2)", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                No PDFs. No WhatsApp forwards. A real question engine with instant explanations, chapter-by-chapter drills, random mocks, and a full marathon mode.
              </motion.p>

              <motion.div variants={stagger} className="flex flex-col gap-4 mb-12">
                {[
                  { label: "Topical drills",   body: "Chapter-by-chapter. Master one concept before moving to the next." },
                  { label: "Random mocks",      body: "Mixed questions drawn randomly. Closest thing to the real exam feel." },
                  { label: "Marathon mode",     body: "Every question in one run. Saves progress, auto-resumes where you left off." },
                  { label: "Flag and review",   body: "Bookmark hard questions. Revisit them in one focused session." },
                ].map(f => (
                  <motion.div key={f.label} variants={fadeUp} className="flex items-start gap-4">
                    <div className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black mt-0.5"
                      style={{ background: "rgba(61,179,113,0.12)", color: "var(--green)", border: "1px solid rgba(61,179,113,0.25)" }}>
                      ✓
                    </div>
                    <div>
                      <span className="font-bold text-sm" style={{ color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                        {f.label} —{" "}
                      </span>
                      <span className="text-sm" style={{ color: "var(--text-2)", fontFamily: "var(--font-inter), sans-serif" }}>
                        {f.body}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
                <Link href="/practice"
                  className="shimmer-btn inline-flex items-center justify-center gap-2 font-bold rounded-full px-8 py-4 text-white"
                  style={{ fontSize: 14, fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
                    boxShadow: "0 8px 32px rgba(61,179,113,0.3)", transition: "transform 0.25s ease, box-shadow 0.25s ease" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(61,179,113,0.45)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(61,179,113,0.3)"; }}
                >
                  Start Practicing Free <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/practice"
                  className="inline-flex items-center justify-center gap-2 font-bold rounded-full px-8 py-4"
                  style={{ fontSize: 14, fontFamily: "var(--font-space-grotesk), system-ui, sans-serif", color: "var(--text-1)", background: "var(--surface)", border: "1px solid var(--border)", transition: "all 0.25s ease" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(61,179,113,0.4)"; e.currentTarget.style.background = "rgba(61,179,113,0.05)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--surface)"; }}
                >
                  Browse Subjects <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>


      {/* ══ CV MAKER ══════════════════════════════════════ */}
      <section id="cv-maker" className="py-24 md:py-32 px-6 md:px-16 overflow-hidden" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">

            {/* LEFT – copy */}
            <motion.div
              initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={stagger}
            >
              <motion.p variants={fadeUp} className="flex items-center gap-2 mb-5"
                style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#60A5FA", fontFamily: "var(--font-space-grotesk), system-ui, sans-serif" }}>
                <span style={{ display: "inline-block", width: 20, height: 1, background: "#60A5FA" }} /> Free Tool
              </motion.p>

              <motion.h2 variants={fadeUp} className="font-display font-bold tracking-tight mb-6"
                style={{ fontSize: "clamp(2rem,5vw,3.6rem)", color: "var(--text-1)", lineHeight: 1.08 }}>
                Your ICAP CV.<br />
                <span style={{ color: "#60A5FA" }}>Built for Big 4.</span>
              </motion.h2>

              <motion.p variants={fadeUp} className="text-lg leading-relaxed mb-10"
                style={{ color: "var(--text-2)", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                Recruiting partners see hundreds of CVs. Most are amateur. This builder produces the exact two-column format firms expect — with every ICAP-specific section already included.
              </motion.p>

              <motion.div variants={stagger} className="flex flex-col gap-4 mb-12">
                {[
                  { icon: "✓", label: "RIGHT format", body: "Two-column ICAP induction layout that Big 4 partners actually expect." },
                  { icon: "✓", label: "Complete sections", body: "Education, HOCs, work experience, courses, skills, and references." },
                  { icon: "✓", label: "Instant PDF", body: "Clean, print-ready CV in one click. No Word, no formatting nightmares." },
                  { icon: "✓", label: "Zero cost", body: "Free forever. No sign-up, no paywall, no watermark." },
                ].map(f => (
                  <motion.div key={f.label} variants={fadeUp} className="flex items-start gap-4">
                    <div className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black mt-0.5"
                      style={{ background: "rgba(96,165,250,0.12)", color: "#60A5FA", border: "1px solid rgba(96,165,250,0.25)" }}>
                      {f.icon}
                    </div>
                    <div>
                      <span className="font-bold text-sm" style={{ color: "var(--text-1)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                        {f.label} —{" "}
                      </span>
                      <span className="text-sm" style={{ color: "var(--text-2)", fontFamily: "var(--font-inter), sans-serif" }}>
                        {f.body}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div variants={fadeUp}>
                <Link href="/cv-maker"
                  className="inline-flex items-center gap-2 font-bold rounded-full px-8 py-4 text-white"
                  style={{ fontSize: 14, background: "#60A5FA", fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
                    boxShadow: "0 8px 32px rgba(96,165,250,0.3)", transition: "transform 0.25s ease, box-shadow 0.25s ease" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(96,165,250,0.45)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(96,165,250,0.3)"; }}
                >
                  Build My CV Free <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </motion.div>

            {/* RIGHT – animated CV mockup */}
            <motion.div
              initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} variants={slideRight}
              className="relative"
            >
              {/* Glow blob */}
              <div className="absolute -inset-10 pointer-events-none"
                style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(96,165,250,0.10) 0%, transparent 70%)", filter: "blur(30px)" }} />

              {/* CV card mockup */}
              <div className="relative rounded-2xl overflow-hidden"
                style={{ background: "var(--bg-2)", border: "1px solid rgba(96,165,250,0.2)", boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }}>

                {/* Browser chrome bar */}
                <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-3)" }}>
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#f87171" }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#fbbf24" }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#34d399" }} />
                  <div className="flex-1 mx-3 h-5 rounded-md flex items-center px-3"
                    style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
                    <span style={{ fontSize: 10, color: "var(--text-3)", fontFamily: "var(--font-inter), sans-serif" }}>thecahub.com/cv-maker</span>
                  </div>
                </div>

                {/* Two-column CV preview */}
                <div className="flex gap-0 min-h-[420px]">

                  {/* LEFT sidebar – dark */}
                  <div className="w-[38%] p-5 flex flex-col gap-4"
                    style={{ background: "#0f172a", borderRight: "1px solid rgba(255,255,255,0.04)" }}>
                    {/* Avatar placeholder */}
                    <div className="w-14 h-14 rounded-full mx-auto mb-1"
                      style={{ background: "linear-gradient(135deg, #60A5FA44, #3DB37144)" }} />
                    <div className="text-center mb-2">
                      <div className="h-3 rounded-full w-3/4 mx-auto mb-1.5" style={{ background: "rgba(255,255,255,0.15)" }} />
                      <div className="h-2 rounded-full w-1/2 mx-auto" style={{ background: "rgba(96,165,250,0.4)" }} />
                    </div>
                    {/* Sidebar sections */}
                    {["CONTACT", "EDUCATION", "SKILLS"].map(s => (
                      <div key={s}>
                        <div className="h-1.5 w-10 rounded-full mb-2" style={{ background: "#60A5FA66" }} />
                        <div className="text-[8px] font-black mb-2 tracking-widest" style={{ color: "#60A5FA99" }}>{s}</div>
                        <div className="flex flex-col gap-1">
                          <div className="h-1.5 rounded-full w-full" style={{ background: "rgba(255,255,255,0.07)" }} />
                          <div className="h-1.5 rounded-full w-4/5" style={{ background: "rgba(255,255,255,0.05)" }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* RIGHT main content */}
                  <div className="flex-1 p-5 flex flex-col gap-5" style={{ background: "#0a0a0b" }}>
                    {["WORK EXPERIENCE", "ICAP HOCs", "COURSES & CERTIFICATIONS"].map((section, si) => (
                      <div key={section}>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-[2px] w-4 rounded-full" style={{ background: "#60A5FA" }} />
                          <div className="text-[7px] font-black tracking-widest" style={{ color: "#60A5FA" }}>{section}</div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          {[...Array(si === 0 ? 3 : 2)].map((_, i) => (
                            <div key={i} className="flex flex-col gap-1">
                              <div className="h-2 rounded-full" style={{ width: `${75 - i * 10}%`, background: "rgba(255,255,255,0.1)" }} />
                              <div className="h-1.5 rounded-full w-2/3" style={{ background: "rgba(255,255,255,0.05)" }} />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    {/* "Download PDF" button mockup */}
                    <div className="mt-auto flex justify-end">
                      <div className="px-3 py-1.5 rounded-lg text-[8px] font-black tracking-widest"
                        style={{ background: "rgba(96,165,250,0.15)", border: "1px solid rgba(96,165,250,0.3)", color: "#60A5FA" }}>
                        ⬇ DOWNLOAD PDF
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom badge */}
                <div className="px-5 py-3 flex items-center justify-between" style={{ borderTop: "1px solid var(--border)", background: "var(--bg-3)" }}>
                  <span style={{ fontSize: 10, color: "var(--text-3)", fontFamily: "var(--font-inter), sans-serif" }}>
                    ✦ Built for ICAP induction — Free forever
                  </span>
                  <span className="text-xs font-bold" style={{ color: "#60A5FA" }}>Live →</span>
                </div>
              </div>

              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 px-4 py-2 rounded-2xl"
                style={{ background: "rgba(96,165,250,0.12)", border: "1px solid rgba(96,165,250,0.3)", backdropFilter: "blur(12px)" }}
              >
                <p className="text-xs font-black" style={{ color: "#60A5FA" }}>🎯 Big 4 Ready</p>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ══ ABOUT (AHSAN HERO) ══════════════════════════ */}
      <section id="story" className="inverse-section py-32 px-6 md:px-16 overflow-hidden relative" style={{ background:"var(--bg-2)", borderTop:"1px solid var(--border)", transition:"background 0.35s ease, color 0.35s ease" }}>
        <style dangerouslySetInnerHTML={{ __html: `
          [data-theme="light"] .inverse-section {
             --bg: #0A0A0B;
             --bg-2: #111113;
             --bg-3: #1A1A1D;
             --text-1: #F4F4F5;
             --text-2: #A1A1AA;
             --text-3: #52525B;
             --border: rgba(255, 255, 255, 0.08);
             --surface: rgba(255, 255, 255, 0.04);
          }
          [data-theme="dark"] .inverse-section {
             --bg: #FAFAF9;
             --bg-2: #F1F0EE;
             --bg-3: #E8E7E4;
             --text-1: #111113;
             --text-2: #52525B;
             --text-3: #A1A1AA;
             --border: rgba(0, 0, 0, 0.09);
             --surface: rgba(0, 0, 0, 0.03);
          }
        `}} />
        <div className="max-w-6xl mx-auto relative z-10">

          {/* Section label */}
          <motion.div initial="hidden" whileInView="show" viewport={{ once:true, margin:"-60px" }} variants={stagger} className="text-center mb-16 md:mb-20">
            <motion.p variants={fadeUp} className="flex justify-center items-center gap-2 mb-5" style={{ fontSize:11, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--green)", fontFamily:"var(--font-space-grotesk), system-ui, sans-serif" }}>
              <span style={{ display:"inline-block", width:20, height:1, background:"var(--green)" }} /> Meet The Architect
            </motion.p>
            <motion.h2 variants={fadeUp} className="font-display font-bold tracking-tight" style={{ fontSize:"clamp(2.4rem,5vw,4.2rem)", color:"var(--text-1)", lineHeight:1.06 }}>
              I'm Muhammad Ahsan Siddiq.
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-base md:text-lg max-w-2xl mx-auto" style={{ color:"var(--text-2)", fontFamily:"var(--font-inter), system-ui, sans-serif" }}>
              I am the first student in ICAP's 64-year history to clear all 6 CFAP exams in a single attempt. They literally had to invent a new Gold Medal for it. Here is my exact blueprint.
            </motion.p>
          </motion.div>

          {/* Achievement stat cards */}
          <motion.div initial="hidden" whileInView="show" viewport={{ once:true, margin:"-40px" }} variants={stagger} className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-16 md:mb-20">
            {[
              { num:"6/6", label:"Historical First",         sub:"First to clear 6 in one go.",      color:"#3DB371" },
              { num:"🥇",  label:"Special Gold",      sub:"ICAP made a medal for it.",    color:"#F5A623" },
              { num:"3",  label:"Concurrent",     sub:"ICAP • ACCA • CFA L1", color:"#60A5FA" },
              { num:"1",   label:"Blueprint",      sub:"Maximum impact, zero fluff.",    color:"#A78BFA" },
            ].map((s) => (
              <motion.div
                key={s.label}
                variants={scaleIn}
                className="flex flex-col items-center text-center p-5 md:p-6 rounded-2xl"
                style={{ background:"var(--bg-3)", border:`1px solid ${s.color}22`, transition:"transform 0.3s ease, box-shadow 0.3s ease" }}
                onMouseEnter={e => { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow=`0 12px 40px ${s.color}22`; }}
                onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none"; }}
              >
                <div className="font-display font-bold mb-1 md:mb-2" style={{ fontSize:"clamp(1.75rem,4vw,2.5rem)", color:s.color, lineHeight:1 }}>{s.num}</div>
                <div className="font-sans font-bold text-xs md:text-sm" style={{ color:"var(--text-1)", fontFamily:"var(--font-space-grotesk), system-ui, sans-serif", marginBottom:2 }}>{s.label}</div>
                <div style={{ fontSize:10, color:"var(--text-3)", fontFamily:"var(--font-inter), system-ui, sans-serif" }}>{s.sub}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Main two-column: portrait + story */}
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 items-center lg:items-start">

            {/* Photo */}
            <motion.div initial="hidden" whileInView="show" viewport={{ once:true, margin:"-80px" }} variants={slideLeft} className="w-full max-w-[320px] lg:max-w-none lg:w-[40%] shrink-0">
              <div className="relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden group" style={{ aspectRatio:"4/5" }}>
                <Image src="/MAS.jpeg" alt="Muhammad Ahsan Siddiq" fill className="object-cover object-top transition-transform duration-700 group-hover:scale-105" priority />
                <div className="absolute inset-0" style={{ background:"linear-gradient(to top, var(--bg-2) 0%, transparent 50%)" }} />
                <motion.div
                  initial={{ opacity:0, y:20, scale:0.92 }}
                  whileInView={{ opacity:1, y:0, scale:1 }}
                  viewport={{ once:true }}
                  transition={{ delay:0.4, duration:0.7, ease:[0.16,1,0.3,1] }}
                  className="absolute bottom-5 left-5 right-5 md:bottom-7 md:left-6 md:right-6 p-4 md:p-5 rounded-2xl backdrop-blur-2xl"
                  style={{ background:"rgba(10,10,11,0.75)", border:"1px solid rgba(61,179,113,0.3)" }}
                >
                  <p className="font-display font-bold" style={{ fontSize:20, color:"#F4F4F5", lineHeight:1.2 }}>Historical Record</p>
                  <p style={{ fontSize:12, color:"#A1A1AA", marginTop:4, fontFamily:"var(--font-inter), system-ui, sans-serif" }}>1st student in ICAP's 64-year history</p>
                </motion.div>
              </div>
            </motion.div>

            {/* Story copy */}
            <motion.div initial="hidden" whileInView="show" viewport={{ once:true, margin:"-80px" }} variants={stagger} className="w-full lg:w-[60%] pt-2 lg:pt-4">

              <motion.div variants={fadeUp} className="mb-8 md:mb-10 text-center lg:text-left">
                <p className="font-display font-bold" style={{ fontSize:"clamp(1.4rem,3vw,2rem)", color:"var(--text-1)", lineHeight:1.3 }}>
                  When I decided to attempt 6 CFAP papers at once while pursuing ACCA and CFA Level I, people called it impossible. <span style={{ color:"var(--green)" }}>I proved it's just a formula.</span>
                </p>
              </motion.div>

              <motion.div variants={stagger} className="grid sm:grid-cols-1 gap-4 md:gap-5">
                {[
                  { label:"The Mission", text:"I saw brilliant minds burning out under bad advice. I'm not here to sell a boring course. I stripped down years of exam intelligence into a brutal toolkit to make you unfailing." },
                ].map((item) => (
                  <motion.div key={item.label} variants={fadeUp} className="p-5 md:p-6 rounded-2xl" style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
                    <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", color:"var(--green)", fontFamily:"var(--font-space-grotesk), system-ui, sans-serif", marginBottom:8 }}>{item.label}</p>
                    <p className="text-sm md:text-base leading-relaxed" style={{ color:"var(--text-2)", fontFamily:"var(--font-inter), system-ui, sans-serif" }}>{item.text}</p>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-wrap justify-center lg:justify-start gap-2 md:gap-3 mt-8 md:mt-10">
                {["🥇 ICAP Gold Medal","✅ ACCA Affiliate","📈 CFA Level I","💡 Educator"].map(c => (
                  <span key={c} className="rounded-full px-4 py-2 text-xs md:text-sm font-semibold" style={{ background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text-1)", fontFamily:"var(--font-inter), system-ui, sans-serif" }}>
                    {c}
                  </span>
                ))}
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ══ BLOGS ════════════════════════════════════════ */}
      <section id="articles" className="py-32 px-6 md:px-16" style={{ borderTop:"1px solid var(--border)" }}>
        <div className="max-w-6xl mx-auto">

          <motion.div initial="hidden" whileInView="show" viewport={{ once:true }} variants={stagger}
            className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <motion.p variants={fadeUp} className="flex items-center gap-2 mb-5" style={{ fontSize:11, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--green)", fontFamily:"var(--font-space-grotesk), system-ui, sans-serif" }}>
                <span style={{ display:"inline-block", width:20, height:1, background:"var(--green)" }} /> Blogs
              </motion.p>
              <motion.h2 variants={fadeUp} className="font-display font-bold tracking-tight" style={{ fontSize:"clamp(2rem,5vw,3.8rem)", color:"var(--text-1)" }}>
                Things I wish my seniors told me.
              </motion.h2>
            </div>
            <motion.div variants={fadeUp}>
              <Link href="/blog" className="inline-flex items-center gap-2 font-semibold rounded-full px-6 py-3 shrink-0"
                style={{ fontSize:14, color:"var(--text-1)", background:"var(--surface)", border:"1px solid var(--border)", fontFamily:"var(--font-space-grotesk), system-ui, sans-serif" }}>
                All Blogs →
              </Link>
            </motion.div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {blogs.slice(0, 3).map((a, i) => (
              <motion.div key={a.title} initial="hidden" whileInView="show" viewport={{ once:true, margin:"-40px" }} variants={fadeUp} transition={{ delay: i*0.1 }}>
                <Link href={`/blog/${a.slug}`} className="block h-full p-8 rounded-2xl group/card"
                  style={{ background:"var(--bg-2)", border:"1px solid var(--border)", textDecoration:"none", display:"flex", flexDirection:"column", transition:"transform 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease" }}
                  onMouseEnter={e => { e.currentTarget.style.transform="translateY(-5px)"; e.currentTarget.style.borderColor="rgba(61,179,113,0.25)"; e.currentTarget.style.boxShadow="0 16px 50px rgba(0,0,0,0.2)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.boxShadow="none"; }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <span className="rounded-full px-3 py-1" style={{ fontSize:10, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", background:"rgba(61,179,113,0.1)", color:"var(--green)", fontFamily:"var(--font-space-grotesk), system-ui, sans-serif" }}>
                      {a.tag}
                    </span>
                    <span style={{ fontSize:11, color:"var(--text-3)", fontFamily:"var(--font-inter), system-ui, sans-serif" }}>{a.readTime}</span>
                  </div>
                  <h3 className="font-sans font-bold text-lg leading-snug mb-4 flex-1" style={{ color:"var(--text-1)", fontFamily:"var(--font-space-grotesk), system-ui, sans-serif", transition:"color 0.3s" }}>
                    {a.title}
                  </h3>
                  <p className="text-sm leading-relaxed mb-8" style={{ color:"var(--text-2)", fontFamily:"var(--font-inter), system-ui, sans-serif" }}>{a.excerpt}</p>
                  <div className="flex items-center gap-2 font-semibold text-sm" style={{ color:"var(--green)", fontFamily:"var(--font-space-grotesk), system-ui, sans-serif" }}>
                    Read <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ YOUTUBE ════════════════════════════════════════ */}
      <section id="youtube" className="py-24 px-6 md:px-16" style={{ background: "var(--bg)", borderTop: "1px solid var(--border)" }}>
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="mb-12 text-center">
            <p className="flex items-center justify-center gap-2 mb-4" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--green)", fontFamily: "var(--font-space-grotesk), sans-serif" }}>
              <span style={{ display: "inline-block", width: 20, height: 1, background: "var(--green)" }} /> On YouTube
            </p>
            <h2 className="font-display font-bold mb-4" style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", color: "var(--text-1)" }}>
              Watch. Learn. Dominate.
            </h2>
            <p className="max-w-lg mx-auto text-base" style={{ color: "var(--text-2)", fontFamily: "var(--font-inter), sans-serif" }}>
              Real CA exam breakdowns, study strategy, and career advice — no fluff.
            </p>
          </motion.div>

          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {[
              { id: "hzkd6RutgyI", title: "CAF Group A in 1 Attempt | The Complete Roadmap" },
              { id: "oR2VUTb-nag", title: "6 CFAP Papers in 6 Months | The Complete Strategy" },
              { id: "QJERn3hr974", title: "CAF Group B in 1 Attempt | Part 1 | Complete Strategy" },
            ].map((v) => (
              <motion.div key={v.id} variants={fadeUp} className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)", background: "var(--bg-2)" }}>
                <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${v.id}`}
                    title={v.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                    style={{ border: "none" }}
                  />
                </div>
                <div className="p-4">
                  <p className="font-semibold text-sm leading-snug" style={{ color: "var(--text-1)", fontFamily: "var(--font-inter), sans-serif" }}>{v.title}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center">
            <a href="https://www.youtube.com/@AhsanSiddiq" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-bold rounded-full px-7 py-3 text-sm"
              style={{ background: "#FF0000", color: "#fff", fontFamily: "var(--font-space-grotesk), sans-serif", boxShadow: "0 4px 20px rgba(255,0,0,0.25)", textDecoration: "none" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              Subscribe on YouTube
            </a>
          </div>
        </div>
      </section>

      {/* ══ WHATSAPP COMMUNITY ════════════════════════════ */}
      <section id="community" className="py-24 px-6 md:px-16" style={{ background: "var(--bg-2)", borderTop: "1px solid var(--border)" }}>
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={scaleIn}>
            <div className="relative p-10 md:p-16 text-center rounded-[2.5rem] overflow-hidden" style={{ background: "var(--bg-3)", border: "1px solid rgba(37,211,102,0.15)" }}>
              <div className="absolute pointer-events-none" style={{ top: 0, left: "50%", transform: "translateX(-50%)", width: 320, height: 140, borderRadius: "50%", opacity: 0.15, background: "radial-gradient(circle, #25D366, transparent 70%)", filter: "blur(40px)" }} />
              <p className="relative flex items-center justify-center gap-2 mb-5" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#25D366", fontFamily: "var(--font-space-grotesk), sans-serif", zIndex: 1 }}>
                <span style={{ display: "inline-block", width: 20, height: 1, background: "#25D366" }} /> Community
              </p>
              <h2 className="font-display font-bold mb-4 relative" style={{ fontSize: "clamp(1.6rem,3.5vw,2.5rem)", color: "var(--text-1)", zIndex: 1 }}>
                Join the WhatsApp Community
              </h2>
              <p className="text-base leading-relaxed mb-10 max-w-md mx-auto relative" style={{ color: "var(--text-2)", fontFamily: "var(--font-inter), sans-serif", zIndex: 1 }}>
                CA students helping CA students. Ask questions, share notes, stay accountable. Free to join.
              </p>
              <a href="https://chat.whatsapp.com/IFrgdQZb3z4HfFVwPfITp9" target="_blank" rel="noopener noreferrer"
                className="relative inline-flex items-center gap-3 font-bold rounded-full px-8 py-4 text-white text-sm"
                style={{ background: "linear-gradient(135deg, #25D366, #128C7E)", fontFamily: "var(--font-space-grotesk), sans-serif", boxShadow: "0 4px 24px rgba(37,211,102,0.35)", textDecoration: "none", zIndex: 1 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Join the Community
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ EMAIL CAPTURE ════════════════════════════════ */}
      <EmailCapture />



    </div>
  );
}
