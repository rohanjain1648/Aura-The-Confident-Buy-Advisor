import { NextRequest, NextResponse } from 'next/server';
import { getSessionId } from '@/middleware';
import { addToCart, listCart } from '@/server/repos/cart';

export async function GET(request: NextRequest) {
  try {
    const sessionId = await getSessionId(request);
    const cartItems = await listCart(sessionId);
    return NextResponse.json({ cartItems });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { productId: string };
    const sessionId = await getSessionId(request);

    await addToCart(sessionId, body.productId);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
