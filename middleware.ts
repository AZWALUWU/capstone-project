import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  try {
    const supabase = createMiddlewareClient({ req, res })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Allow access to the admin setup page without admin check
    if (req.nextUrl.pathname === "/admin/setup") {
      return res
    }

    // If user is not logged in and trying to access protected routes
    if (!session && (req.nextUrl.pathname.startsWith("/admin") || req.nextUrl.pathname.startsWith("/dashboard"))) {
      const redirectUrl = new URL("/login", req.url)
      redirectUrl.searchParams.set("redirectedFrom", req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // If user is logged in but trying to access admin routes
    if (session && req.nextUrl.pathname.startsWith("/admin")) {
      try {
        // Check if user is admin
        const { data: profile } = await supabase
          .from("profiles")
          .select("preferences")
          .eq("id", session.user.id)
          .single()

        if (!profile?.preferences?.is_admin) {
          return NextResponse.redirect(new URL("/", req.url))
        }
      } catch (error) {
        // If there's an error checking admin status, redirect to home
        console.error("Error checking admin status:", error)
        return NextResponse.redirect(new URL("/", req.url))
      }
    }

    return res
  } catch (error) {
    console.error("Middleware error:", error)

    // If there's an error with Supabase, still allow navigation but log the error
    return res
  }
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
}

