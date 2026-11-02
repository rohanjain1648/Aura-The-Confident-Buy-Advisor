/**
 * Live check of the YouCam integration with a real photo. SPENDS API UNITS:
 * skin analysis 12 + skin tone 20, plus the clothes try-on price if a garment is given.
 *
 *   pnpm youcam:smoke path/to/selfie.jpg [garment] [wider-person-photo.jpg]
 *
 * garment is a public image URL or a path inside public/, e.g. /seed/sage-shirt.jpg.
 * Try-on uses the wider photo if given, as the app does; otherwise the selfie.
 * The selfie's face must span over 60% of the image width (a YouCam requirement).
 * Reads YOUCAM_API_KEY and YOUCAM_BASE_URL from .env. Prints raw API responses.
 */
import 'dotenv/config';
import { readFile } from 'node:fs/promises';

process.env.YOUCAM_MODE = 'live';
process.env.YOUCAM_DEBUG = '1';

async function main() {
  const { YouCamClient, describeYouCamError } = await import('../src/server/youcam/client');
  const { analyzeSkin, analyzeSkinTone, tryOnCloth } = await import('../src/server/youcam/adapters');
  const { normalizePassport } = await import('../src/domain/skin/passport');
  const { getServerEnv } = await import('../src/lib/env');

  const [selfie, garment, person] = process.argv.slice(2);
  if (!selfie) throw new Error('Usage: pnpm youcam:smoke path/to/selfie.jpg [garment] [wider-person-photo.jpg]');

  try {
    console.log(`Host: ${getServerEnv().YOUCAM_BASE_URL}`);
    const fileId = await new YouCamClient().uploadImage(await readFile(selfie), 'image/jpeg');
    console.log('1. Upload OK');

    const skinTone = await analyzeSkinTone(fileId);
    console.log('2. Skin tone OK', skinTone);

    const skinAnalysis = await analyzeSkin(fileId);
    console.log('3. Skin analysis OK', skinAnalysis);
    console.log('   Passport:', normalizePassport({ skinAnalysis, skinTone }));

    if (garment) {
      const personId = person
        ? await new YouCamClient().uploadImage(await readFile(person), 'image/jpeg', 'person.jpg')
        : fileId;
      const { imageUrl } = await tryOnCloth(personId, garment);
      console.log('4. Try-on OK', imageUrl);
    }
    console.log('All live calls succeeded.');
  } catch (err) {
    console.error('FAILED:', describeYouCamError(err));
    if (err instanceof Error) console.error(err.message);
    process.exitCode = 1;
  }
}

main();
