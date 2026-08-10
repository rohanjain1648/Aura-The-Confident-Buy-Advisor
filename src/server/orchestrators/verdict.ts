import { tryOnCloth } from '@/server/youcam/adapters';
import { getProduct } from '@/server/repos/product';
import { getPassport } from '@/server/repos/passport';
import { computeVerdict } from '@/domain/verdict/scorer';
import { saveVerdict } from '@/server/repos/verdict';
import type { Verdict } from '@/domain/verdict/scorer';

export async function computeVerdictAndVto(
  sessionId: string,
  productId: string,
  personFileId?: string
): Promise<{ verdict: Verdict; vtoImageUrl?: string }> {
  // Fetch product and passport
  const product = await getProduct(productId);
  const passport = await getPassport(sessionId);

  if (!product) throw new Error(`Product ${productId} not found`);
  if (!passport) throw new Error(`Passport for session ${sessionId} not found`);

  // Compute verdict
  const verdict = computeVerdict(passport, {
    category: product.category as 'apparel' | 'beauty',
    dominantColor: product.dominantColor as { hex: string } | undefined,
    shadeMeta: product.shadeMeta as { undertone: string; depth: number } | undefined,
    targetsConcerns: product.targetsConcerns as import('@/lib/concerns').Concern[] | undefined,
  });

  // Generate VTO for apparel if personFileId provided
  let vtoImageUrl: string | undefined;
  if (product.category === 'apparel' && personFileId) {
    const vtoResult = await tryOnCloth(personFileId, product.garmentImageUrl || 'default-garment');
    vtoImageUrl = vtoResult.imageUrl;
  }

  // Save verdict
  await saveVerdict(sessionId, productId, verdict, vtoImageUrl);

  return { verdict, vtoImageUrl };
}
