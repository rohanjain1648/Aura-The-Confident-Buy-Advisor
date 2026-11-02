import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { getServerEnv } from '@/lib/env';
import type { Concern } from '@/lib/concerns';
import { YouCamClient, YouCamError } from './client';
import type { GarmentCategory } from './types';
import type { RawSkin, RawTone } from '@/domain/skin/passport';

async function fixture<T>(name: string): Promise<T> {
  const p = path.join(process.cwd(), 'fixtures', 'youcam', `${name}.json`);
  return JSON.parse(await readFile(p, 'utf8')) as T;
}

const client = () => new YouCamClient();

// YouCam SD skin-analysis action -> our concern name.
const CONCERN_BY_ACTION: Record<string, Concern> = {
  redness: 'redness',
  oiliness: 'oiliness',
  age_spot: 'spots',
  texture: 'texture',
  dark_circle_v2: 'darkCircles',
  pore: 'pores',
  wrinkle: 'wrinkles',
  acne: 'acne',
};

/**
 * YouCam scores health ("a higher score indicates healthier ... skin"); a Passport
 * ranks concerns by severity, so invert. raw_score is used because ui_score is
 * deliberately adjusted to read more favourably.
 */
export function parseSkinResults(results: unknown): RawSkin {
  const output = (results as { output?: { type?: string; raw_score?: number }[] } | null)?.output;
  const scores: RawSkin['scores'] = {};
  for (const entry of Array.isArray(output) ? output : []) {
    const concern = entry.type ? CONCERN_BY_ACTION[entry.type] : undefined;
    if (concern && typeof entry.raw_score === 'number') scores[concern] = 100 - entry.raw_score;
  }
  if (Object.keys(scores).length === 0) {
    throw new YouCamError('YouCam skin analysis returned no scores', 'unexpected_response');
  }
  return { scores };
}

export async function analyzeSkin(fileId: string): Promise<RawSkin> {
  if (getServerEnv().YOUCAM_MODE === 'fixture') {
    return { scores: (await fixture<{ scores: Record<string, number> }>('skin-analysis')).scores };
  }
  const c = client();
  const taskId = await c.runTask('skin-analysis', {
    src_file_id: fileId,
    dst_actions: Object.keys(CONCERN_BY_ACTION),
    format: 'json',
  });
  return parseSkinResults(await c.pollTask('skin-analysis', taskId));
}

export async function analyzeSkinTone(fileId: string): Promise<RawTone> {
  if (getServerEnv().YOUCAM_MODE === 'fixture') {
    return fixture<RawTone>('skin-tone');
  }
  const c = client();
  const taskId = await c.runTask('skin-tone-analysis', {
    src_file_id: fileId,
    face_angle_strictness_level: 'medium',
  });
  const raw = (await c.pollTask('skin-tone-analysis', taskId)) as { color?: { skin_color?: string } } | null;
  const hex = raw?.color?.skin_color;
  if (!hex) throw new YouCamError('YouCam skin tone analysis returned no skin color', 'unexpected_response');
  return { hex };
}

const IMAGE_TYPES: Record<string, string> = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png' };

/** Garments ship in public/, which YouCam can't reach from localhost, so upload the file itself. */
async function uploadLocalGarment(c: YouCamClient, garment: string): Promise<string> {
  const bytes = await readFile(path.join(process.cwd(), 'public', garment)).catch(() => {
    throw new YouCamError(`Garment image not found in public/: ${garment}`, 'garment_not_found');
  });
  const ext = path.extname(garment).toLowerCase();
  return c.uploadImage(bytes, IMAGE_TYPES[ext] ?? 'image/jpeg', path.basename(garment));
}

export async function tryOnCloth(
  personFileId: string,
  garment: string,
  category: GarmentCategory = 'auto',
): Promise<{ imageUrl: string }> {
  if (getServerEnv().YOUCAM_MODE === 'fixture') {
    return fixture<{ imageUrl: string }>('cloth');
  }
  const c = client();
  const ref = /^https?:\/\//.test(garment)
    ? { ref_file_url: garment }
    : { ref_file_id: await uploadLocalGarment(c, garment) };
  const taskId = await c.runTask('cloth-v4', {
    src_file_id: personFileId,
    ...ref,
    garment_category: category,
  });
  const raw = (await c.pollTask('cloth-v4', taskId, { timeoutMs: 180_000 })) as { url?: string } | null;
  if (!raw?.url) throw new YouCamError('YouCam try-on returned no image', 'unexpected_response');
  return { imageUrl: raw.url };
}
