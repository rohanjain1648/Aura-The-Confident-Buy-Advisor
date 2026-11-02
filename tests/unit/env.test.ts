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

  it('defaults LLM to groq and rejects unknown providers', () => {
    delete process.env.LLM_PROVIDER;
    expect(getServerEnv().LLM_PROVIDER).toBe('groq');
    process.env.LLM_PROVIDER = 'anthropic';
    expect(() => getServerEnv()).toThrow(/LLM_PROVIDER/);
    delete process.env.LLM_PROVIDER;
  });

  it('throws in live mode without an API key', () => {
    process.env.YOUCAM_MODE = 'live';
    delete process.env.YOUCAM_API_KEY;
    expect(() => getServerEnv()).toThrow(/YOUCAM_API_KEY/);
    delete process.env.YOUCAM_MODE;
  });

  it('accepts live mode with only an API key', () => {
    process.env.YOUCAM_MODE = 'live';
    process.env.YOUCAM_API_KEY = 'k';
    expect(getServerEnv().YOUCAM_API_KEY).toBe('k');
    delete process.env.YOUCAM_MODE;
    delete process.env.YOUCAM_API_KEY;
  });
});
