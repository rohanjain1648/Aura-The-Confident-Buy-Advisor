import { YouCamClient } from '@/server/youcam/client';
import { analyzeSkin, analyzeSkinTone } from '@/server/youcam/adapters';
import { normalizePassport, type SkinPassport } from '@/domain/skin/passport';
import { savePassport } from '@/server/repos/passport';

export async function analyzeSkinAndSave(
  sessionId: string,
  imageBytes: Buffer,
  opts: { personBytes?: Buffer; contentType?: string } = {},
): Promise<{ status: string; passport: SkinPassport }> {
  const client = new YouCamClient();
  const contentType = opts.contentType ?? 'image/jpeg';

  // Step 1: Upload image. Skin analysis needs a tight face crop while try-on needs the
  // wider shot, so a separate person photo gets its own file.
  const fileId = await client.uploadImage(imageBytes, contentType);
  const personFileId = opts.personBytes
    ? await client.uploadImage(opts.personBytes, contentType, 'person.jpg')
    : fileId;

  // Step 2: Analyze skin, then tone. Skin analysis has the strictest photo rules, so
  // running it first means a rejected photo doesn't spend units on tone analysis.
  const skinRaw = await analyzeSkin(fileId);
  const toneRaw = await analyzeSkinTone(fileId);

  // Step 3: Normalize into SkinPassport
  const passport = normalizePassport({ skinAnalysis: skinRaw, skinTone: toneRaw });

  // Step 4: Save to session
  await savePassport(sessionId, passport, personFileId);

  return { status: 'complete', passport };
}
