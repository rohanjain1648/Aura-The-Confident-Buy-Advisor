import { hexToLab } from '@/lib/color';
import type { Undertone } from '@/lib/concerns';
// Ideal chroma direction per undertone: warm favors +a/+b (reds/yellows), cool favors -a/-b (blues/greens-blue).
const IDEAL: Record<Undertone, { a: number; b: number }> = {
  warm:    { a:  18, b:  28 },
  cool:    { a: -6,  b: -22 },
  neutral: { a:  6,  b:   3 },
};
export function scoreHarmony(undertone: Undertone, garmentHex: string) {
  const lab = hexToLab(garmentHex);
  const ideal = IDEAL[undertone];
  // distance in the warmth plane only (ignore lightness so dark/light garments aren't penalized)
  const d = Math.sqrt((lab.a-ideal.a)**2 + (lab.b-ideal.b)**2);
  // neutral is more forgiving: gentler falloff
  const falloff = undertone === 'neutral' ? 90 : 55;
  const score = Math.round(Math.max(0, Math.min(100, 100 * Math.exp(-d/falloff))));
  const verdict = score >= 70 ? 'flatters' : score >= 45 ? 'neutral' : 'clashes';
  return { score, verdict: verdict as 'flatters'|'neutral'|'clashes' };
}
