import { describe, it, expect } from 'vitest';
import { normalizePassport, toneFromHex } from '@/domain/skin/passport';
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
  it('derives undertone and depth from the hex when YouCam only returns a colour', () => {
    const p = normalizePassport({ skinAnalysis: { scores: {} }, skinTone: { hex: '#C9A98B' } });
    expect(p.undertone).toBe('warm');
    expect(p.toneDepth).toBe(3);
    expect(p.foundationShade).toBe('#C9A98B');
  });
});

describe('toneFromHex', () => {
  it('reads yellow-leaning skin as warm', () => {
    expect(toneFromHex('#F1C27D').undertone).toBe('warm');
  });
  it('reads pink-leaning skin as cool', () => {
    expect(toneFromHex('#EFCFC4').undertone).toBe('cool');
  });
  it('reads in-between skin as neutral', () => {
    expect(toneFromHex('#D8B7A0').undertone).toBe('neutral');
  });
  it('gets deeper as skin gets darker, within 1..10', () => {
    const light = toneFromHex('#FFDBAC').depth;
    const medium = toneFromHex('#C68642').depth;
    const deep = toneFromHex('#3B2219').depth;
    expect(light).toBeLessThan(medium);
    expect(medium).toBeLessThan(deep);
    expect(light).toBeGreaterThanOrEqual(1);
    expect(deep).toBeLessThanOrEqual(10);
  });
});
