import { describe, it, expect } from 'vitest';
import { getSessionId } from '@/middleware';

describe('middleware session extraction', () => {
  it('extracts session ID from cookies or generates one', async () => {
    // Simulate no existing session cookie
    const sessionId = await getSessionId({
      cookies: {
        get: (name: string) => undefined,
      },
    } as any);

    expect(sessionId).toBeTruthy();
    expect(typeof sessionId).toBe('string');
  });
});
