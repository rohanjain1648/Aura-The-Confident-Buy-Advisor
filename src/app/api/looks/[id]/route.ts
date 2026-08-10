import { NextRequest, NextResponse } from 'next/server';
import { getLook } from '@/server/repos/look';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const look = await getLook(id);
    return NextResponse.json({ look });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
