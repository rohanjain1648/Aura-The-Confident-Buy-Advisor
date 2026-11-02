import type { Tier } from '@/lib/concerns';
import { CheckCircle2, Star, Ban } from 'lucide-react';

const tierConfig: Record<
  Tier,
  { label: string; pill: string; icon: typeof CheckCircle2 }
> = {
  buy: {
    label: 'Perfect Match',
    pill: 'bg-emerald-50 text-emerald-700 border-emerald-200/90 shadow-xs',
    icon: CheckCircle2,
  },
  maybe: {
    label: 'Complements',
    pill: 'bg-amber-50 text-amber-700 border-amber-200/90 shadow-xs',
    icon: Star,
  },
  skip: {
    label: 'Skip',
    pill: 'bg-rose-50 text-rose-700 border-rose-200/90 shadow-xs',
    icon: Ban,
  },
};

export default function VerdictBadge({ tier }: { tier: Tier }) {
  const config = tierConfig[tier];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border font-mono ${config.pill}`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{config.label}</span>
    </span>
  );
}
