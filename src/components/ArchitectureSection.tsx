"use client";

import { ShieldCheck, Lock, Cpu, Database, RefreshCw } from "lucide-react";

export default function ArchitectureSection() {
  const highlights = [
    {
      icon: Lock,
      title: "Zero API Key Leakage",
      color: "text-rose-600",
      pill: "bg-rose-50 border-rose-200",
      desc: "All YouCam S2S tokens and secret headers strictly remain inside Next.js Route Handlers. Client components only receive sanitized, pre-scored JSON verdicts.",
    },
    {
      icon: RefreshCw,
      title: "SSE Live Progress Streaming",
      color: "text-purple-600",
      pill: "bg-purple-50 border-purple-200",
      desc: "During onboarding scan, progress streams to the browser over Server-Sent Events (SSE) so users see granular step updates without UI latency.",
    },
    {
      icon: Cpu,
      title: "Pure CIELAB Color Engine",
      color: "text-sky-600",
      pill: "bg-sky-50 border-sky-200",
      desc: "Garment color harmony calculates Euclidean distance (ΔE) between user skin undertone L*a*b* coordinates and fabric pigments.",
    },
    {
      icon: Database,
      title: "Prisma & SQLite Session Store",
      color: "text-amber-600",
      pill: "bg-amber-50 border-amber-200",
      desc: "Anonymous session state is automatically created via middleware cookie and persisted to SQLite via Prisma 7 driver adapters.",
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-8 relative z-10">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-mono font-semibold text-emerald-700 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>ENGINEERING & PRIVACY STANDARDS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-neutral-950 tracking-tight">
            Built to Win the Hackathon. <br />
            <span className="text-gradient-aura">Architected for Production.</span>
          </h2>
          <p className="text-neutral-600 text-base sm:text-lg">
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
                className="bg-white rounded-3xl p-7 border border-neutral-200/90 shadow-sm hover:shadow-xl hover:border-neutral-300 transition-all flex items-start gap-5 group"
              >
                <div className={`p-3.5 rounded-2xl border ${item.pill} group-hover:scale-105 transition-transform shrink-0`}>
                  <Icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-neutral-950">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
