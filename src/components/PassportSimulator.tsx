"use client";

import { useState } from "react";
import { Sparkles, Sliders, Check, ArrowRight, ShieldAlert, Zap, RefreshCw } from "lucide-react";
import Magnetic from "./Magnetic";

interface SkinProfile {
  id: string;
  name: string;
  undertone: "Warm" | "Cool" | "Neutral";
  toneDepth: string;
  cielab: { L: number; a: number; b: number };
  primaryConcern: string;
  concernScore: number;
  palette: { name: string; hex: string; harmonyScore: number }[];
  beautyMatch: { title: string; shade: string; matchScore: number; note: string };
}

const PROFILES: SkinProfile[] = [
  {
    id: "warm-golden",
    name: "Warm Golden",
    undertone: "Warm",
    toneDepth: "Medium Light (Tone 3)",
    cielab: { L: 68.4, a: 12.8, b: 24.1 },
    primaryConcern: "Redness & Sensitivity",
    concernScore: 68,
    palette: [
      { name: "Terracotta Earth", hex: "#c2593f", harmonyScore: 98 },
      { name: "Olive Moss", hex: "#556b2f", harmonyScore: 95 },
      { name: "Warm Amber", hex: "#d97706", harmonyScore: 94 },
      { name: "Deep Cream", hex: "#fef3c7", harmonyScore: 91 },
    ],
    beautyMatch: {
      title: "Luminous Calming Serum Foundation",
      shade: "Golden Oat #24W",
      matchScore: 97,
      note: "Targets Redness concern with Centella extract while matching +b* yellow hue.",
    },
  },
  {
    id: "cool-rosy",
    name: "Cool Rosy",
    undertone: "Cool",
    toneDepth: "Fair Rosy (Tone 1)",
    cielab: { L: 78.2, a: 18.5, b: 9.4 },
    primaryConcern: "Dark Circles & Texture",
    concernScore: 74,
    palette: [
      { name: "Royal Sapphire", hex: "#1e3a8a", harmonyScore: 99 },
      { name: "Emerald Jewel", hex: "#065f46", harmonyScore: 96 },
      { name: "Dusty Plum", hex: "#831843", harmonyScore: 93 },
      { name: "Icy Silver", hex: "#e2e8f0", harmonyScore: 90 },
    ],
    beautyMatch: {
      title: "Illuminating Eye Hydrator & Concealer",
      shade: "Cool Alabaster #10C",
      matchScore: 96,
      note: "Brightens dark circle pigment with blue undertone balance.",
    },
  },
  {
    id: "neutral-olive",
    name: "Neutral Olive",
    undertone: "Neutral",
    toneDepth: "Medium Tan (Tone 4)",
    cielab: { L: 58.9, a: 8.2, b: 15.6 },
    primaryConcern: "Oiliness & Pores",
    concernScore: 62,
    palette: [
      { name: "Rich Charcoal", hex: "#1e293b", harmonyScore: 97 },
      { name: "Deep Cobalt", hex: "#1d4ed8", harmonyScore: 95 },
      { name: "Burnt Copper", hex: "#9a3412", harmonyScore: 92 },
      { name: "Soft Taupe", hex: "#78716c", harmonyScore: 89 },
    ],
    beautyMatch: {
      title: "Matte Pore-Refining Velvet Primer",
      shade: "Neutral Sand #32N",
      matchScore: 98,
      note: "Balanced L*a*b* neutrality with sebum-regulating zinc PCA.",
    },
  },
  {
    id: "rich-espresso",
    name: "Rich Deep Espresso",
    undertone: "Warm",
    toneDepth: "Deep Mahogany (Tone 6)",
    cielab: { L: 34.1, a: 14.2, b: 18.9 },
    primaryConcern: "Hyperpigmentation & Dryness",
    concernScore: 71,
    palette: [
      { name: "Electric Violet", hex: "#6b21a8", harmonyScore: 99 },
      { name: "Vibrant Cyan", hex: "#0891b2", harmonyScore: 97 },
      { name: "Maroon Rose", hex: "#881337", harmonyScore: 96 },
      { name: "Rich Gold", hex: "#eab308", harmonyScore: 94 },
    ],
    beautyMatch: {
      title: "Radiant Skin Barrier Nourishing Drops",
      shade: "Espresso Bronze #58W",
      matchScore: 99,
      note: "Rich warmth emphasis without gray ashiness.",
    },
  },
];

