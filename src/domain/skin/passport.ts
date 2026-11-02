import { hexToLab } from '@/lib/color';
import { CONCERNS, type Concern, type ConcernScores, type Undertone, UNDERTONES } from '@/lib/concerns';
export interface RawSkin { scores: Partial<Record<string, number>> }
export interface RawTone { undertone?: string; depth?: number; hex?: string }
export interface SkinPassport {
  undertone: Undertone; toneDepth: number; concerns: ConcernScores; foundationShade?: string; topConcern: Concern;
}
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

/**
 * YouCam reports a skin colour, not an undertone or depth, so derive both in CIELAB.
 * Undertone: hue angle (yellow-leaning skin sits higher than pink-leaning skin).
 * Depth: lightness, L* 85 (fairest) to L* 30 (deepest) mapped onto 1..10.
 */
export function toneFromHex(hex: string): { undertone: Undertone; depth: number } {
  const { L, a, b } = hexToLab(hex);
  const hue = (Math.atan2(b, a) * 180) / Math.PI;
  const undertone: Undertone = hue >= 65 ? 'warm' : hue < 52 ? 'cool' : 'neutral';
  return { undertone, depth: clamp(Math.round(1 + ((85 - L) / 55) * 9), 1, 10) };
}

export function normalizePassport(raw: { skinAnalysis: RawSkin; skinTone: RawTone }): SkinPassport {
  const concerns = Object.fromEntries(
    CONCERNS.map(c => [c, clamp(Math.round(raw.skinAnalysis.scores[c] ?? 0), 0, 100)])
  ) as ConcernScores;
  const topConcern = CONCERNS.reduce((a, b) => (concerns[b] > concerns[a] ? b : a), CONCERNS[0]);
  const derived = raw.skinTone.hex ? toneFromHex(raw.skinTone.hex) : undefined;
  const undertone = (UNDERTONES as readonly string[]).includes(raw.skinTone.undertone ?? '')
    ? (raw.skinTone.undertone as Undertone) : derived?.undertone ?? 'neutral';
  return {
    undertone,
    toneDepth: clamp(Math.round(raw.skinTone.depth ?? derived?.depth ?? 5), 1, 10),
    concerns, topConcern,
    foundationShade: raw.skinTone.hex,
  };
}
