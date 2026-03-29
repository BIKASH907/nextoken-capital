import { NextResponse } from 'next/server';

const rateLimit = new Map();
const WINDOW = 60 * 1000;
const AUTH_LIMIT = 5;
const API_LIMIT = 30;

function checkRate(ip, path) {
  const isAuth = path.includes('/auth/') || path.includes('/login') || path.includes('/register');
  const limit = isAuth ? AUTH_LIMIT : API_LIMIT;
  const key = ip + ':' + (isAuth ? 'auth' : 'api');
  const now = Date.now();
  const record = rateLimit.get(key) || { count: 0, start: now };
  if (now - record.start > WINDOW) {
    record.count = 1;
    record.start = now;
  } else {
    record.count++;
  }
  rateLimit.set(key, record);
  if (rateLimit.size > 10000) {
    const cutoff = now - WINDOW;
    for (const [k, v] of rateLimit) { if (v.start < cutoff) rateLimit.delete(k); }
  }
  return record.count <= limit;
}

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';

  // Rate limit API routes
  if (pathname.startsWith('/api/')) {
    if (!checkRate(ip, pathname)) {
      return NextResponse.json({ error: 'Too many requests. Try again later.' }, { status: 429 });
    }

    // CSRF check on state-changing methods
    const method = request.method;
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
      const origin = request.headers.get('origin');
      const host = request.headers.get('host');
      if (origin && !origin.includes(host) && !origin.includes('nextokencapital.com') && !origin.includes('vercel.app')) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }
  }

  // Protect admin routes
  if (pathname.startsWith("/api/admin/") && !pathname.includes("seed-super")) {
    const authHeader = request.headers.get('authorization');
    const cookie = request.cookies.get('next-auth.session-token') || request.cookies.get('__Secure-next-auth.session-token');
    if (!authHeader && !cookie) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
