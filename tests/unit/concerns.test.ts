import { describe, it, expect } from 'vitest';
import { CONCERNS, UNDERTONES } from '@/lib/concerns';

describe('domain constants', () => {
  it('lists all 8 concerns', () => {
    expect(CONCERNS).toHaveLength(8);
    expect(CONCERNS).toContain('redness');
  });
  it('lists 3 undertones', () => {
    expect(UNDERTONES).toEqual(['warm', 'cool', 'neutral']);
  });
});
