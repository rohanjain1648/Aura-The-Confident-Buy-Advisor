import { getServerEnv } from '@/lib/env';
import { AuthTokenManager } from './auth';

export class YouCamClient {
  private auth: AuthTokenManager;

  constructor(private fetchImpl: typeof fetch = fetch) {
    this.auth = new AuthTokenManager(fetchImpl);
  }

  private async headers() {
    return {
      Authorization: `Bearer ${await this.auth.getToken()}`,
      'Content-Type': 'application/json',
    };
  }

  private base() {
    return getServerEnv().YOUCAM_BASE_URL;
  }

  async uploadImage(bytes: Buffer, contentType: string): Promise<string> {
    if (getServerEnv().YOUCAM_MODE === 'fixture') {
      return 'fixture-file-id';
    }
    // 1) Request an upload URL via POST /s2s/v1.0/file/image
    // 2) PUT the bytes to the signed URL
    // 3) Return the file_id
    const res = await this.fetchImpl(`${this.base()}/s2s/v1.0/file/image`, {
      method: 'POST',
      headers: await this.headers(),
      body: JSON.stringify({
        files: [{ content_type: contentType, file_name: 'selfie.jpg' }],
      }),
    });
    const { result } = await res.json() as { result: { files: { file_id: string; requests: { url: string; method: string; headers?: Record<string, string> }[] }[] } };
    const file = result.files[0];
    const put = file.requests[0];
    await this.fetchImpl(put.url, {
      method: put.method ?? 'PUT',
      headers: put.headers ?? { 'Content-Type': contentType },
      body: new Uint8Array(bytes),
    });
    return file.file_id;
  }

  async runTask(feature: string, body: unknown): Promise<string> {
    const res = await this.fetchImpl(`${this.base()}/s2s/v1.0/task/${feature}`, {
      method: 'POST',
      headers: await this.headers(),
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`runTask ${feature} failed: ${res.status}`);
    const { result } = await res.json() as { result: { task_id: string } };
    return result.task_id;
  }

  async pollTask(feature: string, taskId: string, opts: { timeoutMs?: number } = {}): Promise<unknown> {
    const deadline = Date.now() + (opts.timeoutMs ?? 60_000);
    let delay = 800; // Start with 800ms, exponential backoff

    while (Date.now() < deadline) {
      const res = await this.fetchImpl(
        `${this.base()}/s2s/v1.0/task/${feature}?task_id=${taskId}`,
        { headers: await this.headers() }
      );
      const { result } = await res.json() as {
        result: {
          status: string;
          polling_interval?: number;
          result?: unknown;
          error?: string;
        };
      };

      if (result.status === 'success') return result.result;
      if (result.status === 'error') throw new Error(`task ${feature} error: ${result.error ?? 'unknown'}`);

      // Use server's polling_interval if provided, else exponential backoff (max 4s)
      const wait = (result.polling_interval ?? 0) * 1000 || Math.min(delay, 4000);
      await new Promise((r) => setTimeout(r, wait));
      delay *= 1.5;
    }

    throw new Error(`task ${feature} timed out`);
  }
}
