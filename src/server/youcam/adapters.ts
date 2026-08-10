import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { getServerEnv } from '@/lib/env';
import { YouCamClient } from './client';
import type { RawSkin, RawTone } from '@/domain/skin/passport';

async function fixture<T>(name: string): Promise<T> {
  const p = path.join(process.cwd(), 'fixtures', 'youcam', `${name}.json`);
  return JSON.parse(await readFile(p, 'utf8')) as T;
}

const client = () => new YouCamClient();

export async function analyzeSkin(fileId: string): Promise<RawSkin> {
  if (getServerEnv().YOUCAM_MODE === 'fixture') {
    return { scores: (await fixture<{ scores: Record<string, number> }>('skin-analysis')).scores };
  }
  const taskId = await client().runTask('skin-analysis', {
    request_id: 0,
    payload: {
      file_sets: { src_ids: [fileId] },
      actions: [{ id: 0, params: {} }],
    },
  });
  const raw = await client().pollTask('skin-analysis', taskId) as { scores?: Record<string, number> };
  return { scores: raw.scores ?? {} };
}

export async function analyzeSkinTone(fileId: string): Promise<RawTone> {
  if (getServerEnv().YOUCAM_MODE === 'fixture') {
    return fixture<RawTone>('skin-tone');
  }
  const taskId = await client().runTask('skin-tone-analysis', {
    request_id: 0,
    payload: {
      file_sets: { src_ids: [fileId] },
      actions: [{ id: 0, params: {} }],
    },
  });
  const raw = await client().pollTask('skin-tone-analysis', taskId) as RawTone;
  return { undertone: raw.undertone, depth: raw.depth, hex: raw.hex };
}

export async function tryOnCloth(personFileId: string, garment: string): Promise<{ imageUrl: string }> {
  if (getServerEnv().YOUCAM_MODE === 'fixture') {
    return fixture<{ imageUrl: string }>('cloth');
  }
  const taskId = await client().runTask('cloth', {
    request_id: 0,
    payload: {
      file_sets: { src_ids: [personFileId] },
      actions: [{ id: 0, params: { ref_url: garment } }],
    },
  });
  const raw = await client().pollTask('cloth', taskId) as { result_url?: string };
  return { imageUrl: raw.result_url ?? '' };
}
