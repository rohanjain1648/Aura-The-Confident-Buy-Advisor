"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Magnetic from "./Magnetic";
import { AuraEmblem } from "./AuraLogo";

export default function Footer() {
  return (
    <footer className="relative pt-20 pb-12 px-4 sm:px-8 border-t border-neutral-200/80 bg-white/60 overflow-hidden z-10">
      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Large Bento CTA Banner */}
        <div className="rounded-3xl p-8 sm:p-12 border border-rose-200 bg-gradient-to-r from-purple-50 via-rose-50 to-amber-50 text-center space-y-6 shadow-lg shadow-purple-900/5 relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-rose-200 text-xs font-mono font-semibold text-rose-700 shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-rose-500" />
              <span>THE CONFIDENT-BUY GUARANTEE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-neutral-950 tracking-tight">
              Ready to Eliminate <br />
              <span className="font-serif italic font-normal text-gradient-aura">E-Commerce Return Anxiety?</span>
            </h2>
            <p className="text-neutral-600 text-base sm:text-lg">
              One selfie generates your unified Skin Passport — scoring apparel color harmony and beauty product fit in seconds.
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4 pt-2">
            <Magnetic strength={0.4}>
              <Link
                href="/onboarding"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 text-white font-bold text-base shadow-lg shadow-purple-600/25 hover:shadow-xl hover:shadow-purple-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all group"
              >
                <span>Launch Skin Scanner</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Magnetic>

            <Magnetic strength={0.25}>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-white border border-neutral-300 text-neutral-800 font-bold text-base shadow-xs hover:bg-neutral-50 hover:border-neutral-400 hover:text-neutral-950 transition-all"
              >
                <span>Browse Storefront</span>
              </Link>
            </Magnetic>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-8 border-t border-neutral-100">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-neutral-950 flex items-center justify-center text-white shadow-sm">
                <AuraEmblem className="text-base text-white" />
              </div>
              <span className="text-lg font-black tracking-tight text-neutral-950 font-sans">
                AURA
              </span>
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Autonomous decision intelligence unifying YouCam skin diagnostics, undertone science, and photorealistic virtual try-on.
            </p>
          </div>

          {/* YouCam APIs */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
              YouCam S2S APIs
            </div>
            <ul className="space-y-2 text-xs font-semibold text-neutral-600">
              <li>Skin Tone Analysis (CIELAB)</li>
              <li>8-Concern Clinical Skin Scan</li>
              <li>Clothes Virtual Try-On v4</li>
            </ul>
          </div>

          {/* Architecture */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
              Tech Stack
            </div>
            <ul className="space-y-2 text-xs font-semibold text-neutral-600">
              <li>Next.js 16 (Turbopack)</li>
              <li>Prisma 7 + SQLite</li>
              <li>Tailwind CSS + Framer Motion</li>
              <li>Groq &amp; OpenAI LLM Advisor</li>
            </ul>
          </div>

          {/* Meta & Credits */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
              Hackathon Entry
            </div>
            <div className="text-xs text-neutral-500 space-y-1">
              <div>Perfect Corp. Hackathon 2026</div>
              <div>MIT Open Source Licence</div>
              <div className="text-purple-600 font-bold mt-2">Team Aura</div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-neutral-400">
          <div>&copy; 2026 Aura AI • All rights reserved.</div>
          <div className="flex items-center gap-6">
            <Link href="/onboarding" className="hover:text-neutral-900 transition-colors">
              Selfie Scanner
            </Link>
            <Link href="/shop" className="hover:text-neutral-900 transition-colors">
              Storefront
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
