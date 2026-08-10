import { NextRequest, NextResponse } from 'next/server';
import { getSessionId } from '@/middleware';
import { computeVerdictAndVto } from '@/server/orchestrators/verdict';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { productId: string; personFileId?: string };
    const sessionId = await getSessionId(request);

    const result = await computeVerdictAndVto(sessionId, body.productId, body.personFileId);

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
