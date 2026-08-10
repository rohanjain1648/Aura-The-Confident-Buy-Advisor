'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

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

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Cart</h1>
        {items.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div>
            <p>{items.length} items in cart</p>
            <Button className="mt-4">Checkout</Button>
          </div>
        )}
      </div>
    </div>
  );
}
