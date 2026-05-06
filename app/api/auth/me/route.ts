import { NextRequest, NextResponse } from "next/server"
import { SESSION_COOKIE, readSessionToken } from "@/lib/auth/session"

export async function GET(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value

  const session = await readSessionToken(token)

  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  return NextResponse.json({ authenticated: true, user: { username: session.sub } })
}
