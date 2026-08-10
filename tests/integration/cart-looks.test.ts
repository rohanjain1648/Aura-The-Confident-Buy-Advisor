import { describe, it, expect } from 'vitest';

describe('cart and looks routes', () => {
  it('exports route handlers', async () => {
    const cartRoute = await import('@/app/api/cart/route');
    const looksRoute = await import('@/app/api/looks/route');
    const lookDetailRoute = await import('@/app/api/looks/[id]/route');

    expect(cartRoute.GET).toBeDefined();
    expect(cartRoute.POST).toBeDefined();
    expect(looksRoute.POST).toBeDefined();
    expect(lookDetailRoute.GET).toBeDefined();
  });
});
