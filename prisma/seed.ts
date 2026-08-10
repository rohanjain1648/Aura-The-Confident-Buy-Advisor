import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? 'file:./dev.db',
});
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.product.deleteMany();
  await prisma.product.createMany({ data: [
    { category: 'apparel', name: 'Olive Field Jacket', brand: 'Northbound', price: 12900,
      imageUrl: '/seed/jacket.jpg', garmentImageUrl: '/seed/jacket-flat.jpg',
      dominantColor: { hex: '#6B7043' } },
    { category: 'apparel', name: 'Cobalt Silk Blouse', brand: 'Maison Lune', price: 8900,
      imageUrl: '/seed/blouse.jpg', garmentImageUrl: '/seed/blouse-flat.jpg',
      dominantColor: { hex: '#1B4FA0' } },
    { category: 'apparel', name: 'Rust Knit Sweater', brand: 'Northbound', price: 7400,
      imageUrl: '/seed/sweater.jpg', garmentImageUrl: '/seed/sweater-flat.jpg',
      dominantColor: { hex: '#B0403A' } },
    { category: 'apparel', name: 'Sage Linen Shirt', brand: 'Maison Lune', price: 6900,
      imageUrl: '/seed/shirt.jpg', garmentImageUrl: '/seed/shirt-flat.jpg',
      dominantColor: { hex: '#8FA382' } },
    { category: 'apparel', name: 'Charcoal Wool Coat', brand: 'Northbound', price: 21900,
      imageUrl: '/seed/coat.jpg', garmentImageUrl: '/seed/coat-flat.jpg',
      dominantColor: { hex: '#3A3A3C' } },
    { category: 'apparel', name: 'Blush Wrap Dress', brand: 'Maison Lune', price: 9900,
      imageUrl: '/seed/dress.jpg', garmentImageUrl: '/seed/dress-flat.jpg',
      dominantColor: { hex: '#D8A9A0' } },
    { category: 'beauty', name: 'Second Skin Foundation 3W', brand: 'Lumen', price: 4200,
      imageUrl: '/seed/foundation-3w.jpg', shadeMeta: { undertone: 'warm', depth: 3 },
      targetsConcerns: ['redness'] },
    { category: 'beauty', name: 'Second Skin Foundation 5C', brand: 'Lumen', price: 4200,
      imageUrl: '/seed/foundation-5c.jpg', shadeMeta: { undertone: 'cool', depth: 5 },
      targetsConcerns: ['oiliness'] },
    { category: 'beauty', name: 'Clarity Serum', brand: 'Lumen', price: 5600,
      imageUrl: '/seed/serum.jpg', shadeMeta: { undertone: 'neutral', depth: 5 },
      targetsConcerns: ['spots', 'texture'] },
    { category: 'beauty', name: 'Bright Eyes Concealer', brand: 'Lumen', price: 3200,
      imageUrl: '/seed/concealer.jpg', shadeMeta: { undertone: 'warm', depth: 4 },
      targetsConcerns: ['darkCircles'] },
  ] });
}

main().finally(() => prisma.$disconnect());
