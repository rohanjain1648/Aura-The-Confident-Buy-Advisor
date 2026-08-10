import { describe, it, expect, vi } from 'vitest';
import { YouCamClient } from '@/server/youcam/client';

// Use the same TEST_PEM from auth.test.ts
const TEST_PEM = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyo4pl/IU5oc+YiFR3gRT
g4c6IfP6MIXsutQixUxZiNJ0qooBTp20rLMyDbJQMSNODuTSJYppJrfFKiZbGofi
+VlfezQf4KBYfdnupUcWZmVHi+55bJvsHDqDvkF7WNAB9ZXD/5zRGCfLYyXLWJqN
k7qNrCHzxOOVsOKk/wLaCG6UwQCsQoXrB+udhu4e2flQA2kmN/B5wSgEQs/kV0N8
Om817BachL+YjqUn7760o9e53hyFnS42IJRLUEQdpMfKT+YjbMjbnJQXf0doVViV
1WwQCTfndGtl7IN9/O1verR1xEgzYaYHddIBnieX5PmZxRk3AZSrx0uQb6D35TL4
gQIDAQAB
-----END PUBLIC KEY-----`;

describe('YouCamClient poll', () => {
  it('polls until success then returns result', async () => {
    process.env.YOUCAM_MODE = 'live';
    process.env.YOUCAM_CLIENT_ID = 'c';
    process.env.YOUCAM_CLIENT_SECRET = 's';
    process.env.YOUCAM_PUBLIC_KEY = TEST_PEM;

    const seq = [
      { status: 'running', polling_interval: 1 },
      { status: 'success', result: { scores: { redness: 50 } } },
    ];
    let i = 0;
    const fetchMock = vi.fn(async (url: string) => {
      if (String(url).includes('/client/auth')) {
        return new Response(JSON.stringify({ result: { id_token: 't', expires_in: 7200 } }), { status: 200 });
      }
      return new Response(JSON.stringify({ result: seq[Math.min(i++, seq.length - 1)] }), { status: 200 });
    });

    const c = new YouCamClient(fetchMock as unknown as typeof fetch);
    const r = await c.pollTask('skin-analysis', 'task123', { timeoutMs: 2000 }) as any;
    expect(r.scores.redness).toBe(50);
    expect(fetchMock.mock.calls.filter(([u]) => String(u).includes('task')).length).toBeGreaterThanOrEqual(2);
  });
});
