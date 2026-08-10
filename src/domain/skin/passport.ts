import { CONCERNS, type Concern, type ConcernScores, type Undertone, UNDERTONES } from '@/lib/concerns';
export interface RawSkin { scores: Partial<Record<string, number>> }
export interface RawTone { undertone?: string; depth?: number; hex?: string }
export interface SkinPassport {
  undertone: Undertone; toneDepth: number; concerns: ConcernScores; foundationShade?: string; topConcern: Concern;
}
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
export function normalizePassport(raw: { skinAnalysis: RawSkin; skinTone: RawTone }): SkinPassport {
  const concerns = Object.fromEntries(
    CONCERNS.map(c => [c, clamp(Math.round(raw.skinAnalysis.scores[c] ?? 0), 0, 100)])
  ) as ConcernScores;
  const topConcern = CONCERNS.reduce((a, b) => (concerns[b] > concerns[a] ? b : a), CONCERNS[0]);
  const undertone = (UNDERTONES as readonly string[]).includes(raw.skinTone.undertone ?? '')
    ? (raw.skinTone.undertone as Undertone) : 'neutral';
  return {
    undertone,
    toneDepth: clamp(Math.round(raw.skinTone.depth ?? 5), 1, 10),
    concerns, topConcern,
    foundationShade: raw.skinTone.hex,
  };
}
