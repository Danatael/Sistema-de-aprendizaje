import { NextResponse } from "next/server"
import { z } from "zod"
import { createPasswordHash, verifyPassword } from "@/lib/auth/crypto"
import { query } from "@/lib/db"
import {
  createSessionToken,
  getCredentialsConfig,
  sessionCookieOptions,
} from "@/lib/auth/session"

const loginSchema = z.object({
  username: z.string().trim().min(1),
  password: z.string().min(1),
})

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = loginSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos de login invalidos" }, { status: 400 })
  }

  const { username, password } = parsed.data
  const config = getCredentialsConfig()
  // First, check for a user in the database
  try {
    const rows: any = await query('SELECT id, username, password_hash FROM users WHERE username = ? LIMIT 1', [username])
    if (Array.isArray(rows) && rows.length > 0) {
      const user = rows[0]
      const passwordValid = await verifyPassword(password, user.password_hash)
      if (!passwordValid) {
        return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 })
      }

      const token = await createSessionToken(username)
      const response = NextResponse.json({ ok: true, user: { username } })
      response.cookies.set({ ...sessionCookieOptions, value: token })
      return response
    }
  } catch (err) {
    // fallthrough to credentials config fallback
    console.error('DB error during login check:', err)
  }

  // Fallback to environment-based credentials (admin)
  const storedHash = config.passwordHash ?? (await createPasswordHash(config.fallbackPassword, config.salt))
  const usernameValid = username === config.username
  const passwordValid = await verifyPassword(password, storedHash)

  if (!usernameValid || !passwordValid) {
    // If credentials do not match admin, create a new user automatically
    // Auto-registration: create user record using configured salt
    const passwordHash = await createPasswordHash(password, config.salt)
    try {
      await query('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username, passwordHash])
      const token = await createSessionToken(username)
      const response = NextResponse.json({ ok: true, user: { username } })
      response.cookies.set({ ...sessionCookieOptions, value: token })
      return response
    } catch (err) {
      return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 })
    }
  }

  const token = await createSessionToken(username)
  const response = NextResponse.json({ ok: true, user: { username } })
  response.cookies.set({ ...sessionCookieOptions, value: token })
  return response
}
