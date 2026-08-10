import { prisma } from '@/lib/db';
import type { SkinPassport } from '@/domain/skin/passport';
import { CONCERNS } from '@/lib/concerns';

export async function savePassport(sessionId: string, p: SkinPassport): Promise<void> {
  await prisma.skinPassport.upsert({
    where: { sessionId },
    create: {
      sessionId,
      undertone: p.undertone,
      toneDepth: p.toneDepth,
      concerns: p.concerns as object,
      foundationShade: p.foundationShade,
    },
    update: {
      undertone: p.undertone,
      toneDepth: p.toneDepth,
      concerns: p.concerns as object,
      foundationShade: p.foundationShade,
    },
  });
}

export async function getPassport(sessionId: string): Promise<SkinPassport | null> {
  const row = await prisma.skinPassport.findUnique({ where: { sessionId } });
  if (!row) return null;
  const concerns = row.concerns as SkinPassport['concerns'];
  const topConcern = CONCERNS.reduce((a, b) => (concerns[b] > concerns[a] ? b : a), CONCERNS[0]);
  return {
    undertone: row.undertone as SkinPassport['undertone'],
    toneDepth: row.toneDepth,
    concerns,
    foundationShade: row.foundationShade ?? undefined,
    topConcern,
  };
}
