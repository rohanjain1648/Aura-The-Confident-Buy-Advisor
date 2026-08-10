import { describe, it, expect } from 'vitest';
import { computeVerdict } from '@/domain/verdict/scorer';
import type { SkinPassport } from '@/domain/skin/passport';
const warm: SkinPassport = { undertone:'warm', toneDepth:3, topConcern:'redness',
  concerns:{ redness:72, oiliness:40, spots:12, texture:55, darkCircles:30, pores:25, wrinkles:10, acne:18 } };
describe('computeVerdict apparel', () => {
  it('scores a flattering-color garment as buy', () => {
    const v = computeVerdict(warm, { category:'apparel', dominantColor:{ hex:'#6B7043' } });
    expect(v.harmony).toBeGreaterThan(0);
    expect(v.tier).toBe('buy');
    expect(v.reasons.join(' ')).toMatch(/undertone/i);
  });
  it('scores a clashing-color garment lower', () => {
    const good = computeVerdict(warm, { category:'apparel', dominantColor:{ hex:'#6B7043' } }).score;
    const bad = computeVerdict(warm, { category:'apparel', dominantColor:{ hex:'#1B4FA0' } }).score;
    expect(bad).toBeLessThan(good);
  });
});
describe('computeVerdict beauty', () => {
  it('rewards matching undertone + targeting top concern', () => {
    const v = computeVerdict(warm, { category:'beauty', shadeMeta:{ undertone:'warm', depth:3 }, targetsConcerns:['redness'] });
    expect(v.shadeMatch).toBeGreaterThanOrEqual(70);
    expect(v.reasons.join(' ')).toMatch(/redness/i);
    expect(v.tier).toBe('buy');
  });
  it('penalizes mismatched undertone', () => {
    const v = computeVerdict(warm, { category:'beauty', shadeMeta:{ undertone:'cool', depth:8 }, targetsConcerns:[] });
    expect(v.tier).not.toBe('buy');
  });
});
