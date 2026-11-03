import { describe, it, expect, vi } from 'vitest';
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

  it('spends no units on skin tone when skin analysis rejects the photo', async () => {
    process.env.YOUCAM_MODE = 'live';
    process.env.YOUCAM_API_KEY = 'k';
    process.env.YOUCAM_BASE_URL = 'https://api.test';
    const json = (body: unknown) => new Response(JSON.stringify(body), { status: 200 });
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      if (url.endsWith('/file')) {
        return json({ data: { files: [{ file_id: 'f', requests: [{ method: 'PUT', url: 'https://s3.test/up' }] }] } });
      }
      if (init?.method === 'PUT') return new Response(null, { status: 200 });
      if (init?.method === 'POST') return json({ data: { task_id: 't' } });
      return json({ data: { task_status: 'error', error: 'error_src_face_too_small' } });
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(analyzeSkinAndSave('test-sess-1', Buffer.from('photo'))).rejects.toMatchObject({
      code: 'error_src_face_too_small',
    });
    expect(fetchMock.mock.calls.some(([url]) => url.includes('skin-tone-analysis'))).toBe(false);

    vi.unstubAllGlobals();
    process.env.YOUCAM_MODE = 'fixture';
  });
});
