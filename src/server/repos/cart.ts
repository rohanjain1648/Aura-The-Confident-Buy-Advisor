import { prisma } from '@/lib/db';

export async function addToCart(sessionId: string, productId: string): Promise<void> {
  await prisma.cartItem.create({
    data: { sessionId, productId },
  });
}

export async function listCart(sessionId: string) {
  return await prisma.cartItem.findMany({ where: { sessionId } });
}
