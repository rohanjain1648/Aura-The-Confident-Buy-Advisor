'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import AdvisorPanel from '@/components/AdvisorPanel';
import type { Verdict } from '@/domain/verdict/scorer';

interface ProductWithVerdict {
  id: string;
  name: string;
  category: 'apparel' | 'beauty';
  imageUrl: string;
  verdict: Verdict;
}

export default function ShopPage() {
  const [products, setProducts] = useState<ProductWithVerdict[]>([]);
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

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Personalized Shop</h1>
        <div className="mb-8">
          <AdvisorPanel
            suggestions={[
              'What should I buy first?',
              'What suits my undertone?',
              'Which beauty product fits my top concern?',
            ]}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
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
      </div>
    </div>
  );
}
