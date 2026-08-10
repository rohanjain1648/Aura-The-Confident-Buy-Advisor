import type { Tier } from '@/lib/concerns';

const tierColors: Record<Tier, string> = {
  buy: 'bg-green-100 text-green-800',
  maybe: 'bg-yellow-100 text-yellow-800',
  skip: 'bg-red-100 text-red-800',
};

export default function VerdictBadge({ tier }: { tier: Tier }) {
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${tierColors[tier]}`}>
      {tier === 'buy' ? '✨ Perfect Match' : tier === 'maybe' ? '⭐ Complements' : '⊘ Skip'}
    </span>
  );
}
