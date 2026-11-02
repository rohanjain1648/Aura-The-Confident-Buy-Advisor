import { describe, it, expect } from 'vitest';
import { analyzeSkinAndSave } from '@/server/orchestrators/skin';
import { getPersonFileId } from '@/server/repos/passport';
import { getSessionId } from '@/middleware';

describe('skin orchestrator', () => {
  it('normalizes raw skin analysis into passport, saves and returns it', async () => {
    process.env.YOUCAM_MODE = 'fixture';
    const sess = 'test-sess-1';
    const imageBytes = Buffer.from('fake-image');

    const result = await analyzeSkinAndSave(sess, imageBytes);
    expect(result.status).toBe('complete');
    expect(result.passport.undertone).toBe('warm');
    expect(result.passport.topConcern).toBe('redness');
  });

  it('saves for a browser session whose cookie was set by middleware', async () => {
    process.env.YOUCAM_MODE = 'fixture';
    const cookieId = `sess_cookie_${Date.now()}`;
    const sessionId = await getSessionId({ cookies: { get: () => ({ value: cookieId }) } });
    expect(sessionId).toBe(cookieId);
    const result = await analyzeSkinAndSave(sessionId, Buffer.from('fake-image'));
    expect(result.status).toBe('complete');
  });

  it('remembers the uploaded photo so try-on can run later', async () => {
    process.env.YOUCAM_MODE = 'fixture';
    await analyzeSkinAndSave('test-sess-1', Buffer.from('crop'), { personBytes: Buffer.from('full') });
    expect(await getPersonFileId('test-sess-1')).toBe('fixture-file-id');
  });
});
