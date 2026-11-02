"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Sliders, Check, Zap, Layers, RefreshCw } from "lucide-react";
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
      note: "Niacinamide + Ceramide lipid complex designed for high-melanin protection.",
    },
  },
];

export default function PassportSimulator() {
  const [selectedProfile, setSelectedProfile] = useState<SkinProfile>(PROFILES[0]);

  return (
    <section id="simulator" className="py-24 px-4 sm:px-8 relative z-10">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-xs font-mono font-semibold text-rose-700 shadow-xs">
            <Sliders className="w-3.5 h-3.5 text-rose-600" />
            <span>INTERACTIVE SKIN PASSPORT SIMULATOR</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-neutral-950 tracking-tight">
            Select a Diverse Profile. <br />
            <span className="text-gradient-rose">Watch Verdicts Recalculate Live.</span>
          </h2>
          <p className="text-neutral-600 text-base sm:text-lg">
            Switch between tone archetypes to explore how YouCam tone analysis dynamically outputs color harmony swatches and clinical beauty targets.
          </p>
        </div>

        {/* Profile Selector Pills */}
        <div className="flex flex-wrap justify-center gap-3">
          {PROFILES.map((profile) => (
            <button
              key={profile.id}
              onClick={() => setSelectedProfile(profile)}
              className={`px-6 py-3 rounded-full text-xs font-bold font-mono tracking-wide transition-all ${
                selectedProfile.id === profile.id
                  ? "bg-neutral-950 text-white shadow-lg shadow-neutral-950/20 scale-105"
                  : "bg-white text-neutral-700 border border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50 shadow-xs"
              }`}
            >
              {profile.name} ({profile.undertone})
            </button>
          ))}
        </div>

        {/* Interactive Bento Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedProfile.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Left Card: Passport Metrics (4 cols) */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-7 border border-neutral-200/90 shadow-sm flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-rose-500" />
                    <span className="font-mono text-xs font-bold uppercase text-neutral-950">
                      Skin Passport v2
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-bold">
                    VALIDATED
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-black text-neutral-950">
                    {selectedProfile.name}
                  </h3>
                  <div className="text-sm font-semibold text-neutral-500 mt-1">
                    {selectedProfile.toneDepth}
                  </div>
                </div>

                {/* CIELAB coordinates chip */}
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2">
                  <div className="text-xs font-mono font-semibold text-neutral-500 uppercase">
                    CIELAB Scientific Coordinates
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
                    <div className="p-2 rounded-xl bg-white border border-neutral-200">
                      <div className="text-neutral-400 text-[10px]">L* (Light)</div>
                      <div className="font-bold text-neutral-900">{selectedProfile.cielab.L}</div>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-neutral-200">
                      <div className="text-neutral-400 text-[10px]">a* (Red/Grn)</div>
                      <div className="font-bold text-rose-600">+{selectedProfile.cielab.a}</div>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-neutral-200">
                      <div className="text-neutral-400 text-[10px]">b* (Yel/Blu)</div>
                      <div className="font-bold text-amber-600">+{selectedProfile.cielab.b}</div>
                    </div>
                  </div>
                </div>

                {/* Primary Concern Score */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-neutral-500 font-semibold">Primary Target Concern</span>
                    <span className="text-rose-600 font-bold">{selectedProfile.concernScore}/100</span>
                  </div>
                  <div className="text-sm font-bold text-neutral-900">
                    {selectedProfile.primaryConcern}
                  </div>
                  <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-rose-500 to-purple-600 rounded-full transition-all duration-700"
                      style={{ width: `${selectedProfile.concernScore}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
                <span>Undertone Class:</span>
                <span className="font-bold text-neutral-950 uppercase">{selectedProfile.undertone}</span>
              </div>
            </div>

            {/* Middle & Right: Palette and Beauty Matches (8 cols) */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              {/* Apparel Color Harmony Bento Card */}
              <div className="bg-white rounded-3xl p-7 border border-neutral-200/90 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">
                      Apparel Color Science
                    </div>
                    <h4 className="text-xl font-bold text-neutral-950">
                      Harmonized Apparel Pigment Swatches
                    </h4>
                  </div>
                  <span className="text-xs font-mono px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-semibold">
                    ΔE &lt; 2.0 (Flattering Match)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {selectedProfile.palette.map((swatch, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl p-3 border border-neutral-200 bg-neutral-50 hover:bg-white hover:shadow-md transition-all space-y-3"
                    >
                      <div
                        className="w-full aspect-video rounded-xl shadow-inner border border-black/10"
                        style={{ backgroundColor: swatch.hex }}
                      />
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-neutral-900 truncate">
                          {swatch.name}
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-mono">
                          <span className="text-neutral-500">{swatch.hex}</span>
                          <span className="font-bold text-emerald-600">
                            {swatch.harmonyScore}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Beauty Formulation Match Bento Card */}
              <div className="bg-white rounded-3xl p-7 border border-neutral-200/90 shadow-sm space-y-4">
                <div className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">
                  Beauty & Skincare Match
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-neutral-50 border border-neutral-200">
                  <div className="space-y-1 max-w-lg">
                    <div className="text-base font-bold text-neutral-950">
                      {selectedProfile.beautyMatch.title}
                    </div>
                    <div className="text-xs font-semibold text-rose-600">
                      Optimal Shade: {selectedProfile.beautyMatch.shade}
                    </div>
                    <p className="text-xs text-neutral-600 font-normal leading-relaxed">
                      {selectedProfile.beautyMatch.note}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-3xl font-black font-mono text-purple-600">
                      {selectedProfile.beautyMatch.matchScore}%
                    </div>
                    <div className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">
                      TARGET FORMULA
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
