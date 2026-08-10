"use client";

import { Cpu, Palette, Sparkles, Shirt, ShieldCheck, ArrowRight, CheckCircle } from "lucide-react";

export default function PipelineSection() {
  const steps = [
    {
      id: "01",
      api: "skin-tone-analysis",
      title: "Undertone & Melanin Extraction",
      color: "from-amber-500 to-rose-500",
      accent: "text-amber-400",
      border: "border-amber-500/30",
      desc: "Extracts precise skin undertone (warm, cool, neutral) and tone depth using CIELAB color space coordinates. Eliminates harsh lighting distortion.",
      outputs: ["L*a*b* Coordinates", "Seasonal Palette", "Melanin Index"],
    },
    {
      id: "02",
      api: "skin-analysis",
      title: "8-Concern Bio Scan",
      color: "from-rose-500 to-purple-600",
      accent: "text-rose-400",
      border: "border-rose-500/30",
      desc: "Scans for 8 clinical concerns: redness, oiliness, texture, spots, pores, wrinkles, dark circles, and acne — ranking primary targeting priorities.",
      outputs: ["Concern Priority #1", "Texture Severity Score", "Hydration Profile"],
    },
    {
      id: "03",
      api: "cloth",
      title: "Photorealistic Apparel VTO",
      color: "from-cyan-500 to-indigo-600",
      accent: "text-cyan-400",
      border: "border-cyan-500/30",
      desc: "Renders Virtual Try-On directly onto the user's uploaded selfie using YouCam S2S cloth texture-warping and drape mechanics.",
      outputs: ["Drape Fit Simulation", "Texture Mapping", "Lighting Realism"],
    },
  ];

  return (
    <section id="pipeline" className="py-24 px-4 sm:px-8 relative z-10">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-panel border border-purple-500/30 text-xs font-mono text-purple-300">
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            <span>UNIFIED DECISION ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Three YouCam APIs. <br />
            <span className="text-gradient-aura">One Shared Context. Zero Silos.</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            Hackathons penalize submissions that bolt features side-by-side. Aura unifies skin tone, concern metrics, and apparel try-on behind a single deterministic decision engine.
          </p>
        </div>

        {/* 3 Steps Pipeline Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`glass-panel-interactive rounded-3xl p-7 border ${step.border} relative flex flex-col justify-between group`}
            >
              {/* Step number badge */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-3xl font-black font-mono text-white/30 group-hover:text-white/60 transition">
                  {step.id}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
                  {step.api}
                </span>
              </div>

              {/* Title & Desc */}
              <div className="space-y-3 mb-6">
                <h3 className={`text-xl font-bold text-white group-hover:${step.accent} transition-colors`}>
                  {step.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed font-light">
                  {step.desc}
                </p>
              </div>

              {/* Output Tags */}
              <div className="pt-4 border-t border-white/10 space-y-2">
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  Extracted Signals:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {step.outputs.map((out, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-slate-900/80 text-slate-300 border border-white/5"
                    >
                      <CheckCircle className={`w-3 h-3 ${step.accent}`} />
                      <span>{out}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Central Engine Convergence Card */}
        <div className="glass-panel rounded-3xl p-8 border border-purple-500/30 bg-gradient-to-r from-purple-950/40 via-slate-900/60 to-rose-950/40 relative overflow-hidden text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-3">
            <h3 className="text-2xl font-bold text-white">
              The Result: The <span className="text-gradient-aura">Skin Passport</span>
            </h3>
            <p className="text-sm text-slate-300">
              Every PDP request queries the session's stored Passport — calculating garment color harmony, foundation shade match, and concern targeting with zero redundant API calls.
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4 text-xs font-mono text-slate-300 pt-2">
            <div className="px-4 py-2 rounded-xl bg-black/60 border border-white/10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Session Persisted</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-black/60 border border-white/10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span>CIELAB ΔE Harmony Engine</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-black/60 border border-white/10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Pure Server Route Handlers</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
