'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShoppingBag, ArrowRight } from 'lucide-react';
import { AuraEmblem } from '@/components/AuraLogo';

export default function CartPage() {
  const [items, setItems] = useState<{ id: string; productId: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/cart')
      .then((r) => r.json())
      .then((data) => {
        setItems(data.cartItems || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafc] text-neutral-900 selection:bg-rose-500 selection:text-white flex flex-col">
      {/* Header */}
      <header className="p-5 sm:px-10 flex items-center justify-between border-b border-neutral-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm font-bold text-neutral-600 hover:text-neutral-950 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Shop</span>
        </Link>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-neutral-950 flex items-center justify-center text-white shadow-sm">
            <AuraEmblem className="text-sm text-white" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-neutral-950 font-sans">
            AURA BAG
          </span>
        </div>

        <Link
          href="/dashboard"
          className="text-xs font-bold text-neutral-500 hover:text-neutral-950 transition"
        >
          Dashboard &rarr;
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-8 py-12 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight">
            Shopping <span className="font-serif italic font-normal text-purple-800">Bag</span>
          </h1>
          <p className="text-sm text-neutral-600">
            Items pre-validated with your Skin Passport confidence score.
          </p>
        </div>

        {loading ? (
          <div className="py-16 text-center text-neutral-500 font-mono text-sm">
            Loading your cart...
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 border border-neutral-200/90 shadow-sm text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400 mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-neutral-950">Your Bag is Empty</h2>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Explore the personalized storefront to find clothing and cosmetics harmonized with your undertone.
              </p>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-950 text-white font-bold text-xs hover:bg-neutral-800 transition shadow-xs"
            >
              <span>Browse Recommended Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 border border-neutral-200/90 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 text-xs font-mono font-bold text-neutral-500 uppercase">
              <span>{items.length} Pre-Screened Items</span>
              <span className="text-emerald-600">Passport Matched</span>
            </div>

            <div className="space-y-3">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 font-mono font-bold text-xs flex items-center justify-center border border-purple-200">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-neutral-950">
                        Product Item #{item.productId.slice(0, 8)}
                      </div>
                      <div className="text-xs text-neutral-500 font-mono">
                        Session Verified
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-600 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                    High Confidence
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-neutral-500">
                All items eligible for YouCam Try-On reassurance before purchase.
              </div>
              <button
                onClick={() => alert('Demo checkout simulated successfully!')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-neutral-950 text-white font-extrabold text-sm hover:bg-neutral-800 transition shadow-xs"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
