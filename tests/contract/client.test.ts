import { describe, it, expect, vi, beforeEach } from 'vitest';
import { YouCamClient, YouCamError, describeYouCamError } from '@/server/youcam/client';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });
const asFetch = (m: unknown) => m as typeof fetch;

beforeEach(() => {
  process.env.YOUCAM_MODE = 'live';
  process.env.YOUCAM_API_KEY = 'test-key';
  process.env.YOUCAM_BASE_URL = 'https://api.test';
});

describe('YouCamClient.uploadImage', () => {
  it('requests a slot on /s2s/v2.0/file, then PUTs bytes with the returned headers', async () => {
    const fetchMock = vi.fn(async (url: string, _init?: RequestInit) => {
      if (url === 'https://api.test/s2s/v2.0/file') {
        return json({
          status: 200,
          data: {
            files: [{
              file_id: 'file-1',
              requests: [{ method: 'PUT', url: 'https://s3.test/up', headers: { 'Content-Type': 'image/jpeg', 'Content-Length': '3' } }],
            }],
          },
        });
      }
      return new Response(null, { status: 200 });
    });

    const id = await new YouCamClient(asFetch(fetchMock)).uploadImage(Buffer.from('abc'), 'image/jpeg');
    expect(id).toBe('file-1');

    const [, slotInit] = fetchMock.mock.calls[0];
    expect((slotInit!.headers as Record<string, string>).Authorization).toBe('Bearer test-key');
    expect(JSON.parse(slotInit!.body as string)).toEqual({
      files: [{ content_type: 'image/jpeg', file_name: 'selfie.jpg', file_size: 3 }],
    });

    const [putUrl, putInit] = fetchMock.mock.calls[1];
    expect(putUrl).toBe('https://s3.test/up');
    expect(putInit!.method).toBe('PUT');
    expect((putInit!.headers as Record<string, string>)['Content-Length']).toBe('3');
  });

  it('fails when the PUT to storage fails, rather than returning an unusable file id', async () => {
    const fetchMock = vi.fn(async (url: string) =>
      url.endsWith('/file')
        ? json({ data: { files: [{ file_id: 'f', requests: [{ method: 'PUT', url: 'https://s3.test/up' }] }] } })
        : new Response(null, { status: 403 }),
    );
    await expect(new YouCamClient(asFetch(fetchMock)).uploadImage(Buffer.from('a'), 'image/jpeg')).rejects.toThrow(/upload/i);
  });
});

describe('YouCamClient.runTask', () => {
  it('posts the flat body to /s2s/v2.0/task/<feature> and returns data.task_id', async () => {
    const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) => json({ status: 200, data: { task_id: 't1' } }));
    const id = await new YouCamClient(asFetch(fetchMock)).runTask('skin-tone-analysis', { src_file_id: 'f' });
    expect(id).toBe('t1');
    expect(fetchMock.mock.calls[0][0]).toBe('https://api.test/s2s/v2.0/task/skin-tone-analysis');
    expect(JSON.parse(fetchMock.mock.calls[0][1]!.body as string)).toEqual({ src_file_id: 'f' });
  });

  it('surfaces the API error code', async () => {
    const fetchMock = vi.fn(async () => json({ status: 401, error: 'bad key', error_code: 'InvalidApiKey' }, 401));
    const err = await new YouCamClient(asFetch(fetchMock)).runTask('cloth-v4', {}).catch((e) => e);
    expect(err).toBeInstanceOf(YouCamError);
    expect(err.code).toBe('InvalidApiKey');
    expect(err.httpStatus).toBe(401);
  });
});

describe('YouCamClient.pollTask', () => {
  it('uses the task id as a path parameter and returns data.results on success', async () => {
    const seq = [
      { data: { task_status: 'running' } },
      { data: { task_status: 'success', results: { url: 'https://r.test/x.jpg' } } },
    ];
    let i = 0;
    const fetchMock = vi.fn(async (_url: string) => json(seq[i++]));
    const r = await new YouCamClient(asFetch(fetchMock)).pollTask('cloth-v4', 'task123', { timeoutMs: 2000, intervalMs: 1 });
    expect(r).toEqual({ url: 'https://r.test/x.jpg' });
    expect(fetchMock.mock.calls[0][0]).toBe('https://api.test/s2s/v2.0/task/cloth-v4/task123');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('throws a coded error when the task fails', async () => {
    const fetchMock = vi.fn(async () =>
      json({ data: { task_status: 'error', error: 'error_lighting_dark', error_message: 'too dark' } }),
    );
    const err = (await new YouCamClient(asFetch(fetchMock)).pollTask('skin-analysis', 't', { intervalMs: 1 }).catch((e) => e)) as YouCamError;
    expect(err).toBeInstanceOf(YouCamError);
    expect(err.code).toBe('error_lighting_dark');
  });

  it('keeps polling through rate limiting (429)', async () => {
    const responses = [
      json({ status: 429, error: 'Too many requests' }, 429),
      json({ data: { task_status: 'success', results: { ok: true } } }),
    ];
    let i = 0;
    const fetchMock = vi.fn(async () => responses[i++]);
    const r = await new YouCamClient(asFetch(fetchMock)).pollTask('cloth-v4', 't', { timeoutMs: 2000, intervalMs: 1 });
    expect(r).toEqual({ ok: true });
  });

  it('times out instead of polling forever', async () => {
    const fetchMock = vi.fn(async () => json({ data: { task_status: 'running' } }));
    await expect(
      new YouCamClient(asFetch(fetchMock)).pollTask('cloth-v4', 't', { timeoutMs: 5, intervalMs: 1 }),
    ).rejects.toThrow(/timed out/);
  });
});

describe('describeYouCamError', () => {
  it('turns photo problems into guidance the shopper can act on', () => {
    expect(describeYouCamError(new YouCamError('x', 'error_src_face_too_small'))).toMatch(/closer/i);
    expect(describeYouCamError(new YouCamError('x', 'error_lighting_dark'))).toMatch(/dark/i);
  });

  it('flags a rejected API key without echoing it', () => {
    const msg = describeYouCamError(new YouCamError('x', 'InvalidApiKey', 401));
    expect(msg).toMatch(/YOUCAM_API_KEY/);
    expect(msg).not.toMatch(/test-key/);
  });

  it('falls back to the error message', () => {
    expect(describeYouCamError(new Error('boom'))).toBe('boom');
  });

  it('hides database internals from shoppers', () => {
    const dbError = Object.assign(new Error('Invalid prisma.skinPassport.upsert() at D:\\app\\chunk.js'), {
      name: 'PrismaClientKnownRequestError',
    });
    const msg = describeYouCamError(dbError);
    expect(msg).not.toMatch(/prisma|chunk/i);
    expect(msg).toMatch(/try again/i);
  });
});
