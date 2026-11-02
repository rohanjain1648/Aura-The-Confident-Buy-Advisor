'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, ShoppingBag, User, Bookmark, History, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    fetch('/api/cart')
      .then((r) => r.json())
      .then((data) => {
        setCartCount(data.cartItems?.length || 0);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafc] text-neutral-900 selection:bg-rose-500 selection:text-white flex flex-col">
      {/* Header */}
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
            AURA DASHBOARD
          </span>
        </div>

        <Link
          href="/shop"
          className="text-xs font-bold text-neutral-500 hover:text-neutral-950 transition"
        >
          Shop &rarr;
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-8 py-12 space-y-10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-xs font-mono font-bold text-purple-700">
            <User className="w-3.5 h-3.5 text-purple-600" />
            <span>SESSION OVERVIEW</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-neutral-950 tracking-tight">
            Your Decision Hub
          </h1>
          <p className="text-sm text-neutral-600 font-normal">
            Track your pre-screened items, try-on history, and active biometric parameters.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Cart */}
          <div className="bg-white rounded-3xl p-7 border border-neutral-200/90 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-950">Active Bag</h3>
                <p className="text-xs text-neutral-500 mt-1">Pre-validated products</p>
              </div>
              <div className="text-4xl font-black font-mono text-neutral-950">
                {cartCount} <span className="text-base text-neutral-400 font-sans">items</span>
              </div>
            </div>
            <Link
              href="/cart"
              className="w-full py-3 rounded-xl bg-neutral-950 text-white font-bold text-xs hover:bg-neutral-800 transition flex items-center justify-center gap-2"
            >
              <span>View Shopping Bag</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2: Saved Looks */}
          <div className="bg-white rounded-3xl p-7 border border-neutral-200/90 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
                <Bookmark className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-950">Virtual Try-On Renders</h3>
                <p className="text-xs text-neutral-500 mt-1">Cloth v4 generation gallery</p>
              </div>
              <div className="text-4xl font-black font-mono text-neutral-400">
                —
              </div>
            </div>
            <Link
              href="/shop"
              className="w-full py-3 rounded-xl bg-neutral-100 text-neutral-700 font-bold text-xs hover:bg-neutral-200 transition flex items-center justify-center gap-2"
            >
              <span>Try On Clothes in Shop</span>
            </Link>
          </div>

          {/* Card 3: Session State */}
          <div className="bg-white rounded-3xl p-7 border border-neutral-200/90 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
                <History className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-950">Skin Passport</h3>
                <p className="text-xs text-neutral-500 mt-1">Biometric undertone state</p>
              </div>
              <div className="text-xs font-mono font-bold text-emerald-600 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 w-fit">
                ACTIVE IN SESSION
              </div>
            </div>
            <Link
              href="/onboarding"
              className="w-full py-3 rounded-xl bg-neutral-100 text-neutral-700 font-bold text-xs hover:bg-neutral-200 transition flex items-center justify-center gap-2"
            >
              <span>Retake Skin Scan</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
