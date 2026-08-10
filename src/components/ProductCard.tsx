'use client';

import Link from 'next/link';
import Image from 'next/image';
import VerdictBadge from './VerdictBadge';
import type { Verdict } from '@/domain/verdict/scorer';

export default function ProductCard({
  id,
  name,
  category,
  imageUrl,
  verdict,
}: {
  id: string;
  name: string;
  category: 'apparel' | 'beauty';
  imageUrl: string;
  verdict: Verdict;
}) {
  return (
    <Link href={`/shop/${id}`}>
      <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-4">
        <div className="relative w-full h-48 mb-4 bg-gray-100 rounded">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover rounded"
          />
        </div>
        <h3 className="font-semibold text-lg">{name}</h3>
        <p className="text-sm text-gray-500 capitalize">{category}</p>
        <div className="mt-2">
          <VerdictBadge tier={verdict.tier} />
        </div>
        <p className="text-xs text-gray-400 mt-1">Score: {verdict.score}/100</p>
      </div>
    </Link>
  );
}
