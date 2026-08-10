"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Heart, ExternalLink } from "lucide-react";
import Magnetic from "./Magnetic";

export default function Footer() {
  return (
    <footer className="relative pt-20 pb-12 px-4 sm:px-8 border-t border-white/10 overflow-hidden z-10">
      {/* Background ambient lighting */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-t from-purple-950/40 via-rose-950/20 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Large Glass CTA Banner */}
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-rose-500/40 bg-gradient-to-r from-purple-950/60 via-slate-900/90 to-rose-950/60 text-center space-y-6 aura-glow-purple relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-xs font-mono text-rose-300">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              <span>THE CONFIDENT-BUY GUARANTEE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Ready to Eliminate <br />
              <span className="text-gradient-aura">E-Commerce Return Anxiety?</span>
            </h2>
            <p className="text-slate-300 text-base sm:text-lg">
              One selfie generates your unified Skin Passport — scoring apparel color harmony and beauty product fit in seconds.
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4 pt-2">
            <Magnetic strength={0.4}>
              <Link
                href="/onboarding"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 text-white font-semibold text-base shadow-xl shadow-purple-600/40 hover:shadow-purple-500/70 hover:scale-[1.03] transition-all group"
              >
                <span>Launch Skin Scanner</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Magnetic>

            <Magnetic strength={0.25}>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full glass-panel-interactive text-slate-200 font-medium text-base hover:text-white"
              >
                <span>Browse Storefront</span>
              </Link>
            </Magnetic>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-8">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-purple-600 p-[1px]">
                <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-rose-400" />
                </div>
              </div>
              <span className="text-xl font-bold text-white font-sans">AURA</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Personalized AI storefront decision engine built for Perfect Corp. YouCam API Hackathon (Skin AI + Apparel VTO combined track).
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>YouCam S2S Pipeline Online</span>
            </div>
          </div>

          {/* Quick Routes */}
          <div className="space-y-3">
            <div className="text-xs font-mono text-slate-300 uppercase tracking-wider font-bold">
              Storefront Routes
            </div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/" className="hover:text-white transition">Landing Overview</Link>
              </li>
              <li>
                <Link href="/onboarding" className="hover:text-white transition">/onboarding — Capture Selfie</Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-white transition">/shop — Passport Storefront</Link>
              </li>
              <li>
                <Link href="/me" className="hover:text-white transition">/me — Passport Dashboard</Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-white transition">/cart — Confident Checkout</Link>
              </li>
            </ul>
          </div>

          {/* YouCam Tech */}
          <div className="space-y-3">
            <div className="text-xs font-mono text-slate-300 uppercase tracking-wider font-bold">
              YouCam REST APIs
            </div>
            <ul className="space-y-2 text-xs text-slate-400 font-mono">
              <li className="text-amber-400">skin-tone-analysis</li>
              <li className="text-rose-400">skin-analysis (8 Concerns)</li>
              <li className="text-cyan-400">cloth (Apparel VTO)</li>
              <li className="text-purple-400">CIELAB ΔE Harmony Space</li>
            </ul>
          </div>

          {/* Hackathon Specs */}
          <div className="space-y-3">
            <div className="text-xs font-mono text-slate-300 uppercase tracking-wider font-bold">
              Hackathon Architecture
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Next.js App Router • TypeScript • Prisma ORM + SQLite • Tailwind CSS v4 • Lenis Smooth Scroll
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 Aura — The Confident-Buy Advisor. Built for Perfect Corp. YouCam API Hackathon.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-300 transition cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-300 transition cursor-pointer">S2S API Specs</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