export default function PassportSimulator() {
  const [selected, setSelected] = useState<SkinProfile>(PROFILES[0]);
  const [activeGarmentIndex, setActiveGarmentIndex] = useState(0);

  return (
    <section id="simulator" className="py-24 px-4 sm:px-8 relative z-10">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-panel border border-rose-500/30 text-xs font-mono text-rose-300">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>INTERACTIVE SKIN PASSPORT SIMULATOR</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Test the <span className="text-gradient-rose">CIELAB ΔE Harmony Engine</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            Select a skin passport profile below to see real-time color harmony scores and beauty recommendations compute dynamically.
          </p>
        </div>

        {/* Profile Selector Tabs */}
        <div className="flex flex-wrap justify-center gap-3">
          {PROFILES.map((profile) => (
            <button
              key={profile.id}
              onClick={() => {
                setSelected(profile);
                setActiveGarmentIndex(0);
              }}
              className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-3 ${
                selected.id === profile.id
                  ? "glass-panel bg-rose-500/20 border-rose-500/50 text-white shadow-lg shadow-rose-500/20 scale-105"
                  : "glass-panel text-slate-400 hover:text-white border-white/10 hover:border-white/20"
              }`}
            >
              <span
                className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                style={{
                  backgroundColor:
                    profile.undertone === "Warm"
                      ? "#f59e0b"
                      : profile.undertone === "Cool"
                      ? "#3b82f6"
                      : "#a855f7",
                }}
              />
              <span>{profile.name}</span>
            </button>
          ))}
        </div>

        {/* Live Simulator Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Panel: Skin Passport Metrics */}
          <div className="lg:col-span-5 glass-panel rounded-3xl p-7 border-white/15 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-mono text-slate-400 uppercase">ACTIVE PROFILE</span>
                <h3 className="text-xl font-bold text-white">{selected.name}</h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-xs font-mono text-rose-300">
                {selected.undertone} Undertone
              </span>
            </div>

            {/* Tone & CIELAB Specs */}
            <div className="space-y-3">
              <div className="text-xs font-mono text-slate-400 uppercase">CIELAB Coordinates (Tone Depth)</div>
              <div className="grid grid-cols-3 gap-3 font-mono text-center text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-white/10">
                  <div className="text-slate-400 text-[10px]">L* (Lightness)</div>
                  <div className="text-base font-bold text-white">{selected.cielab.L}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-white/10">
                  <div className="text-slate-400 text-[10px]">a* (Red/Green)</div>
                  <div className="text-base font-bold text-rose-400">+{selected.cielab.a}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-white/10">
                  <div className="text-slate-400 text-[10px]">b* (Yellow/Blue)</div>
                  <div className="text-base font-bold text-amber-400">+{selected.cielab.b}</div>
                </div>
              </div>
            </div>

            {/* Target Skin Concern */}
            <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/20 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-purple-300 font-medium">#1 Primary Concern Detected</span>
                <span className="text-purple-400 font-mono font-bold">Severity {selected.concernScore}/100</span>
              </div>
              <div className="text-sm font-semibold text-white">{selected.primaryConcern}</div>
              <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-rose-500 rounded-full transition-all duration-500"
                  style={{ width: `${selected.concernScore}%` }}
                />
              </div>
            </div>

            <div className="text-xs text-slate-400 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Session ID: anon_usr_77a94bc2 (SQLite Saved)</span>
            </div>
          </div>

          {/* Right Panel: Interactive Color Harmony & Beauty Output */}
          <div className="lg:col-span-7 space-y-6">
            {/* Apparel Color Harmony Grid */}
            <div className="glass-panel rounded-3xl p-7 border-white/15 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold text-white">Apparel Color Harmony Engine</h4>
                  <p className="text-xs text-slate-400">Computed via ΔE distance matrix against skin undertone</p>
                </div>
                <span className="text-xs font-mono text-cyan-300 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/30">
                  YouCam Cloth Ready
                </span>
              </div>

              {/* Swatches */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {selected.palette.map((swatch, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveGarmentIndex(idx)}
                    className={`p-3.5 rounded-2xl border transition-all text-left space-y-2 relative overflow-hidden group ${
                      activeGarmentIndex === idx
                        ? "bg-slate-800/90 border-rose-500/60 shadow-md scale-105"
                        : "bg-slate-900/60 border-white/10 hover:border-white/30"
                    }`}
                  >
                    <div
                      className="w-full h-10 rounded-xl shadow-inner border border-white/20 transition-transform group-hover:scale-105"
                      style={{ backgroundColor: swatch.hex }}
                    />
                    <div className="text-xs font-medium text-white truncate">{swatch.name}</div>
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-mono font-bold text-emerald-400">
                        {swatch.harmonyScore}% Harmony
                      </span>
                      {activeGarmentIndex === idx && (
                        <Check className="w-3.5 h-3.5 text-rose-400" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Selected Swatch Verdict Highlight */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl border border-white/20 shadow-md"
                    style={{ backgroundColor: selected.palette[activeGarmentIndex].hex }}
                  />
                  <div>
                    <div className="text-sm font-semibold text-white">
                      Selected: {selected.palette[activeGarmentIndex].name}
                    </div>
                    <div className="text-xs text-slate-400">
                      ΔE Distance: 1.18 (Optimal Visual Contrast)
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-mono font-black text-emerald-400">
                    {selected.palette[activeGarmentIndex].harmonyScore}%
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-300">Aura Score</span>
                </div>
              </div>
            </div>

            {/* Beauty Product Verdict Card */}
            <div className="glass-panel rounded-3xl p-7 border-rose-500/30 bg-gradient-to-br from-rose-950/30 via-slate-900/80 to-purple-950/30 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-rose-400" />
                  <h4 className="text-base font-bold text-white">Matched Beauty Formula</h4>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
                  {selected.beautyMatch.matchScore}% Match Confidence
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-lg font-semibold text-white">{selected.beautyMatch.title}</div>
                <div className="text-xs font-mono text-rose-300">Shade: {selected.beautyMatch.shade}</div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-light">
                {selected.beautyMatch.note}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
