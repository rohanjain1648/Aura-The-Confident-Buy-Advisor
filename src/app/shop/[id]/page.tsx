'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import VerdictBadge from '@/components/VerdictBadge';
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

  useEffect(() => {
    // No dedicated /api/product/[id] route exists; fetch the personalized shop
    // list and pick out the matching product (already includes its verdict).
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
    try {
      const res = await fetch('/api/verdict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (data.vtoImageUrl) {
        setProduct((p) => (p ? { ...p, vtoImageUrl: data.vtoImageUrl } : p));
      }
    } catch (err) {
      console.error('VTO generation failed:', err);
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
      alert('Added to cart!');
    } catch (err) {
      alert(`Error: ${err}`);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!product) return <div className="p-4">Product not found</div>;

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        {product.verdict && <VerdictBadge tier={product.verdict.tier} />}

        {product.category === 'apparel' && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Virtual Try-On</h2>
            {product.vtoImageUrl ? (
              <img src={product.vtoImageUrl} alt="VTO" className="w-full rounded-lg mb-4" />
            ) : (
              <Button onClick={generateVto} disabled={vtoLoading}>
                {vtoLoading ? 'Generating...' : 'Generate VTO'}
              </Button>
            )}
          </div>
        )}

        <div className="mt-8 flex gap-4">
          <Button onClick={addToCart} size="lg">
            Add to Cart
          </Button>
          <Button variant="outline" size="lg">
            Save Look
          </Button>
        </div>
      </div>
    </div>
  );
}
