import { describe, it, expect } from 'vitest';

describe('UI components and pages', () => {
  it('exports utility functions', async () => {
    const { cn } = await import('@/lib/utils');
    expect(cn).toBeDefined();
    expect(cn('a', 'b')).toContain('a');
  });

  it('exports VerdictBadge component', async () => {
    const mod = await import('@/components/VerdictBadge');
    expect(mod.default).toBeDefined();
  });

  it('exports ProductCard component', async () => {
    const mod = await import('@/components/ProductCard');
    expect(mod.default).toBeDefined();
  });
});
