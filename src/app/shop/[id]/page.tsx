'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Sparkles, ShoppingBag, Eye, RefreshCw, Check, AlertCircle } from 'lucide-react';
import VerdictBadge from '@/components/VerdictBadge';
import AdvisorPanel from '@/components/AdvisorPanel';
import type { Verdict } from '@/domain/verdict/scorer';

interface ProductDetail {
  id: string;
  name: string;
  category: 'apparel' | 'beauty';
  description?: string;
  imageUrl: string;
  verdict?: Verdict;
  vtoImageUrl?: string;
}

interface ShopProduct {
  id: string;
  name: string;
  category: 'apparel' | 'beauty';
  description?: string;
  imageUrl: string;
  verdict?: Verdict;
}

export default function ProductDetailPage() {
  const params = useParams();
  const productId = String(params.id);

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [vtoLoading, setVtoLoading] = useState(false);
  const [vtoError, setVtoError] = useState<string | null>(null);
  const [cartSuccess, setCartSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/shop')
      .then((r) => r.json())
      .then((data: { products?: ShopProduct[] }) => {
        const found = (data.products || []).find((p) => p.id === productId);
        setProduct(found ?? null);
        setLoading(false);
      })
      .catch(() => {
        setProduct(null);
        setLoading(false);
      });
  }, [productId]);

  const generateVto = async () => {
    setVtoLoading(true);
    setVtoError(null);
    try {
      const res = await fetch('/api/verdict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (data.vtoImageUrl) {
        setProduct((p) => (p ? { ...p, vtoImageUrl: data.vtoImageUrl } : p));
      } else {
        setVtoError(data.error ?? 'Take your selfie first, then try this on.');
      }
    } catch (err) {
      setVtoError(`Try-on failed: ${String(err)}`);
    } finally {
      setVtoLoading(false);
    }
  };

  const addToCart = async () => {
    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      setCartSuccess(true);
      setTimeout(() => setCartSuccess(false), 3000);
    } catch (err) {
      alert(`Error: ${err}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafc] flex items-center justify-center p-4">
        <div className="text-center space-y-3 font-mono text-sm text-neutral-600">
          <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mx-auto" />
          <div>Loading product details...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#fafafc] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 border border-neutral-200 text-center space-y-4 shadow-sm max-w-md">
          <h2 className="text-2xl font-bold text-neutral-950">Product Not Found</h2>
          <p className="text-neutral-600 text-sm">
            This item could not be retrieved from the catalog.
          </p>
          <Link
            href="/shop"
            className="inline-block px-6 py-2.5 rounded-full bg-neutral-950 text-white font-bold text-xs"
          >
            Back to Storefront
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafc] text-neutral-900 selection:bg-rose-500 selection:text-white flex flex-col">
      {/* Top Header */}
      <header className="p-5 sm:px-10 flex items-center justify-between border-b border-neutral-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm font-bold text-neutral-600 hover:text-neutral-950 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Shop</span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-rose-500 to-purple-600 p-[1.5px] shadow-sm">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            </div>
          </div>
          <span className="font-extrabold text-base tracking-tight text-neutral-950">
            AURA PRODUCT VERDICT
          </span>
        </div>

        <Link
          href="/cart"
          className="p-2 rounded-full bg-neutral-950 text-white hover:bg-neutral-800 transition shadow-xs"
          title="Cart"
        >
          <ShoppingBag className="w-4 h-4" />
        </Link>
      </header>

      {/* Main Content Bento Layout */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-10 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Visuals & VTO (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Main Product Image Card */}
            <div className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-sm space-y-4">
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-100">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Virtual Try-On Bento Card for Apparel */}
            {product.category === 'apparel' && (
              <div className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-sky-600" />
                    <h2 className="text-base font-bold text-neutral-950">
                      YouCam Virtual Try-On
                    </h2>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                    S2S CLOTH V4
                  </span>
                </div>

                {vtoError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{vtoError}</span>
                  </div>
                )}

                {product.vtoImageUrl ? (
                  <div className="space-y-3">
                    <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-200 shadow-md">
                      <img
                        src={product.vtoImageUrl}
                        alt="Your virtual try-on fit"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-neutral-500 font-mono">
                      <span>Render complete</span>
                      <button
                        onClick={generateVto}
                        disabled={vtoLoading}
                        className="text-purple-600 font-bold hover:underline"
                      >
                        Re-render fit
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 text-center space-y-3">
                    <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                      Render this garment directly onto your uploaded photo to evaluate drape, collar placement, and color compatibility.
                    </p>
                    <button
                      onClick={generateVto}
                      disabled={vtoLoading}
                      className="px-6 py-3 rounded-full bg-neutral-950 text-white font-bold text-xs hover:bg-neutral-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2 mx-auto shadow-xs"
                    >
                      {vtoLoading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Generating Virtual Try-On...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                          <span>Generate Virtual Try-On</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Product Details & Actions (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-7 border border-neutral-200/90 shadow-sm space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-700">
                    {product.category}
                  </span>
                  {product.verdict && (
                    <VerdictBadge tier={product.verdict.tier} />
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950">
                  {product.name}
                </h1>

                {product.verdict && (
                  <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-mono font-semibold text-neutral-500">
                        Passport Confidence Score
                      </div>
                      <div className="text-xs text-neutral-600 mt-0.5">
                        {product.verdict.tier === 'buy'
                          ? 'Optimal harmony with your undertone.'
                          : product.verdict.tier === 'maybe'
                          ? 'Complements with styled accessories.'
                          : 'May clash or highlight surface concerns.'}
                      </div>
                    </div>
                    <div className="text-right pl-3 shrink-0">
                      <div className="text-3xl font-black font-mono text-purple-600">
                        {product.verdict.score}
                      </div>
                      <div className="text-[10px] font-mono text-neutral-400">/100</div>
                    </div>
                  </div>
                )}

                {product.description && (
                  <p className="text-sm text-neutral-600 leading-relaxed pt-2">
                    {product.description}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-neutral-100 space-y-3">
                <button
                  onClick={addToCart}
                  className="w-full py-4 rounded-xl bg-neutral-950 text-white font-extrabold text-sm hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 shadow-xs"
                >
                  {cartSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Inline Advisor */}
            <div>
              <AdvisorPanel
                productId={product.id}
                suggestions={[
                  `Why is this ${product.name} scored for me?`,
                  'Does this match my undertone?',
                  'Show me a try-on on my selfie.',
                ]}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
