import { prisma } from '@/lib/db';

export async function saveLook(sessionId: string, productId: string, vtoImageUrl: string) {
  const look = await prisma.savedLook.create({
    data: { sessionId, productId, vtoImageUrl },
  });
  return { id: look.id };
}

export async function getLook(id: string) {
  return await prisma.savedLook.findUnique({ where: { id } });
}
