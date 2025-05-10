'use server';
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    const token = req.cookies.get('sb-odoswlvkvkoyxjofowub-auth-token')?.value;

    const { pathname } = req.nextUrl;
    const isAuthenticated = token;

    if (pathname.startsWith('/admin')) {
        if (!isAuthenticated) {
            return NextResponse.redirect(new URL('/', req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/admin/:path*'],
};
