import { getServerEnv } from '@/lib/env';
import type { YouCamErrorBody, YouCamFileResponse, YouCamPollResponse, YouCamRunResponse } from './types';

export class YouCamError extends Error {
  constructor(message: string, readonly code?: string, readonly httpStatus?: number) {
    super(message);
    this.name = 'YouCamError';
  }
}

const SHOPPER_MESSAGES: Record<string, string> = {
  error_src_face_too_small: 'Your face looks too small in the photo. Move closer so it fills the oval, then try again.',
  error_src_face_out_of_bound: 'Part of your face is out of frame. Centre it in the oval and try again.',
  error_lighting_dark: 'The photo is too dark. Face a window or a light and try again.',
  error_below_min_image_size: 'The photo resolution is too low. Try a sharper photo.',
  error_exceed_max_image_size: 'The photo is too large. Try a smaller one.',
  exceed_max_filesize: 'The photo is too large (10 MB maximum). Try a smaller one.',
  error_nsfw_content_detected: 'This photo could not be processed. Please use a different one.',
};

/** Message safe to show the shopper. Never includes credentials. */
export function describeYouCamError(err: unknown): string {
  if (err instanceof YouCamError) {
    if (err.httpStatus === 401 || err.code === 'InvalidApiKey' || err.code === 'InvalidAccessToken') {
      return 'YouCam rejected the API key. Check that YOUCAM_API_KEY is set and matches the portal for YOUCAM_BASE_URL.';
    }
    if (err.code && SHOPPER_MESSAGES[err.code]) return SHOPPER_MESSAGES[err.code];
  }
  if (err instanceof Error && err.name.startsWith('PrismaClient')) {
    console.error(err);
    return 'We could not save your results. Please try again.';
  }
  return err instanceof Error ? err.message : String(err);
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class YouCamClient {
  constructor(private fetchImpl: typeof fetch = (input, init) => fetch(input, init)) {}

  private headers() {
    return {
      Authorization: `Bearer ${getServerEnv().YOUCAM_API_KEY}`,
      'Content-Type': 'application/json',
    };
  }

  private url(path: string) {
    return `${getServerEnv().YOUCAM_BASE_URL}/s2s/v2.0${path}`;
  }

  private async fail(res: Response, context: string): Promise<never> {
    const body = (await res.json().catch(() => ({}))) as YouCamErrorBody;
    throw new YouCamError(
      `YouCam ${context} failed: ${res.status} ${body.error ?? ''}`.trim(),
      body.error_code ?? body.error,
      res.status,
    );
  }

  async uploadImage(bytes: Buffer, contentType: string, fileName = 'selfie.jpg'): Promise<string> {
    if (getServerEnv().YOUCAM_MODE === 'fixture') {
      return 'fixture-file-id';
    }
    // 1) Ask for an upload slot  2) PUT the bytes to the signed URL with the headers it came with
    const res = await this.fetchImpl(this.url('/file'), {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({
        files: [{ content_type: contentType, file_name: fileName, file_size: bytes.length }],
      }),
    });
    if (!res.ok) await this.fail(res, 'file request');

    const { data } = (await res.json()) as YouCamFileResponse;
    const file = data.files[0];
    const put = file.requests[0];
    const uploaded = await this.fetchImpl(put.url, {
      method: put.method ?? 'PUT',
      headers: put.headers ?? { 'Content-Type': contentType },
      body: new Uint8Array(bytes),
    });
    if (!uploaded.ok) throw new YouCamError(`YouCam file upload failed: ${uploaded.status}`, undefined, uploaded.status);
    return file.file_id;
  }

  async runTask(feature: string, body: unknown): Promise<string> {
    const res = await this.fetchImpl(this.url(`/task/${feature}`), {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(body),
    });
    if (!res.ok) await this.fail(res, `${feature} request`);
    const { data } = (await res.json()) as YouCamRunResponse;
    return data.task_id;
  }

  async pollTask(
    feature: string,
    taskId: string,
    opts: { timeoutMs?: number; intervalMs?: number } = {},
  ): Promise<unknown> {
    const deadline = Date.now() + (opts.timeoutMs ?? 120_000);
    // The API allows 250 requests per 300s, so stay well under one request per second.
    let delay = opts.intervalMs ?? 2_000;

    while (Date.now() < deadline) {
      const res = await this.fetchImpl(this.url(`/task/${feature}/${encodeURIComponent(taskId)}`), {
        headers: this.headers(),
        cache: 'no-store',
      });

      // Rate limiting and server hiccups are worth waiting out; anything else is final.
      if (res.status !== 429 && res.status < 500) {
        if (!res.ok) await this.fail(res, `${feature} status check`);
        const { data } = (await res.json()) as YouCamPollResponse;
        if (process.env.YOUCAM_DEBUG) console.debug(`[youcam] ${feature}`, JSON.stringify(data));
        if (data.task_status === 'success') return data.results;
        if (data.task_status === 'error') {
          throw new YouCamError(
            `YouCam ${feature} failed: ${data.error_message ?? data.error ?? 'unknown error'}`,
            data.error ?? undefined,
          );
        }
      }

      await sleep(delay);
      delay = Math.min(delay * 1.5, 6_000);
    }

    throw new YouCamError(`YouCam ${feature} timed out`, 'timeout');
  }
}
