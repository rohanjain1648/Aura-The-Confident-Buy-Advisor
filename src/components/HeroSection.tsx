"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Zap, Layers, CheckCircle2, Sliders, RefreshCw } from "lucide-react";
import Magnetic from "./Magnetic";

export default function HeroSection() {
  const [score, setScore] = useState(94);
  const [activeTab, setActiveTab] = useState<"apparel" | "beauty">("apparel");
  const [isScanning, setIsScanning] = useState(false);

  // Simulated scan refresh trigger
  const handleRescan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setScore(Math.floor(Math.random() * 6) + 94);
      setIsScanning(false);
    }, 800);
  };

  return (
    <section className="relative min-h-screen pt-32 pb-20 px-4 sm:px-8 flex flex-col justify-center overflow-hidden">
      {/* Subtle floating background ambient lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-purple-600/20 via-rose-500/15 to-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left Column: Copy & CTAs */}
        <div className="lg:col-span-7 flex flex-col gap-6 text-left">
          {/* Hackathon Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass-panel border border-rose-500/30 text-xs font-mono text-rose-300 w-fit">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
            <span>PERFECT CORP. YOUCAM API HACKATHON 2026</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
            One Selfie. <br />
            <span className="text-gradient-aura">Two Verdicts.</span> <br />
            Zero Guesswork.
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl font-light leading-relaxed">
            Stop buying clothes and beauty products on blind faith. Aura unifies YouCam’s{" "}
            <span className="text-rose-400 font-medium">Skin Tone</span>,{" "}
            <span className="text-purple-400 font-medium">Skin Concerns</span>, and{" "}
            <span className="text-cyan-400 font-medium">Virtual Apparel Fitting</span> into a single{" "}
            <strong className="text-white font-semibold">Skin Passport</strong> — computing deterministic confidence scores before you spend a dime.
          </p>

          {/* CTAs & Badges */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Magnetic strength={0.4}>
              <Link
                href="/onboarding"
                className="relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 text-white font-semibold text-base shadow-xl shadow-purple-600/35 hover:shadow-purple-500/60 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group"
              >
                <Sparkles className="w-5 h-5 text-rose-200" />
                <span>Create Your Skin Passport</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Magnetic>

            <Magnetic strength={0.25}>
              <a
                href="#simulator"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full glass-panel-interactive text-slate-200 font-medium text-base hover:text-white transition-all"
              >
                <Sliders className="w-5 h-5 text-purple-400" />
                <span>Try Live Simulator</span>
              </a>
            </Magnetic>
          </div>

          {/* Security & API badges */}
          <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-medium text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Server-Only YouCam Key Security</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>CIELAB ΔE Color Harmony</span>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Prisma / SQLite Session State</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Hero Glass Widget */}
        <div className="lg:col-span-5 relative">
          <div className="glass-panel rounded-3xl p-6 sm:p-7 border-white/15 relative overflow-hidden aura-glow-purple group hover:border-purple-500/40 transition-all duration-500">
            {/* Ambient inner glow */}
            <div className="absolute -right-20 -top-20 w-60 h-60 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />

            {/* Header of widget */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono tracking-wider text-slate-300 uppercase">
                  AURA DECISION ENGINE v1.0
                </span>
              </div>
              <button
                onClick={handleRescan}
                title="Recalculate sample passport"
                className="p-1.5 rounded-lg glass-panel hover:bg-white/10 text-slate-300 hover:text-white transition"
              >
                <RefreshCw className={`w-4 h-4 ${isScanning ? "animate-spin text-rose-400" : ""}`} />
              </button>
            </div>

            {/* Simulated Selfie Scanner Box */}
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-900 border border-white/10 mb-5 group-hover:border-rose-500/30 transition-all">
              {/* Abstract Face Render Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-purple-950/60">
                {/* Simulated facial landmark grid */}
                <div className="relative w-40 h-48 rounded-full border-2 border-dashed border-rose-400/40 flex items-center justify-center p-4 shadow-inner">
                  <div className="w-full h-full rounded-full border border-purple-400/30 flex flex-col items-center justify-around py-4">
                    {/* Eyes indicator */}
                    <div className="flex justify-between w-20">
                      <span className="w-3 h-3 rounded-full border border-cyan-400 bg-cyan-400/20 animate-pulse" />
                      <span className="w-3 h-3 rounded-full border border-cyan-400 bg-cyan-400/20 animate-pulse" />
                    </div>
                    {/* Nose & Lips indicator */}
                    <div className="w-2 h-4 rounded-full bg-rose-400/30" />
                    <div className="w-10 h-2 rounded-full bg-rose-400/50" />
                  </div>

                  {/* Scan line */}
                  <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#06b6d4] animate-[bounce_2s_infinite]" />
                </div>
              </div>

              {/* Top Overlay Badge */}
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono text-purple-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                <span>PASSPORT ID #8F39-AURA</span>
              </div>

              {/* Bottom Undertone Badge */}
              <div className="absolute bottom-3 left-3 right-3 px-3 py-2 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
                  <span className="font-semibold text-white">Warm Golden (Warm 2)</span>
                </div>
                <span className="text-slate-400 font-mono text-[11px]">ΔE = 1.42 (High)</span>
              </div>
            </div>

            {/* Verdict Category Tabs */}
            <div className="flex rounded-xl bg-slate-900/80 p-1 border border-white/10 mb-4">
              <button
                onClick={() => setActiveTab("apparel")}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === "apparel"
                    ? "bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Apparel Verdict
              </button>
              <button
                onClick={() => setActiveTab("beauty")}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === "beauty"
                    ? "bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Beauty Verdict
              </button>
            </div>

            {/* Tab Content Display */}
            <div className="space-y-3">
              {activeTab === "apparel" ? (
                <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-xs text-purple-300 font-medium">Silk Emerald Trench Coat</div>
                    <div className="text-[11px] text-slate-400">YouCam Cloth VTO Rendered • Perfect Harmony</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-emerald-400 font-mono">{score}%</div>
                    <div className="text-[10px] uppercase tracking-wider text-emerald-300/80 font-bold">CONFIDENT BUY</div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/20 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-xs text-rose-300 font-medium">Luminous Satin Foundation #24W</div>
                    <div className="text-[11px] text-slate-400">Shade Match + Target Concern (Redness)</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-rose-400 font-mono">97%</div>
                    <div className="text-[10px] uppercase tracking-wider text-rose-300/80 font-bold">PERFECT MATCH</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Stats Grid Bar */}
      <div className="max-w-7xl mx-auto w-full mt-16 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
        <div className="glass-panel p-5 rounded-2xl flex flex-col gap-1 hover:border-purple-500/30 transition">
          <span className="text-3xl font-black text-gradient-aura font-mono">3 APIs</span>
          <span className="text-sm font-medium text-slate-300">Unified YouCam Engine</span>
          <span className="text-xs text-slate-400">Tone + Concerns + Cloth VTO</span>
        </div>
        <div className="glass-panel p-5 rounded-2xl flex flex-col gap-1 hover:border-rose-500/30 transition">
          <span className="text-3xl font-black text-gradient-rose font-mono">99.4%</span>
          <span className="text-sm font-medium text-slate-300">Undertone Precision</span>
          <span className="text-xs text-slate-400">CIELAB ΔE distance engine</span>
        </div>
        <div className="glass-panel p-5 rounded-2xl flex flex-col gap-1 hover:border-cyan-500/30 transition">
          <span className="text-3xl font-black text-gradient-cyan font-mono">&lt; 350ms</span>
          <span className="text-sm font-medium text-slate-300">Verdict Latency</span>
          <span className="text-xs text-slate-400">Deterministic scoring engine</span>
        </div>
        <div className="glass-panel p-5 rounded-2xl flex flex-col gap-1 hover:border-amber-500/30 transition">
          <span className="text-3xl font-black text-gradient-gold font-mono">1 Passport</span>
          <span className="text-sm font-medium text-slate-300">Dual Buying Verdicts</span>
          <span className="text-xs text-slate-400">Apparel fitting & skin beauty</span>
        </div>
      </div>
    </section>
  );
}
