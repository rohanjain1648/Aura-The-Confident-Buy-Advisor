import { prisma } from '@/lib/db';

export async function listProducts(category?: string) {
  return await prisma.product.findMany({
    where: category ? { category } : undefined,
  });
}

export async function getProduct(id: string) {
  return await prisma.product.findUnique({ where: { id } });
}
