import { describe, it, expect, beforeEach } from 'vitest';
import { getServerEnv } from '@/lib/env';

describe('getServerEnv', () => {
  beforeEach(() => {
    process.env.DATABASE_URL = 'file:./dev.db';
    process.env.YOUCAM_BASE_URL = 'https://yce-api-01.perfectcorp.com';
  });

  it('defaults to fixture mode', () => {
    delete process.env.YOUCAM_MODE;
    expect(getServerEnv().YOUCAM_MODE).toBe('fixture');
  });

  it('throws in live mode without credentials', () => {
    process.env.YOUCAM_MODE = 'live';
    delete process.env.YOUCAM_CLIENT_ID;
    expect(() => getServerEnv()).toThrow(/YOUCAM_CLIENT_ID/);
  });
});
