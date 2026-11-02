"use client";

import { useState } from "react";
import { ShoppingBag, Sparkles, Check, ArrowUpRight } from "lucide-react";
import Magnetic from "./Magnetic";
import Link from "next/link";

interface Product {
  id: string;
  category: "apparel" | "beauty";
  title: string;
  price: string;
  matchScore: number;
  matchType: string;
  undertoneHarmony: string;
  concernTarget?: string;
  badgePill: string;
  gradientBg: string;
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
    badgePill: "bg-emerald-50 text-emerald-700 border-emerald-200",
    gradientBg: "from-amber-100/70 via-rose-50 to-orange-100/60",
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
    badgePill: "bg-rose-50 text-rose-700 border-rose-200",
    gradientBg: "from-rose-100/70 via-pink-50 to-purple-100/60",
  },
  {
    id: "p3",
    category: "apparel",
    title: "Cobalt Tailored Double-Breasted Blazer",
    price: "$210.00",
    matchScore: 95,
    matchType: "Color Harmony + VTO Fit",
    undertoneHarmony: "High Visual Contrast (ΔE 1.40)",
    badgePill: "bg-sky-50 text-sky-700 border-sky-200",
    gradientBg: "from-sky-100/70 via-blue-50 to-indigo-100/60",
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
    badgePill: "bg-purple-50 text-purple-700 border-purple-200",
    gradientBg: "from-purple-100/70 via-violet-50 to-slate-100/60",
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
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-mono font-semibold text-amber-700 shadow-xs">
              <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
              <span>PASSPORT-AWARE STOREFRONT</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-neutral-950 tracking-tight">
              Personalized Badges on <br />
              <span className="text-gradient-gold">Every Product Card</span>
            </h2>
            <p className="text-neutral-600 text-base">
              Once a Skin Passport exists, every product card computes an instant match badge without making repeated external API calls.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 p-1.5 rounded-full bg-neutral-100 border border-neutral-200 self-start md:self-auto">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                filter === "all"
                  ? "bg-white text-neutral-950 shadow-xs"
                  : "text-neutral-600 hover:text-neutral-950"
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setFilter("apparel")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                filter === "apparel"
                  ? "bg-white text-neutral-950 shadow-xs"
                  : "text-neutral-600 hover:text-neutral-950"
              }`}
            >
              Apparel
            </button>
            <button
              onClick={() => setFilter("beauty")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                filter === "beauty"
                  ? "bg-white text-neutral-950 shadow-xs"
                  : "text-neutral-600 hover:text-neutral-950"
              }`}
            >
              Beauty
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((p) => {
            const isAdded = addedIds.includes(p.id);
            return (
              <div
                key={p.id}
                className="bg-white rounded-3xl p-5 border border-neutral-200/90 shadow-sm hover:shadow-xl hover:border-purple-200 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Visual Preview Box */}
                  <div
                    className={`relative aspect-square rounded-2xl bg-gradient-to-br ${p.gradientBg} border border-neutral-200/70 p-4 flex flex-col justify-between overflow-hidden shadow-inner`}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${p.badgePill}`}>
                        {p.matchScore}% Match
                      </span>
                      <span className="text-xs font-mono font-bold uppercase text-neutral-500">
                        {p.category}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="w-12 h-12 rounded-xl bg-white/80 backdrop-blur-md border border-white flex items-center justify-center shadow-xs">
                        <Sparkles className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="mt-5 space-y-2">
                    <div className="flex justify-between items-baseline gap-2">
                      <h4 className="text-base font-bold text-neutral-950 group-hover:text-purple-600 transition-colors">
                        {p.title}
                      </h4>
                    </div>
                    <div className="text-sm font-extrabold text-neutral-900">{p.price}</div>

                    <div className="pt-3 border-t border-neutral-100 space-y-1.5 text-xs">
                      <div className="text-neutral-500 font-medium">
                        Harmony: <span className="font-semibold text-neutral-800">{p.undertoneHarmony}</span>
                      </div>
                      {p.concernTarget && (
                        <div className="text-neutral-500 font-medium">
                          Target: <span className="font-semibold text-rose-600">{p.concernTarget}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center gap-2">
                  <button
                    onClick={() => toggleAddToCart(p.id)}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      isAdded
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-neutral-950 text-white hover:bg-neutral-800 shadow-xs"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Saved</span>
                      </>
                    ) : (
                      <>
                        <span>Add to Bag</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA to shop page */}
        <div className="text-center pt-4">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white border border-neutral-300 text-neutral-900 font-bold text-sm shadow-xs hover:bg-neutral-50 hover:border-neutral-400 transition"
          >
            <span>Explore Full Storefront Catalog</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
