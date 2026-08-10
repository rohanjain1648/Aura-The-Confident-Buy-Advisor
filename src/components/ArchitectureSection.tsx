"use client";

import { ShieldCheck, Server, Lock, Cpu, Database, RefreshCw, Terminal, CheckCircle2 } from "lucide-react";

export default function ArchitectureSection() {
  const highlights = [
    {
      icon: Lock,
      title: "Zero API Key Leakage",
      color: "text-rose-400",
      desc: "All YouCam S2S tokens and secret headers strictly remain inside Next.js Route Handlers. Client components only receive sanitized, pre-scored JSON verdicts.",
    },
    {
      icon: RefreshCw,
      title: "SSE Live Progress Streaming",
      color: "text-purple-400",
      desc: "During onboarding scan, progress streams to the browser over Server-Sent Events (SSE) so users see granular step updates without UI latency.",
    },
    {
      icon: Cpu,
      title: "Pure CIELAB Color Engine",
      color: "text-cyan-400",
      desc: "Garment color harmony calculates Euclidean distance (ΔE) between user skin undertone L*a*b* coordinates and fabric pigments.",
    },
    {
      icon: Database,
      title: "Prisma & SQLite Session Store",
      color: "text-amber-400",
      desc: "Anonymous session state is automatically created via middleware cookie and persisted to SQLite via Prisma 7 driver adapters.",
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-8 relative z-10">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-panel border border-emerald-500/30 text-xs font-mono text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>ENGINEERING & PRIVACY STANDARDS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Built to Win the Hackathon. <br />
            <span className="text-gradient-aura">Architected for Production.</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            Single Next.js deployable with zero client-side key exposure, fast Prisma local database, and pure functional color science.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="glass-panel-interactive rounded-3xl p-7 border-white/10 flex items-start gap-5 group"
              >
                <div className="p-3.5 rounded-2xl glass-panel bg-slate-900 border border-white/10 group-hover:scale-110 transition-transform">
                  <Icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-rose-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Code / Pipeline Diagram Card */}
        <div className="glass-panel rounded-3xl p-8 border border-white/15 bg-slate-950/80 font-mono text-xs text-slate-300 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-rose-400" />
              <span className="text-white font-bold">DETERMINISTIC CONFIDENCE SCORING CONTRACT</span>
            </div>
            <span className="text-[11px] text-purple-400">src/domain/scoring.ts</span>
          </div>

          <pre className="overflow-x-auto p-4 rounded-xl bg-slate-900 border border-white/5 text-slate-300 leading-relaxed">
{`// Confidence Score Calculation Matrix
export function computeConfidenceScore(passport: SkinPassport, product: Product): Verdict {
  if (product.type === "apparel") {
    const deltaE = calculateCielabDeltaE(passport.undertone.cielab, product.colorCoordinates);
    const harmony = Math.max(0, 100 - deltaE * 4.2);
    return { score: Math.round(harmony), rationale: "Color Harmony + YouCam Cloth VTO" };
  } else {
    const shadeMatch = calculateShadeProximity(passport.undertone, product.shade);
    const concernBonus = product.targetsConcern === passport.primaryConcern ? 15 : 0;
    return { score: Math.min(99, Math.round(shadeMatch + concernBonus)), rationale: "Shade Match + Target Concern" };
  }
}`}
          </pre>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Pure Functional Function (No Side Effects)
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 100% Vitest Unit Covered
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
