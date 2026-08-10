import { describe, it, expect } from 'vitest';
import { getOrCreateSession } from '@/server/repos/session';
import { savePassport, getPassport } from '@/server/repos/passport';

describe('passport repo', () => {
  it('round-trips a passport', async () => {
    const s = await getOrCreateSession('test-sess-1');
    await savePassport(s.id, {
      undertone: 'warm',
      toneDepth: 3,
      topConcern: 'redness',
      concerns: {
        redness: 72,
        oiliness: 40,
        spots: 12,
        texture: 55,
        darkCircles: 30,
        pores: 25,
        wrinkles: 10,
        acne: 18,
      },
    });
    const p = await getPassport(s.id);
    expect(p?.undertone).toBe('warm');
    expect(p?.concerns.redness).toBe(72);
  });
});
