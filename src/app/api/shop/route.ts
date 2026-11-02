import { NextRequest, NextResponse } from 'next/server';
import { getSessionId } from '@/middleware';
import { listProducts } from '@/server/repos/product';
import { getPassport } from '@/server/repos/passport';
import { computeVerdict } from '@/domain/verdict/scorer';
import type { Concern } from '@/lib/concerns';
import type { SkinPassport } from '@/domain/skin/passport';

// Used when a session has not completed onboarding yet, so the shop can still
// render verdicts (product cards require a verdict) instead of crashing.
const DEFAULT_PASSPORT: SkinPassport = {
  undertone: 'neutral',
  toneDepth: 5,
  concerns: {
    redness: 0,
    oiliness: 0,
    spots: 0,
    texture: 0,
    darkCircles: 0,
    pores: 0,
    wrinkles: 0,
    acne: 0,
  },
  topConcern: 'redness',
};

export async function GET(request: NextRequest) {
  try {
    const sessionId = await getSessionId(request);
    const passport = (await getPassport(sessionId)) ?? DEFAULT_PASSPORT;

    // Get all products and compute verdicts
    const allProducts = await listProducts();
    const withVerdicts = allProducts.map((p) => ({
      ...p,
      verdict: computeVerdict(passport, {
        category: p.category as 'apparel' | 'beauty',
        dominantColor: p.dominantColor as { hex: string } | undefined,
        shadeMeta: p.shadeMeta as { undertone: string; depth: number } | undefined,
        targetsConcerns: p.targetsConcerns as Concern[] | undefined,
      }),
    }));

    // Sort by tier: buy (70+) → maybe (45-69) → skip (<45), best score first within each
    const tierOrder = { buy: 0, maybe: 1, skip: 2 };
    withVerdicts.sort((a, b) =>
      tierOrder[a.verdict.tier] - tierOrder[b.verdict.tier] || b.verdict.score - a.verdict.score);

    return NextResponse.json({ products: withVerdicts });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
