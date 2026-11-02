"use client";

import { motion } from "framer-motion";
import { Cpu, CheckCircle } from "lucide-react";

export default function PipelineSection() {
  const steps = [
    {
      id: "01",
      api: "skin-tone-analysis",
      title: "Undertone & Melanin Extraction",
      color: "from-amber-500 to-rose-500",
      accent: "text-amber-600",
      pill: "bg-amber-50 text-amber-700 border-amber-200",
      desc: "Extracts precise skin undertone (warm, cool, neutral) and tone depth using CIELAB color space coordinates. Eliminates harsh lighting distortion.",
      outputs: ["L*a*b* Coordinates", "Seasonal Palette", "Melanin Index"],
    },
    {
      id: "02",
      api: "skin-analysis",
      title: "8-Concern Bio Scan",
      color: "from-rose-500 to-purple-600",
      accent: "text-rose-600",
      pill: "bg-rose-50 text-rose-700 border-rose-200",
      desc: "Scans for 8 clinical concerns: redness, oiliness, texture, spots, pores, wrinkles, dark circles, and acne — ranking primary targeting priorities.",
      outputs: ["Concern Priority #1", "Texture Severity Score", "Hydration Profile"],
    },
    {
      id: "03",
      api: "cloth",
      title: "Photorealistic Apparel VTO",
      color: "from-sky-500 to-indigo-600",
      accent: "text-sky-600",
      pill: "bg-sky-50 text-sky-700 border-sky-200",
      desc: "Renders Virtual Try-On directly onto the user's uploaded selfie using YouCam S2S cloth texture-warping and drape mechanics.",
      outputs: ["Drape Fit Simulation", "Texture Mapping", "Lighting Realism"],
    },
  ];

  return (
    <section id="pipeline" className="py-24 px-4 sm:px-8 relative z-10">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-50 border border-purple-200 text-xs font-mono font-semibold text-purple-700 shadow-xs">
            <Cpu className="w-3.5 h-3.5 text-purple-600" />
            <span>UNIFIED DECISION ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-neutral-950 tracking-tight">
            Three YouCam APIs. <br />
            <span className="font-serif italic font-normal text-gradient-aura">One Shared Context. Zero Silos.</span>
          </h2>
          <p className="text-neutral-600 text-base sm:text-lg leading-relaxed">
            Hackathons penalize submissions that bolt features side-by-side. Aura unifies skin tone, concern metrics, and apparel try-on behind a single deterministic decision engine.
          </p>
        </motion.div>

        {/* 3 Steps Pipeline Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="bg-white rounded-3xl p-7 border border-neutral-200/90 shadow-sm hover:shadow-xl hover:border-purple-200 relative flex flex-col justify-between group transition-all"
            >
              <div>
                {/* Step number badge */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-4xl font-black font-mono text-neutral-200 group-hover:text-purple-300 transition-colors">
                    {step.id}
                  </span>
                  <span className={`px-3 py-1 rounded-full border text-xs font-mono font-semibold ${step.pill}`}>
                    {step.api}
                  </span>
                </div>

                {/* Title & Desc */}
                <div className="space-y-3 mb-6">
                  <h3 className="text-xl font-bold text-neutral-950 group-hover:text-purple-700 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed font-normal">
                    {step.desc}
                  </p>
                </div>
              </div>

              {/* Output Tags */}
              <div className="pt-5 border-t border-neutral-100 space-y-2.5">
                <div className="text-[11px] font-mono font-semibold text-neutral-400 uppercase tracking-wider">
                  Extracted Signals:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {step.outputs.map((out, oIdx) => (
                    <span
                      key={oIdx}
                      className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-700 border border-neutral-200 font-medium"
                    >
                      <CheckCircle className={`w-3.5 h-3.5 ${step.accent}`} />
                      <span>{out}</span>
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
