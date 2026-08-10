import crypto from 'node:crypto';
import { getServerEnv } from '@/lib/env';

export class AuthTokenManager {
  private token?: string;
  private expiresAt = 0;
  constructor(private fetchImpl: typeof fetch = fetch) {}

  async getToken(): Promise<string> {
    const env = getServerEnv();
    if (env.YOUCAM_MODE === 'fixture') return 'fixture-id-token';

    const now = Date.now();
    // Pre-emptive refresh: refresh if within 60s of expiry
    if (this.token && now < this.expiresAt - 60_000) return this.token;

    // Build RSA-encrypted payload: client_id=<id>&timestamp=<ms>
    const payload = `client_id=${env.YOUCAM_CLIENT_ID}&timestamp=${now}`;
    const encrypted = crypto.publicEncrypt(
      { key: env.YOUCAM_PUBLIC_KEY!, padding: crypto.constants.RSA_PKCS1_PADDING },
      Buffer.from(payload),
    ).toString('base64');

    // POST to YouCam auth endpoint
    const res = await this.fetchImpl(`${env.YOUCAM_BASE_URL}/s2s/v1.0/client/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: env.YOUCAM_CLIENT_ID, id_token: encrypted }),
    });

    if (!res.ok) throw new Error(`YouCam auth failed: ${res.status}`);

    const json = await res.json() as { result: { id_token: string; expires_in?: number } };
    this.token = json.result.id_token;
    this.expiresAt = now + (json.result.expires_in ?? 7200) * 1000;
    return this.token;
  }
}
