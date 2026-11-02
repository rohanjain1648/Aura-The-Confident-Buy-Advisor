import { scoreHarmony } from '@/domain/harmony/engine';
import type { SkinPassport } from '@/domain/skin/passport';
import type { Tier, Concern } from '@/lib/concerns';
export interface VerdictInput {
  category: 'apparel' | 'beauty';
  dominantColor?: { hex: string };
  shadeMeta?: { undertone: string; depth: number };
  targetsConcerns?: Concern[];
}
export interface Verdict { score: number; tier: Tier; harmony?: number; shadeMatch?: number; reasons: string[]; nextBestAction?: string }
const tierOf = (s: number): Tier => (s >= 70 ? 'buy' : s >= 45 ? 'maybe' : 'skip');
export function computeVerdict(p: SkinPassport, product: VerdictInput): Verdict {
  const reasons: string[] = [];
  if (product.category === 'apparel') {
    const hex = product.dominantColor?.hex ?? '#808080';
    const h = scoreHarmony(p.undertone, hex);
    // Additive boost (monotonic, preserves relative ordering between garments) so that
    // strongly-flattering harmony scores clear the 'buy' tier threshold in the verdict layer.
    const score = Math.round(Math.max(0, Math.min(100, h.score + 15)));
    const effect = h.verdict === 'flatters' ? 'flatters' : h.verdict === 'clashes' ? 'clashes with' : 'is a neutral match for';
    reasons.push(`This color ${effect} your ${p.undertone} undertone (${h.score}/100 harmony).`);
    return { score, tier: tierOf(score), harmony: h.score, reasons };
  }
  // beauty: undertone match (0..60) + concern targeting (0..40)
  const undertoneMatch = product.shadeMeta?.undertone === p.undertone ? 60 : product.shadeMeta?.undertone === 'neutral' ? 40 : 20;
  const depthGap = Math.abs((product.shadeMeta?.depth ?? p.toneDepth) - p.toneDepth);
  const depthPenalty = Math.min(20, depthGap * 5);
  const targets = product.targetsConcerns?.includes(p.topConcern) ? 40 : 0;
  const shadeMatch = Math.max(0, Math.min(100, undertoneMatch - depthPenalty + Math.min(40, (product.targetsConcerns?.length ?? 0) * 10)));
  if (product.shadeMeta) reasons.push(`Shade undertone ${product.shadeMeta.undertone === p.undertone ? 'matches' : 'differs from'} your ${p.undertone} tone.`);
  if (targets) reasons.push(`Targets your top concern: ${p.topConcern}.`);
  const score = Math.round(Math.max(0, Math.min(100, shadeMatch * 0.7 + targets * 0.75)));
  const nextBestAction = score < 70 && product.shadeMeta?.undertone !== p.undertone
    ? `Look for a ${p.undertone}-undertone shade in this line.` : undefined;
  return { score, tier: tierOf(score), shadeMatch, reasons, nextBestAction };
}
