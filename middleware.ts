import { NextRequest, NextResponse } from "next/server"
import { SESSION_COOKIE, readSessionToken } from "@/lib/auth/session"

function isAssetPath(pathname: string): boolean {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/icon.svg") ||
    pathname.startsWith("/apple-icon") ||
    pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|css|js|map)$/i) !== null
  )
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  if (isAssetPath(pathname)) {
    return NextResponse.next()
  }

  const isLoginPage = pathname === "/login"
  const isPublicAuthApi = pathname === "/api/auth/login" || pathname === "/api/auth/logout"
  const token = request.cookies.get(SESSION_COOKIE)?.value
  const session = await readSessionToken(token)

  if (isLoginPage && session) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  if (isLoginPage || isPublicAuthApi) {
    return NextResponse.next()
  }

  if (!session) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const loginUrl = new URL("/login", request.url)
    const target = `${pathname}${search}`
    if (target !== "/") {
      loginUrl.searchParams.set("next", target)
    }
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/:path*"],
}
