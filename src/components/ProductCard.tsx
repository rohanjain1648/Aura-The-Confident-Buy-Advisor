'use client';

import Link from 'next/link';
import Image from 'next/image';
import VerdictBadge from './VerdictBadge';
import type { Verdict } from '@/domain/verdict/scorer';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

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
    <Link href={`/shop/${id}`} className="block h-full group">
      <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm hover:shadow-xl hover:border-purple-200 transition-all duration-300 p-5 flex flex-col justify-between h-full group-hover:-translate-y-1">
        <div>
          {/* Image Container */}
          <div className="relative w-full aspect-[4/3] mb-4 bg-neutral-100 rounded-2xl overflow-hidden border border-neutral-100">
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-mono font-bold uppercase text-neutral-700 shadow-xs border border-white/50">
                {category}
              </span>
            </div>
            {verdict.tier === 'buy' && (
              <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-mono font-bold flex items-center gap-1 shadow-md">
                <CheckCircle2 className="w-3 h-3" />
                <span>TOP MATCH</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-2">
            <h3 className="font-extrabold text-lg text-neutral-950 group-hover:text-purple-700 transition-colors line-clamp-1 font-sans">
              {name}
            </h3>

            {/* Verdict Badge */}
            <div className="pt-1">
              <VerdictBadge tier={verdict.tier} />
            </div>
          </div>
        </div>

        {/* Footer Score & CTA */}
        <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5 font-mono">
            <span className="text-xs text-neutral-400 font-semibold">Score:</span>
            <span className={`text-base font-black ${
              verdict.score >= 80 ? 'text-emerald-600' : verdict.score >= 50 ? 'text-amber-600' : 'text-rose-600'
            }`}>
              {verdict.score}/100
            </span>
          </div>

          <span className="text-xs font-bold text-neutral-500 group-hover:text-purple-700 flex items-center gap-1 transition-colors">
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}
