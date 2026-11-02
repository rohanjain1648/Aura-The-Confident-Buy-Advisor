'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import AdvisorPanel from '@/components/AdvisorPanel';
import type { Verdict } from '@/domain/verdict/scorer';
import { ArrowLeft, Sparkles, ShoppingBag, SlidersHorizontal, RefreshCw } from 'lucide-react';

interface ProductWithVerdict {
  id: string;
  name: string;
  category: 'apparel' | 'beauty';
  imageUrl: string;
  verdict: Verdict;
}

export default function ShopPage() {
  const [products, setProducts] = useState<ProductWithVerdict[]>([]);
  const [filter, setFilter] = useState<'all' | 'apparel' | 'beauty'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/shop')
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(String(err));
        setLoading(false);
      });
  }, []);

  const filteredProducts =
    filter === 'all'
      ? products
      : products.filter((p) => p.category === filter);

  return (
    <div className="min-h-screen bg-[#fafafc] text-neutral-900 selection:bg-rose-500 selection:text-white flex flex-col">
      {/* Top Header */}
      <header className="p-5 sm:px-10 flex items-center justify-between border-b border-neutral-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-neutral-600 hover:text-neutral-950 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Home</span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-rose-500 to-purple-600 p-[1.5px] shadow-sm">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            </div>
          </div>
          <span className="font-extrabold text-base tracking-tight text-neutral-950">
            AURA STOREFRONT
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/onboarding"
            className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition"
          >
            Retake Selfie
          </Link>
          <Link
            href="/cart"
            className="p-2 rounded-full bg-neutral-950 text-white hover:bg-neutral-800 transition shadow-xs"
            title="Cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-10 space-y-10">
        {/* Page Hero Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-neutral-200/80">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-xs font-mono font-bold text-purple-700">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>CONFIDENCE DECISION ENGINE</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-neutral-950 tracking-tight">
              Personalized Storefront
            </h1>
            <p className="text-neutral-600 text-sm sm:text-base max-w-2xl font-normal">
              Every garment and cosmetic item is pre-evaluated against your active Skin Passport. Ranked by deterministic harmony score.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 p-1.5 rounded-full bg-neutral-100 border border-neutral-200">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                filter === 'all'
                  ? 'bg-white text-neutral-950 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-950'
              }`}
            >
              All Items ({products.length})
            </button>
            <button
              onClick={() => setFilter('apparel')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                filter === 'apparel'
                  ? 'bg-white text-neutral-950 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-950'
              }`}
            >
              Apparel
            </button>
            <button
              onClick={() => setFilter('beauty')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                filter === 'beauty'
                  ? 'bg-white text-neutral-950 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-950'
              }`}
            >
              Beauty
            </button>
          </div>
        </div>

        {/* AI Advisor Panel Section */}
        <div>
          <AdvisorPanel
            suggestions={[
              'What should I buy first?',
              'What suits my undertone?',
              'Which beauty product fits my top concern?',
            ]}
          />
        </div>

        {/* Loading / Error / Products Grid */}
        {loading && (
          <div className="py-20 text-center space-y-4">
            <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mx-auto" />
            <div className="text-neutral-600 font-mono text-sm">
              Loading catalog and evaluating verdicts...
            </div>
          </div>
        )}

        {error && (
          <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-center font-medium">
            Error loading shop: {error}
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                category={p.category}
                imageUrl={p.imageUrl}
                verdict={p.verdict}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
