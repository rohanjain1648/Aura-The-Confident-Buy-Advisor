import { describe, it, expect, vi, afterEach } from 'vitest';
import { analyzeSkin, analyzeSkinTone, tryOnCloth, parseSkinResults } from '@/server/youcam/adapters';

const json = (body: unknown) => new Response(JSON.stringify(body), { status: 200 });

describe('adapters fixture mode', () => {
  it('analyzeSkin returns 8 concern scores', async () => {
    process.env.YOUCAM_MODE = 'fixture';
    const r = await analyzeSkin('file1');
    expect(r.scores.redness).toBe(72);
  });

  it('analyzeSkinTone returns undertone', async () => {
    expect((await analyzeSkinTone('file1')).undertone).toBe('warm');
  });

  it('tryOnCloth returns an image url', async () => {
    expect((await tryOnCloth('p', 'g')).imageUrl).toMatch(/\.jpg$/);
  });
});

describe('parseSkinResults', () => {
  it('inverts health scores into concern severity (YouCam: higher = healthier)', () => {
    const { scores } = parseSkinResults({
      output: [
        { type: 'redness', raw_score: 90, ui_score: 95, mask_urls: [] },
        { type: 'acne', raw_score: 40, ui_score: 60, mask_urls: [] },
      ],
    });
    expect(scores.redness).toBe(10);
    expect(scores.acne).toBe(60);
  });

  it('maps YouCam action names onto our concern names', () => {
    const { scores } = parseSkinResults({
      output: [
        { type: 'age_spot', raw_score: 80 },
        { type: 'dark_circle_v2', raw_score: 70 },
        { type: 'pore', raw_score: 60 },
        { type: 'wrinkle', raw_score: 50 },
      ],
    });
    expect(scores).toEqual({ spots: 20, darkCircles: 30, pores: 40, wrinkles: 50 });
  });

  it('refuses to invent a passport when no scores came back', () => {
    expect(() => parseSkinResults({ output: [] })).toThrow(/no scores/i);
    expect(() => parseSkinResults('https://example.com/result.zip')).toThrow(/no scores/i);
  });
});

describe('adapters live mode', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    process.env.YOUCAM_MODE = 'fixture';
  });

  function stubApi(results: unknown) {
    process.env.YOUCAM_MODE = 'live';
    process.env.YOUCAM_API_KEY = 'k';
    process.env.YOUCAM_BASE_URL = 'https://api.test';
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      if (init?.method === 'POST' && url.includes('/task/')) return json({ data: { task_id: 't1' } });
      if (init?.method === 'POST' && url.endsWith('/file')) {
        return json({ data: { files: [{ file_id: 'garment-file', requests: [{ method: 'PUT', url: 'https://s3.test/up' }] }] } });
      }
      if (init?.method === 'PUT') return new Response(null, { status: 200 });
      return json({ data: { task_status: 'success', results } });
    });
    vi.stubGlobal('fetch', fetchMock);
    return fetchMock;
  }

  const bodyOf = (m: ReturnType<typeof stubApi>, urlPart: string) =>
    JSON.parse(m.mock.calls.find(([u, i]) => u.includes(urlPart) && i?.method === 'POST')![1]!.body as string);

  it('analyzeSkin requests our 8 SD concerns as JSON from skin-analysis', async () => {
    const fetchMock = stubApi({ output: [{ type: 'redness', raw_score: 90 }] });
    const r = await analyzeSkin('selfie');
    expect(r.scores.redness).toBe(10);
    const body = bodyOf(fetchMock, '/task/skin-analysis');
    expect(body.src_file_id).toBe('selfie');
    expect(body.format).toBe('json');
    expect([...body.dst_actions].sort()).toEqual(
      ['acne', 'age_spot', 'dark_circle_v2', 'oiliness', 'pore', 'redness', 'texture', 'wrinkle'],
    );
  });

  it('analyzeSkinTone reads the skin colour from results.color', async () => {
    stubApi({ color: { skin_color: '#C9A98B' } });
    expect(await analyzeSkinTone('selfie')).toEqual({ hex: '#C9A98B' });
  });

  it('analyzeSkinTone fails loudly when no skin colour comes back', async () => {
    stubApi({ color: {} });
    await expect(analyzeSkinTone('selfie')).rejects.toThrow(/skin colou?r/i);
  });

  it('tryOnCloth calls cloth-v4 with a garment URL and returns results.url', async () => {
    const fetchMock = stubApi({ url: 'https://r.test/tryon.jpg' });
    const r = await tryOnCloth('person', 'https://cdn.test/coat.jpg');
    expect(r.imageUrl).toBe('https://r.test/tryon.jpg');
    expect(bodyOf(fetchMock, '/task/cloth-v4')).toEqual({
      src_file_id: 'person',
      ref_file_url: 'https://cdn.test/coat.jpg',
      garment_category: 'auto',
    });
  });

  it('tryOnCloth explains a missing local garment image instead of sending a bad path', async () => {
    stubApi({ url: 'x' });
    await expect(tryOnCloth('person', '/seed/does-not-exist.jpg')).rejects.toThrow(/garment image/i);
  });
});
