'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Your Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold">Cart</h3>
            <p className="text-3xl font-bold text-pink-600 mt-2">{cartCount}</p>
            <Link href="/cart">
              <Button className="mt-4 w-full">View Cart</Button>
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold">Saved Looks</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">—</p>
            <Button className="mt-4 w-full" disabled>
              Coming Soon
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold">History</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">—</p>
            <Button className="mt-4 w-full" disabled>
              Coming Soon
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
