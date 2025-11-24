import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export function middleware(req) {
    const sessionKey = req.cookies.get('session_token')?.value
    const { pathname } = req.nextUrl

    // List of routes accessible without authentication
    const publicPaths = ['/', '/login', '/register', '/about', '/contact']

    const isPublicRoute = publicPaths.some(path => pathname === path)

    // 🟢 Case 1: Public route
    if (isPublicRoute) {
        // If logged in and visiting login/register/home → redirect to dashboard
        if (sessionKey && (pathname === '/' || pathname === '/login' || pathname === '/register')) {
            return NextResponse.redirect(new URL('/dashboard', req.url))
        }
        return NextResponse.next()
    }

    // 🔒 Case 2: Protected route (anything not in publicPaths)
    if (!sessionKey) {
        return NextResponse.redirect(new URL('/login', req.url))
    }

    // ✅ Session exists — allow access
    return NextResponse.next()
    }

    // This middleware runs on these paths
    export const config = {
        matcher: [
            '/',
            '/login',
            '/register',
            '/about',
            '/contact',
            '/dashboard/:path*',
            '/profile/:path*',
            '/settings/:path*',
        ],
    }
