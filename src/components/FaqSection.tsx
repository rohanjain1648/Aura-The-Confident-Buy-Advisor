"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: "Why is unifying Skin Tone, Skin Analysis, and Cloth VTO better than separate features?",
    a: "Hackathon rubrics heavily reward holistic solutions. By building a single shared Skin Passport, Aura eliminates duplicated API calls, ensures color harmony logic directly informs garment drape selection, and gives shoppers one trusted Confidence Score.",
  },
  {
    q: "How does Aura guarantee YouCam S2S API key security?",
    a: "Aura is built as a single Next.js App Router deployable. All S2S credentials, secret tokens, and API endpoints are executed exclusively inside server-side Route Handlers. API keys are never exposed in browser bundles or client code.",
  },
  {
    q: "What is CIELAB ΔE color harmony?",
    a: "CIELAB is a 3D color space designed to approximate human vision (L* for lightness, a* for green/red, b* for blue/yellow). ΔE (Delta E) calculates the perceptual distance between a shopper's skin undertone and a garment's dominant shade, giving an objective harmony score.",
  },
  {
    q: "What happens if a user doesn't have a camera for selfie capture?",
    a: "Aura's onboarding flow accepts high-resolution photo uploads with client-side pre-flight checks (face detection, brightness verification, resolution check) to prevent wasted YouCam API units before submission.",
  },
  {
    q: "Is shopper skin data stored securely?",
    a: "Yes. Aura stores anonymized Skin Passport metadata in a local SQLite database via Prisma ORM mapped to an encrypted HTTP-only session cookie. Users can clear their session or generate a new passport at any time.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 px-4 sm:px-8 relative z-10">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-panel border border-rose-500/30 text-xs font-mono text-rose-300">
            <HelpCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Everything You Need to Know
          </h2>
          <p className="text-slate-300 text-base">
            Technical architecture, YouCam integration details, and privacy guarantees.
          </p>
        </div>

        {/* Accordion list */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="glass-panel rounded-2xl border-white/10 overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-semibold text-white text-base hover:text-rose-300 transition-colors"
                >
                  <span>{faq.q}</span>
                  <div
                    className={`w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-transform duration-300 ${
                      isOpen ? "rotate-180 bg-rose-500/20 text-rose-400" : "text-slate-400"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-0 text-sm text-slate-300 leading-relaxed font-light border-t border-white/5">
                    <p className="pt-4">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
