import { tryOnCloth } from '@/server/youcam/adapters';
import { getProduct } from '@/server/repos/product';
import { getPassport, getPersonFileId } from '@/server/repos/passport';
import { computeVerdict } from '@/domain/verdict/scorer';
import { findRecentVto, saveVerdict } from '@/server/repos/verdict';
import type { Verdict } from '@/domain/verdict/scorer';
import type { SkinPassport } from '@/domain/skin/passport';
import type { Concern } from '@/lib/concerns';

// YouCam result URLs last 2 hours. Reusing one saves API units on repeat views.
const VTO_REUSE_MS = 110 * 60 * 1000;

type VerdictProduct = { category: string; dominantColor: unknown; shadeMeta: unknown; targetsConcerns: unknown };

export function verdictFor(passport: SkinPassport, product: VerdictProduct): Verdict {
  return computeVerdict(passport, {
    category: product.category as 'apparel' | 'beauty',
    dominantColor: (product.dominantColor ?? undefined) as { hex: string } | undefined,
    shadeMeta: (product.shadeMeta ?? undefined) as { undertone: string; depth: number } | undefined,
    targetsConcerns: (product.targetsConcerns ?? undefined) as Concern[] | undefined,
  });
}

export async function computeVerdictAndVto(
  sessionId: string,
  productId: string,
): Promise<{ verdict: Verdict; vtoImageUrl?: string }> {
  // Fetch product and passport
  const product = await getProduct(productId);
  const passport = await getPassport(sessionId);

  if (!product) throw new Error(`Product ${productId} not found`);
  if (!passport) throw new Error('Take your selfie first: this session has no Skin Passport yet.');

  // Compute verdict
  const verdict = verdictFor(passport, product);

  // Generate VTO for apparel from the photo stored with the passport
  let vtoImageUrl: string | undefined;
  const personFileId = await getPersonFileId(sessionId);
  if (product.category === 'apparel' && product.garmentImageUrl && personFileId) {
    vtoImageUrl = await findRecentVto(sessionId, productId, VTO_REUSE_MS)
      ?? (await tryOnCloth(personFileId, product.garmentImageUrl)).imageUrl;
  }

  // Save verdict
  await saveVerdict(sessionId, productId, verdict, vtoImageUrl);

  return { verdict, vtoImageUrl };
}
