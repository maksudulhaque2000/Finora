import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { authSecret } from '@/lib/auth-secret';

export async function GET(request: Request) {
  if (process.env.DEBUG_AUTH !== 'true') {
    return NextResponse.json({ error: 'Debug endpoint disabled' }, { status: 403 });
  }

  try {
    const token = await getToken({ req: request as unknown as Request, secret: authSecret });
    // Collect cookie keys to help debugging
    const cookieHeader = request.headers.get('cookie') ?? '';
    const cookies = cookieHeader.split(';').map((c) => c.trim()).filter(Boolean);

    return NextResponse.json({ token: token ?? null, cookies });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
