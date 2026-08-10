import { describe, it, expect, vi } from 'vitest';
import { AuthTokenManager } from '@/server/youcam/auth';

// Test RSA public key (2048-bit), generated with:
// node -e "console.log(require('crypto').generateKeyPairSync('rsa',{modulusLength:2048,publicKeyEncoding:{type:'spki',format:'pem'},privateKeyEncoding:{type:'pkcs8',format:'pem'}}).publicKey)"
const TEST_PEM = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyo4pl/IU5oc+YiFR3gRT
g4c6IfP6MIXsutQixUxZiNJ0qooBTp20rLMyDbJQMSNODuTSJYppJrfFKiZbGofi
+VlfezQf4KBYfdnupUcWZmVHi+55bJvsHDqDvkF7WNAB9ZXD/5zRGCfLYyXLWJqN
k7qNrCHzxOOVsOKk/wLaCG6UwQCsQoXrB+udhu4e2flQA2kmN/B5wSgEQs/kV0N8
Om817BachL+YjqUn7760o9e53hyFnS42IJRLUEQdpMfKT+YjbMjbnJQXf0doVViV
1WwQCTfndGtl7IN9/O1verR1xEgzYaYHddIBnieX5PmZxRk3AZSrx0uQb6D35TL4
gQIDAQAB
-----END PUBLIC KEY-----`;

describe('AuthTokenManager fixture mode', () => {
  it('returns a token without network in fixture mode', async () => {
    process.env.YOUCAM_MODE = 'fixture';
    const m = new AuthTokenManager();
    expect(await m.getToken()).toBe('fixture-id-token');
  });
});

describe('AuthTokenManager live caching', () => {
  it('fetches once then serves cached token', async () => {
    process.env.YOUCAM_MODE = 'live';
    process.env.YOUCAM_CLIENT_ID = 'cid';
    process.env.YOUCAM_CLIENT_SECRET = 'sec';
    process.env.YOUCAM_PUBLIC_KEY = TEST_PEM;
    const fetchMock = vi.fn(async () =>
      new Response(JSON.stringify({ result: { id_token: 'JWT1', expires_in: 7200 } }), { status: 200 })
    );
    const m = new AuthTokenManager(fetchMock as unknown as typeof fetch);
    expect(await m.getToken()).toBe('JWT1');
    expect(await m.getToken()).toBe('JWT1');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
