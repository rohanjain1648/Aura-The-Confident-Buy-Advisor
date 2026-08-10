import { describe, it, expect } from 'vitest';
import { hexToLab, deltaE } from '@/lib/color';

describe('color', () => {
  it('maps white to L~100', () => { expect(hexToLab('#ffffff').L).toBeGreaterThan(99); });
  it('maps black to L~0', () => { expect(hexToLab('#000000').L).toBeLessThan(1); });
  it('deltaE is 0 for identical colors', () => {
    expect(deltaE(hexToLab('#6B7043'), hexToLab('#6B7043'))).toBeCloseTo(0, 4);
  });
  it('deltaE grows with difference', () => {
    const near = deltaE(hexToLab('#1B4FA0'), hexToLab('#1B50A2'));
    const far = deltaE(hexToLab('#1B4FA0'), hexToLab('#B0403A'));
    expect(far).toBeGreaterThan(near);
  });
});
