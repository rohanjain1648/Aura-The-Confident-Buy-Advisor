// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { prisma } from '@/lib/db';

describe('catalog', () => {
  it('has apparel and beauty products seeded', async () => {
    const apparel = await prisma.product.count({ where: { category: 'apparel' } });
    const beauty = await prisma.product.count({ where: { category: 'beauty' } });
    expect(apparel).toBeGreaterThanOrEqual(6);
    expect(beauty).toBeGreaterThanOrEqual(4);
  });
});
