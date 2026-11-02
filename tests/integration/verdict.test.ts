import { describe, it, expect } from 'vitest';
import { computeVerdictAndVto } from '@/server/orchestrators/verdict';
import { analyzeSkinAndSave } from '@/server/orchestrators/skin';
import { getOrCreateSession } from '@/server/repos/session';
import { prisma } from '@/lib/db';

describe('verdict orchestrator', () => {
  it('computes a verdict and a try-on from the stored photo', async () => {
    process.env.YOUCAM_MODE = 'fixture';
    const sess = `test-verdict-${Date.now()}`;
    await getOrCreateSession(sess);
    await analyzeSkinAndSave(sess, Buffer.from('fake-image'));
    const product = await prisma.product.findFirstOrThrow({ where: { category: 'apparel' } });

    const result = await computeVerdictAndVto(sess, product.id);
    expect(result.verdict.score).toBeGreaterThanOrEqual(0);
    expect(result.verdict.score).toBeLessThanOrEqual(100);
    expect(result.vtoImageUrl).toBeTruthy();
  });

  it('asks for a selfie when the session has no passport', async () => {
    process.env.YOUCAM_MODE = 'fixture';
    const product = await prisma.product.findFirstOrThrow({ where: { category: 'apparel' } });
    await expect(computeVerdictAndVto(`test-empty-${Date.now()}`, product.id)).rejects.toThrow(/selfie/i);
  });
});
