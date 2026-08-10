import { prisma } from '@/lib/db';
import type { Verdict } from '@/domain/verdict/scorer';

export async function saveVerdict(
  sessionId: string,
  productId: string,
  verdict: Verdict,
  vtoImageUrl?: string
): Promise<void> {
  await prisma.verdict.create({
    data: {
      sessionId,
      productId,
      score: verdict.score,
      tier: verdict.tier,
      harmony: verdict.harmony,
      shadeMatch: verdict.shadeMatch,
      vtoImageUrl,
      reasons: verdict.reasons as object,
      nextBestAction: verdict.nextBestAction,
    },
  });
}

export async function listVerdicts(sessionId: string): Promise<Verdict[]> {
  const rows = await prisma.verdict.findMany({ where: { sessionId } });
  return rows.map((r) => ({
    score: r.score,
    tier: r.tier as Verdict['tier'],
    harmony: r.harmony ?? undefined,
    shadeMatch: r.shadeMatch ?? undefined,
    reasons: r.reasons as string[],
    nextBestAction: r.nextBestAction ?? undefined,
  }));
}
