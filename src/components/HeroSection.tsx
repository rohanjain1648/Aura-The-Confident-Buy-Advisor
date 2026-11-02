"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, ShieldCheck, Zap, Layers, Sliders, RefreshCw, CheckCircle2 } from "lucide-react";
import Magnetic from "./Magnetic";

export default function HeroSection() {
  const [score, setScore] = useState(94);
  const [activeTab, setActiveTab] = useState<"apparel" | "beauty">("apparel");
  const [isScanning, setIsScanning] = useState(false);

  const handleRescan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setScore(Math.floor(Math.random() * 6) + 94);
      setIsScanning(false);
    }, 800);
  };

  return (
    <section className="relative min-h-[92vh] pt-32 pb-20 px-4 sm:px-8 flex flex-col justify-center overflow-hidden">
      {/* Subtle floating background ambient lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[550px] bg-gradient-to-tr from-rose-200/40 via-purple-200/35 to-sky-200/30 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left Column: Copy & CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 flex flex-col gap-6 text-left"
        >
          {/* Hackathon Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200/80 text-xs font-mono font-semibold text-rose-700 w-fit shadow-xs">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>PERFECT CORP. YOUCAM API HACKATHON 2026</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-neutral-950 leading-[1.08]">
            One Selfie. <br />
            <span className="text-gradient-aura">Two Verdicts.</span> <br />
            Zero Guesswork.
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl font-normal leading-relaxed">
            Stop buying clothes and beauty products on blind faith. Aura unifies YouCam’s{" "}
            <span className="text-rose-600 font-semibold">Skin Tone</span>,{" "}
            <span className="text-purple-600 font-semibold">Skin Concerns</span>, and{" "}
            <span className="text-sky-600 font-semibold">Virtual Apparel Fitting</span> into a single{" "}
            <strong className="text-neutral-950 font-bold">Skin Passport</strong> — computing deterministic confidence scores before you spend a dime.
          </p>

          {/* CTAs & Badges */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Magnetic strength={0.4}>
              <Link
                href="/onboarding"
                className="relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 text-white font-semibold text-base shadow-xl shadow-purple-600/25 hover:shadow-2xl hover:shadow-purple-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group"
              >
                <Sparkles className="w-5 h-5 text-rose-200 animate-pulse" />
                <span>Create Your Skin Passport</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Magnetic>

            <Magnetic strength={0.25}>
              <a
                href="#simulator"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-white border border-neutral-300 text-neutral-800 font-semibold text-base shadow-xs hover:bg-neutral-50 hover:border-neutral-400 hover:text-neutral-950 transition-all"
              >
                <Sliders className="w-5 h-5 text-purple-600" />
                <span>Try Live Simulator</span>
              </a>
            </Magnetic>
          </div>

          {/* Security & API badges */}
          <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-semibold text-neutral-600">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-neutral-200 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Server-Only YouCam Key Security</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-neutral-200 shadow-xs">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>CIELAB ΔE Color Harmony</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-neutral-200 shadow-xs">
              <Layers className="w-4 h-4 text-sky-600" />
              <span>Prisma / SQLite Session State</span>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Interactive Hero Bento Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 relative"
        >
          <div className="bg-white/95 rounded-3xl p-6 sm:p-7 border border-neutral-200/90 shadow-2xl shadow-purple-900/10 relative overflow-hidden group hover:border-purple-300 transition-all duration-500">
            {/* Ambient inner glow */}
            <div className="absolute -right-20 -top-20 w-60 h-60 bg-purple-100/60 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-rose-100/60 rounded-full blur-3xl pointer-events-none" />

            {/* Header of widget */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 relative z-10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-600 font-bold">
                  AURA DECISION ENGINE V1.0
                </span>
              </div>
              <button
                onClick={handleRescan}
                title="Refresh simulation"
                className="p-1.5 rounded-lg bg-neutral-100 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200 transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? "animate-spin text-purple-600" : ""}`} />
              </button>
            </div>

            {/* Simulated Live Viewport */}
            <div className="mt-5 relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 flex items-center justify-center select-none shadow-inner">
              {/* Biometric Face Mesh Simulation */}
              <div className="relative w-40 h-48 flex items-center justify-center">
                {/* Outer scanning radar ring */}
                <div className={`absolute inset-0 rounded-[50%] border border-rose-500/40 ${isScanning ? "animate-ping" : "animate-pulse"}`} />
                <div className="absolute inset-2 rounded-[50%] border-2 border-dashed border-purple-400/50" />

                {/* Minimalist face landmark indicators */}
                <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
                  <div className="flex gap-6">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
                  </div>
                  <div className="w-1.5 h-4 rounded-full bg-purple-400/80" />
                  <div className="w-8 h-1.5 rounded-full bg-rose-400/80" />
                </div>

                {/* Animated horizontal laser scanline */}
                <motion.div
                  animate={{ y: [-70, 70, -70] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#38bdf8]"
                />
              </div>

              {/* Live Passport Chip Overlay */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-purple-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                <span>PASSPORT ID #8F39-AURA</span>
              </div>

              {/* Bottom live stats inside viewport */}
              <div className="absolute bottom-3 inset-x-3 p-2.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-400 border border-white/30" />
                  <span className="text-white font-medium">Warm Golden (Warm 2)</span>
                </div>
                <span className="text-neutral-400 text-[11px]">ΔE = 1.42 (High)</span>
              </div>
            </div>

            {/* Verdict Switcher Tabs */}
            <div className="mt-4 grid grid-cols-2 gap-2 p-1 rounded-xl bg-neutral-100 border border-neutral-200">
              <button
                onClick={() => setActiveTab("apparel")}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === "apparel"
                    ? "bg-white text-purple-700 shadow-sm"
                    : "text-neutral-600 hover:text-neutral-950"
                }`}
              >
                Apparel Verdict
              </button>
              <button
                onClick={() => setActiveTab("beauty")}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === "beauty"
                    ? "bg-white text-rose-700 shadow-sm"
                    : "text-neutral-600 hover:text-neutral-950"
                }`}
              >
                Beauty Verdict
              </button>
            </div>

            {/* Output Verdict Card */}
            <div className="mt-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-between relative z-10">
              <div className="space-y-1">
                <div className="text-xs font-bold text-neutral-900">
                  {activeTab === "apparel" ? "Silk Emerald Trench Coat" : "Radiant Silk Hydrating Serum"}
                </div>
                <div className="text-[11px] text-neutral-500">
                  {activeTab === "apparel"
                    ? "YouCam Cloth VTO Rendered • Perfect Harmony"
                    : "Matches Tone Depth 3 • Calms Redness"}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black font-mono text-emerald-600 tracking-tight">
                  {score}%
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  CONFIDENT BUY
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
