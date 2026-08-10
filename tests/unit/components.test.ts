import { describe, it, expect } from 'vitest';

describe('onboarding capture component', () => {
  it('exports OnboardingCapture component', async () => {
    const module = await import('@/components/OnboardingCapture');
    expect(module.default).toBeDefined();
  });
});
