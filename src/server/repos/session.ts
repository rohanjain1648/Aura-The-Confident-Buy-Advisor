import { prisma } from '@/lib/db';

export async function getOrCreateSession(id: string) {
  return await prisma.session.upsert({
    where: { id },
    create: { id },
    update: {},
  });
}
