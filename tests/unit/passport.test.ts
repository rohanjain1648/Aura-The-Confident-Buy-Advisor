import { describe, it, expect } from 'vitest';
import { normalizePassport } from '@/domain/skin/passport';
const raw = {
  skinAnalysis: { scores: { redness: 72, oiliness: 40, spots: 12, texture: 55, darkCircles: 30, pores: 25, wrinkles: 10, acne: 18 } },
  skinTone: { undertone: 'warm', depth: 3, hex: '#C9A98B' },
};
describe('normalizePassport', () => {
  it('maps all 8 concerns to 0..100 numbers', () => {
    const p = normalizePassport(raw);
    expect(Object.keys(p.concerns)).toHaveLength(8);
    expect(p.concerns.redness).toBe(72);
  });
  it('derives topConcern as the highest score', () => {
    expect(normalizePassport(raw).topConcern).toBe('redness');
  });
  it('defaults missing undertone to neutral and missing scores to 0', () => {
    const p = normalizePassport({ skinAnalysis: { scores: {} }, skinTone: {} });
    expect(p.undertone).toBe('neutral');
    expect(p.concerns.acne).toBe(0);
    expect(p.topConcern).toBeDefined();
  });
  it('clamps depth to 1..10', () => {
    expect(normalizePassport({ ...raw, skinTone: { undertone:'cool', depth: 99 } }).toneDepth).toBe(10);
  });
});
