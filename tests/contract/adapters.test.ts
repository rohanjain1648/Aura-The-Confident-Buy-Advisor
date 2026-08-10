import { describe, it, expect } from 'vitest';
import { analyzeSkin, analyzeSkinTone, tryOnCloth } from '@/server/youcam/adapters';

describe('adapters fixture mode', () => {
  it('analyzeSkin returns 8 concern scores', async () => {
    process.env.YOUCAM_MODE = 'fixture';
    const r = await analyzeSkin('file1');
    expect(r.scores.redness).toBe(72);
  });

  it('analyzeSkinTone returns undertone', async () => {
    expect((await analyzeSkinTone('file1')).undertone).toBe('warm');
  });

  it('tryOnCloth returns an image url', async () => {
    expect((await tryOnCloth('p', 'g')).imageUrl).toMatch(/\.jpg$/);
  });
});
