import { YouCamClient } from '@/server/youcam/client';
import { analyzeSkin, analyzeSkinTone } from '@/server/youcam/adapters';
import { normalizePassport } from '@/domain/skin/passport';
import { savePassport } from '@/server/repos/passport';

export async function analyzeSkinAndSave(sessionId: string, imageBytes: Buffer): Promise<{ status: string }> {
  const client = new YouCamClient();

  // Step 1: Upload image
  const fileId = await client.uploadImage(imageBytes, 'image/jpeg');

  // Step 2: Analyze skin and tone in parallel
  const [skinRaw, toneRaw] = await Promise.all([
    analyzeSkin(fileId),
    analyzeSkinTone(fileId),
  ]);

  // Step 3: Normalize into SkinPassport
  const passport = normalizePassport({ skinAnalysis: skinRaw, skinTone: toneRaw });

  // Step 4: Save to session
  await savePassport(sessionId, passport);

  return { status: 'complete' };
}
