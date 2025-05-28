import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  try {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req: request, res })

    // Refresh session before Sgetting it to ensure the freshest state
    await supabase.auth.refreshSession()
    
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    console.log('🛡️ Middleware Check:', {
      pathname: request.nextUrl.pathname,
      method: request.method,
      hasSession: !!session,
      sessionUserId: session?.user?.id,
      sessionError: sessionError?.message,
      // Log all cookies for debugging purposes for requests to /admin path
      cookies: request.nextUrl.pathname.startsWith('/admin') ? request.cookies.getAll() : 'Not an admin path',
    })

    // If the user is trying to access any admin page (except login) and has no session, redirect to login.
    if (request.nextUrl.pathname.startsWith('/admin') && request.nextUrl.pathname !== '/admin/login') {
      if (session) { // temppppppppppppppppppppppppp
        console.log(`🛡️ Middleware: No session for ${request.nextUrl.pathname}. Redirecting to /admin/login.`)
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }
    }
    
    // If the user is on the login page AND has a session, AuthProvider should handle the redirect to dashboard.
    // The middleware allows the request to proceed; AuthProvider will then perform client-side navigation if needed.

    console.log(`🛡️ Middleware: Allowing access to ${request.nextUrl.pathname}`)
    return res

  } catch (error) {
    console.error('🔥 Middleware Error:', error) // Log the actual error object
    // Fallback redirect in case of unexpected errors in middleware itself.
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
}

export const config = {
  matcher: ['/admin/:path*'],
} 