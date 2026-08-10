import { describe, it, expect } from 'vitest';
import { scoreHarmony } from '@/domain/harmony/engine';
describe('scoreHarmony', () => {
  it('warm undertone flatters warm olive over cool cobalt', () => {
    const olive = scoreHarmony('warm', '#6B7043').score;
    const cobalt = scoreHarmony('warm', '#1B4FA0').score;
    expect(olive).toBeGreaterThan(cobalt);
  });
  it('cool undertone flatters cobalt over olive', () => {
    const cobalt = scoreHarmony('cool', '#1B4FA0').score;
    const olive = scoreHarmony('cool', '#6B7043').score;
    expect(cobalt).toBeGreaterThan(olive);
  });
  it('neutral undertone tolerates both (scores within 20 pts)', () => {
    const a = scoreHarmony('neutral', '#6B7043').score;
    const b = scoreHarmony('neutral', '#1B4FA0').score;
    expect(Math.abs(a-b)).toBeLessThanOrEqual(20);
  });
  it('returns a verdict label consistent with score', () => {
    const r = scoreHarmony('warm', '#6B7043');
    expect(['flatters','neutral','clashes']).toContain(r.verdict);
    if (r.score >= 70) expect(r.verdict).toBe('flatters');
  });
  it('clamps score to 0..100', () => {
    for (const hex of ['#000000','#ffffff','#ff0000','#00ff00']) {
      const s = scoreHarmony('cool', hex).score;
      expect(s).toBeGreaterThanOrEqual(0); expect(s).toBeLessThanOrEqual(100);
    }
  });
});
