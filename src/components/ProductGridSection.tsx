"use client";

import { useState } from "react";
import { ShoppingBag, Sparkles, Check, Heart, ArrowUpRight, Filter } from "lucide-react";
import Magnetic from "./Magnetic";

interface Product {
  id: string;
  category: "apparel" | "beauty";
  title: string;
  price: string;
  matchScore: number;
  matchType: string;
  undertoneHarmony: string;
  concernTarget?: string;
  badgeColor: string;
  imageBg: string;
}

const PRODUCTS: Product[] = [
  {
    id: "p1",
    category: "apparel",
    title: "Terracotta Italian Wool Coat",
    price: "$289.00",
    matchScore: 98,
    matchType: "Color Harmony + VTO Fit",
    undertoneHarmony: "Warm Autumn Gold (ΔE 1.12)",
    badgeColor: "text-emerald-400 bg-emerald-950/70 border-emerald-500/40",
    imageBg: "from-amber-950/60 to-rose-950/40",
  },
  {
    id: "p2",
    category: "beauty",
    title: "Luminous Velvet Silk Serum Foundation",
    price: "$54.00",
    matchScore: 97,
    matchType: "Shade Match + Concern Target",
    undertoneHarmony: "Warm Oat #24W",
    concernTarget: "Redness & Hydration",
    badgeColor: "text-rose-400 bg-rose-950/70 border-rose-500/40",
    imageBg: "from-rose-950/60 to-purple-950/40",
  },
  {
    id: "p3",
    category: "apparel",
    title: "Cobalt Tailored Double-Breasted Blazer",
    price: "$210.00",
    matchScore: 95,
    matchType: "Color Harmony + VTO Fit",
    undertoneHarmony: "High Visual Contrast (ΔE 1.40)",
    badgeColor: "text-cyan-400 bg-cyan-950/70 border-cyan-500/40",
    imageBg: "from-blue-950/60 to-indigo-950/40",
  },
  {
    id: "p4",
    category: "beauty",
    title: "Pore-Refining Niacinamide Matte Primer",
    price: "$42.00",
    matchScore: 96,
    matchType: "Primary Concern Solution",
    undertoneHarmony: "Universal Neutral",
    concernTarget: "Oiliness & Pores (#1 Score)",
    badgeColor: "text-purple-400 bg-purple-950/70 border-purple-500/40",
    imageBg: "from-purple-950/60 to-slate-900",
  },
];

export default function ProductGridSection() {
  const [filter, setFilter] = useState<"all" | "apparel" | "beauty">("all");
  const [addedIds, setAddedIds] = useState<string[]>([]);

  const filteredProducts =
    filter === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter);

  const toggleAddToCart = (id: string) => {
    setAddedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <section id="pdp" className="py-24 px-4 sm:px-8 relative z-10">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-panel border border-amber-500/30 text-xs font-mono text-amber-300">
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
              <span>PASSPORT-AWARE STOREFRONT</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Personalized Badges on <br />
              <span className="text-gradient-gold">Every Product Card</span>
            </h2>
            <p className="text-slate-300 text-base">
              Once a Skin Passport exists, every product card computes an instant match badge without making repeated external API calls.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 rounded-2xl glass-panel p-1 border-white/10">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                filter === "all"
                  ? "bg-purple-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setFilter("apparel")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                filter === "apparel"
                  ? "bg-purple-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Apparel
            </button>
            <button
              onClick={() => setFilter("beauty")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                filter === "beauty"
                  ? "bg-purple-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Beauty
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => {
            const isAdded = addedIds.includes(prod.id);
            return (
              <div
                key={prod.id}
                className="glass-panel-interactive rounded-3xl p-5 border-white/10 flex flex-col justify-between group space-y-4"
              >
                {/* Visual Banner */}
                <div
                  className={`relative aspect-[4/3] rounded-2xl bg-gradient-to-br ${prod.imageBg} border border-white/10 p-4 flex flex-col justify-between overflow-hidden`}
                >
                  {/* Aura Score Badge Header */}
                  <div className="flex items-center justify-between z-10">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-mono font-bold border backdrop-blur-md ${prod.badgeColor}`}
                    >
                      {prod.matchScore}% Match
                    </span>
                    <button className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-slate-400 hover:text-rose-400 transition">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Category Pill Footer */}
                  <div className="z-10 flex justify-between items-center text-[10px] font-mono text-slate-300">
                    <span className="uppercase tracking-wider px-2 py-0.5 rounded bg-black/60 border border-white/10">
                      {prod.category}
                    </span>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-base font-bold text-white leading-snug group-hover:text-rose-300 transition-colors">
                      {prod.title}
                    </h3>
                    <span className="text-sm font-mono font-bold text-slate-200">
                      {prod.price}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 space-y-1">
                    <div className="flex items-center gap-1 text-slate-300 font-medium">
                      <span>Verdict:</span>
                      <span className="text-emerald-400">{prod.undertoneHarmony}</span>
                    </div>
                    {prod.concernTarget && (
                      <div className="text-[11px] text-purple-300">
                        Targets: {prod.concernTarget}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action CTA */}
                <button
                  onClick={() => toggleAddToCart(prod.id)}
                  className={`w-full py-2.5 rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition-all ${
                    isAdded
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                      : "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added with Confidence</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-rose-400" />
                      <span>Confident Add To Cart</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
