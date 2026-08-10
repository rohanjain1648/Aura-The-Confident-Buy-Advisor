import { describe, it, expect } from 'vitest';
import { computeVerdictAndVto } from '@/server/orchestrators/verdict';

describe('verdict orchestrator', () => {
  it('computes verdict and optionally generates VTO', async () => {
    process.env.YOUCAM_MODE = 'fixture';
    const sess = 'test-sess-1';
    const productId = 'cmroerrfs0000lkuhl8z3nn1w'; // Seeded apparel product

    const result = await computeVerdictAndVto(sess, productId);
    expect(result.verdict).toBeTruthy();
    expect(result.verdict.score).toBeGreaterThanOrEqual(0);
    expect(result.verdict.score).toBeLessThanOrEqual(100);
  });
});
