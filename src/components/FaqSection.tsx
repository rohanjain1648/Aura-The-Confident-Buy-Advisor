"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

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
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-xs font-mono font-semibold text-rose-700 shadow-xs">
            <HelpCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-neutral-950 tracking-tight">
            Everything You Need to Know
          </h2>
          <p className="text-neutral-600 text-base">
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
                className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-neutral-900 hover:text-purple-700 transition"
                >
                  <span className="text-base sm:text-lg">{faq.q}</span>
                  <div
                    className={`p-2 rounded-full bg-neutral-100 text-neutral-600 transition-transform duration-300 shrink-0 ${
                      isOpen ? "rotate-180 bg-purple-50 text-purple-700" : ""
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 text-neutral-600 text-sm leading-relaxed border-t border-neutral-100 pt-4">
                    {faq.a}
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
