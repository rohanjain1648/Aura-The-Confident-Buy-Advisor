"use client";

import { useState } from "react";
import { Eye, Sparkles, SlidersHorizontal, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import Magnetic from "./Magnetic";

export default function VtoShowcaseSection() {
  const [sliderPos, setSliderPos] = useState(50);
  const [activeGarment, setActiveGarment] = useState<"trench" | "blazer" | "dress">("trench");

  const garments = {
    trench: {
      name: "Emerald Silk Trench Coat",
      harmony: 98,
      fit: "Tailored Regular",
      drape: "Fluid Satin Weave",
      color: "from-emerald-600 to-teal-800",
    },
    blazer: {
      name: "Structured Mauve Velvet Blazer",
      harmony: 96,
      fit: "Structured Slim",
      drape: "Heavy Velvet Pile",
      color: "from-purple-600 to-rose-800",
    },
    dress: {
      name: "Midnight Sapphire Evening Gown",
      harmony: 99,
      fit: "Contoured Fit & Flare",
      drape: "Silk Chiffon",
      color: "from-blue-700 to-indigo-950",
    },
  };

  return (
    <section id="vto" className="py-24 px-4 sm:px-8 relative z-10">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Title */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-panel border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>YOUCAM S2S CLOTH TRY-ON TECH</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            See the Fit Before <br />
            <span className="text-gradient-cyan">You Touch the Checkout</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            Drag the slider to compare original user selfie input against YouCam’s photorealistic cloth drape and lighting adaptation engine.
          </p>
        </div>

        {/* Garment Selector Tabs */}
        <div className="flex flex-wrap justify-center gap-3">
          {(Object.keys(garments) as Array<keyof typeof garments>).map((key) => (
            <button
              key={key}
              onClick={() => setActiveGarment(key)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all ${
                activeGarment === key
                  ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20"
                  : "glass-panel text-slate-400 hover:text-white border-white/10"
              }`}
            >
              {garments[key].name}
            </button>
          ))}
        </div>

        {/* Interactive Before/After Split View */}
        <div className="max-w-4xl mx-auto glass-panel rounded-3xl p-6 border-cyan-500/30 relative overflow-hidden aura-glow-cyan">
          {/* Main Visual Box */}
          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-950 border border-white/10 select-none">
            {/* Original Input Layer (Before) */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-tr from-slate-950 via-slate-900 to-purple-950">
              <div className="text-center space-y-3 p-6">
                <div className="w-24 h-24 rounded-full border-2 border-slate-600 mx-auto flex items-center justify-center bg-slate-800/80">
                  <span className="text-xs font-mono text-slate-400">ORIGINAL SELFIE</span>
                </div>
                <div className="text-xs font-mono text-slate-400">
                  Base Image (Plain White Tee / Neutral Room Light)
                </div>
              </div>
            </div>

            {/* YouCam VTO Layer (After - Clipped by Slider Position) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
                {/* Simulated photorealistic garment fit background */}
                <div
                  className={`w-full h-full bg-gradient-to-br ${garments[activeGarment].color} opacity-30 absolute inset-0 mix-blend-overlay`}
                />
                <div className="relative text-center space-y-4 p-6">
                  <div className="w-28 h-36 rounded-2xl border-2 border-cyan-400/60 mx-auto flex items-center justify-center bg-slate-900/90 shadow-2xl">
                    <div className="space-y-1">
                      <Sparkles className="w-6 h-6 text-cyan-400 mx-auto animate-pulse" />
                      <div className="text-xs font-mono font-bold text-white">
                        YOUCAM CLOTH VTO
                      </div>
                      <div className="text-[10px] text-cyan-300 font-mono">
                        {garments[activeGarment].drape}
                      </div>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 bg-black/60 px-3 py-1 rounded-full border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{garments[activeGarment].harmony}% Confidence Harmony</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider Line & Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_15px_#06b6d4] cursor-ew-resize flex items-center justify-center z-20"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="w-8 h-8 rounded-full bg-cyan-500 border-2 border-white shadow-lg flex items-center justify-center text-slate-950 font-bold text-xs">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
            </div>

            {/* Invisible Range Input Overlay */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              className="absolute inset-0 opacity-0 cursor-ew-resize z-30"
            />

            {/* Labels overlay */}
            <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono text-cyan-300">
              YOUCAM VTO RENDER
            </div>
            <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono text-slate-400">
              ORIGINAL PHOTO
            </div>
          </div>

          {/* Garment Details Footer */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs">
            <div className="space-y-1">
              <span className="text-slate-400 font-mono">SELECTED ITEM</span>
              <div className="font-semibold text-white">{garments[activeGarment].name}</div>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 font-mono">FIT & DRAPE SIMULATION</span>
              <div className="font-semibold text-cyan-300">{garments[activeGarment].fit} • {garments[activeGarment].drape}</div>
            </div>
            <div className="space-y-1 sm:text-right">
              <span className="text-slate-400 font-mono">HARMONY SCORE</span>
              <div className="font-mono font-bold text-emerald-400 text-sm">
                {garments[activeGarment].harmony}% Match
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
