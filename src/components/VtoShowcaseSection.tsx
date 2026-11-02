"use client";

import { useState } from "react";
import { Eye, Sparkles, SlidersHorizontal, CheckCircle2 } from "lucide-react";

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
      accent: "text-emerald-700",
    },
    blazer: {
      name: "Structured Mauve Velvet Blazer",
      harmony: 96,
      fit: "Structured Slim",
      drape: "Heavy Velvet Pile",
      color: "from-purple-600 to-rose-700",
      accent: "text-purple-700",
    },
    dress: {
      name: "Midnight Sapphire Evening Gown",
      harmony: 99,
      fit: "Contoured Fit & Flare",
      drape: "Silk Chiffon",
      color: "from-blue-700 to-indigo-900",
      accent: "text-blue-700",
    },
  };

  return (
    <section id="vto" className="py-24 px-4 sm:px-8 relative z-10">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Title */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs font-mono font-semibold text-sky-700 shadow-xs">
            <Eye className="w-3.5 h-3.5 text-sky-600" />
            <span>YOUCAM S2S CLOTH TRY-ON TECH</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-neutral-950 tracking-tight">
            See the Fit Before <br />
            <span className="text-gradient-cyan">You Touch the Checkout</span>
          </h2>
          <p className="text-neutral-600 text-base sm:text-lg">
            Drag the slider to compare original user selfie input against YouCam’s photorealistic cloth drape and lighting adaptation engine.
          </p>
        </div>

        {/* Garment Selector Tabs */}
        <div className="flex flex-wrap justify-center gap-3">
          {(Object.keys(garments) as Array<keyof typeof garments>).map((key) => (
            <button
              key={key}
              onClick={() => setActiveGarment(key)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                activeGarment === key
                  ? "bg-neutral-950 text-white shadow-md shadow-neutral-900/20"
                  : "bg-white text-neutral-700 border border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50"
              }`}
            >
              {garments[key].name}
            </button>
          ))}
        </div>

        {/* Interactive Before/After Split View */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/90 shadow-xl relative overflow-hidden">
          {/* Main Visual Box */}
          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 select-none shadow-inner">
            {/* Original Input Layer (Before) */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-tr from-neutral-900 via-neutral-800 to-slate-900">
              <div className="text-center space-y-3 p-6">
                <div className="w-24 h-24 rounded-full border-2 border-neutral-600 mx-auto flex items-center justify-center bg-neutral-800">
                  <span className="text-xs font-mono font-bold text-neutral-400">ORIGINAL SELFIE</span>
                </div>
                <div className="text-xs font-mono text-neutral-400">
                  Base Image (Plain White Tee / Neutral Light)
                </div>
              </div>
            </div>

            {/* YouCam VTO Layer (After - Clipped by Slider Position) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-950 via-slate-900 to-indigo-950">
                <div
                  className={`w-full h-full bg-gradient-to-br ${garments[activeGarment].color} opacity-40 absolute inset-0 mix-blend-overlay`}
                />
                <div className="relative text-center space-y-4 p-6">
                  <div className="w-28 h-36 rounded-2xl border-2 border-cyan-400/60 mx-auto flex items-center justify-center bg-neutral-900/90 shadow-2xl">
                    <div className="space-y-1">
                      <Sparkles className="w-6 h-6 text-cyan-400 mx-auto animate-pulse" />
                      <div className="text-xs font-mono font-bold text-white">
                        YOUCAM VTO
                      </div>
                      <div className="text-[10px] font-mono text-cyan-300">
                        {garments[activeGarment].harmony}% MATCH
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-mono text-cyan-200 font-semibold">
                    {garments[activeGarment].name} • {garments[activeGarment].fit}
                  </div>
                </div>
              </div>
            </div>

            {/* Divider Line & Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(255,255,255,0.9)] cursor-ew-resize flex items-center justify-center"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="w-8 h-8 rounded-full bg-white shadow-xl flex items-center justify-center text-neutral-900 -translate-x-1/2">
                <SlidersHorizontal className="w-4 h-4 text-neutral-900" />
              </div>
            </div>

            {/* Range Input Tracker */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-20"
              aria-label="Comparison slider"
            />
          </div>

          {/* Bottom Spec Details Bar */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-neutral-100">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <div className="text-xs font-mono font-bold text-neutral-400 uppercase">Fit Geometry</div>
                <div className="text-sm font-bold text-neutral-900">{garments[activeGarment].fit}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0" />
              <div>
                <div className="text-xs font-mono font-bold text-neutral-400 uppercase">Fabric Drape</div>
                <div className="text-sm font-bold text-neutral-900">{garments[activeGarment].drape}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-cyan-600 shrink-0" />
              <div>
                <div className="text-xs font-mono font-bold text-neutral-400 uppercase">Score</div>
                <div className="text-sm font-bold text-neutral-900">{garments[activeGarment].harmony}% Flawless</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
