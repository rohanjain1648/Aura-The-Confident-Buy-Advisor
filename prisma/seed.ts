import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? 'file:./dev.db',
});
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.product.deleteMany();
  await prisma.product.createMany({ data: [
    { category: 'apparel', name: 'Olive Hooded Parka', brand: 'Aura Studio', price: 12900,
      imageUrl: '/seed/olive-parka.jpg', garmentImageUrl: '/seed/olive-parka.jpg',
      dominantColor: { hex: '#6F6A4A' } },
    { category: 'apparel', name: 'Sky Poplin Shirt', brand: 'Aura Studio', price: 8900,
      imageUrl: '/seed/sky-shirt.jpg', garmentImageUrl: '/seed/sky-shirt.jpg',
      dominantColor: { hex: '#BCD3EC' } },
    { category: 'apparel', name: 'Crimson Knit Sweater', brand: 'Aura Studio', price: 7400,
      imageUrl: '/seed/crimson-knit.jpg', garmentImageUrl: '/seed/crimson-knit.jpg',
      dominantColor: { hex: '#9E1F1C' } },
    { category: 'apparel', name: 'Sage Oxford Shirt', brand: 'Aura Studio', price: 6900,
      imageUrl: '/seed/sage-shirt.jpg', garmentImageUrl: '/seed/sage-shirt.jpg',
      dominantColor: { hex: '#8E9F88' } },
    { category: 'apparel', name: 'Camel Belted Trench', brand: 'Aura Studio', price: 21900,
      imageUrl: '/seed/camel-trench.jpg', garmentImageUrl: '/seed/camel-trench.jpg',
      dominantColor: { hex: '#B8935F' } },
    { category: 'apparel', name: 'Blush Everyday Tee', brand: 'Aura Studio', price: 3900,
      imageUrl: '/seed/blush-tee.jpg', garmentImageUrl: '/seed/blush-tee.jpg',
      dominantColor: { hex: '#D78E94' } },
    { category: 'apparel', name: 'Onyx Everyday Tee', brand: 'Aura Studio', price: 3900,
      imageUrl: '/seed/onyx-tee.jpg', garmentImageUrl: '/seed/onyx-tee.jpg',
      dominantColor: { hex: '#141414' } },
    { category: 'beauty', name: 'Second Skin Foundation 3W', brand: 'Aura Skin', price: 4200,
      imageUrl: '/seed/foundation-warm.jpg', shadeMeta: { undertone: 'warm', depth: 3 },
      targetsConcerns: ['redness'] },
    { category: 'beauty', name: 'Second Skin Foundation 5C', brand: 'Aura Skin', price: 4200,
      imageUrl: '/seed/foundation-cool.jpg', shadeMeta: { undertone: 'cool', depth: 5 },
      targetsConcerns: ['oiliness'] },
    { category: 'beauty', name: 'Clarity Serum', brand: 'Aura Skin', price: 5600,
      imageUrl: '/seed/serum.jpg', shadeMeta: { undertone: 'neutral', depth: 5 },
      targetsConcerns: ['spots', 'texture'] },
    { category: 'beauty', name: 'Bright Eyes Concealer', brand: 'Aura Skin', price: 3200,
      imageUrl: '/seed/concealer.jpg', shadeMeta: { undertone: 'warm', depth: 4 },
      targetsConcerns: ['darkCircles'] },
  ] });
}

main().finally(() => prisma.$disconnect());
