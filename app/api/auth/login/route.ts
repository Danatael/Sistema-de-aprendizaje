import { NextResponse } from "next/server"
import { z } from "zod"
import { createPasswordHash, verifyPassword } from "@/lib/auth/crypto"
import { query } from "@/lib/db"
import {
  createSessionToken,
  getCredentialsConfig,
  sessionCookieOptions,
} from "@/lib/auth/session"

const loginSchema = z
  .object({
    username: z.string().trim().min(1).optional(),
    email: z.string().trim().email().optional(),
    password: z.string().min(1),
  })
  .refine((data) => Boolean(data.username || data.email), {
    message: "Debe enviar username o email",
    path: ["username"],
  })

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = loginSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos de login invalidos" }, { status: 400 })
  }

  const { password } = parsed.data
  const identifier = (parsed.data.email ?? parsed.data.username ?? "").trim().toLowerCase()
  const config = getCredentialsConfig()
  // First, check for a user in the database
  try {
    const rows: any = await query('SELECT id, username, password_hash FROM users WHERE username = ? LIMIT 1', [identifier])
    if (Array.isArray(rows) && rows.length > 0) {
      const user = rows[0]
      const passwordValid = await verifyPassword(password, user.password_hash)
      if (!passwordValid) {
        return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 })
      }

      const token = await createSessionToken(identifier)
      const response = NextResponse.json({ ok: true, user: { username: identifier } })
      response.cookies.set({ ...sessionCookieOptions, value: token })
      return response
    }
  } catch (err) {
    // fallthrough to credentials config fallback
    console.error('DB error during login check:', err)
  }

  // Fallback to environment-based credentials (admin)
  const storedHash = config.passwordHash ?? (await createPasswordHash(config.fallbackPassword, config.salt))
  const usernameValid = identifier === config.username
  const passwordValid = await verifyPassword(password, storedHash)

  if (!usernameValid || !passwordValid) {
    return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 })
  }

  const token = await createSessionToken(identifier)
  const response = NextResponse.json({ ok: true, user: { username: identifier } })
  response.cookies.set({ ...sessionCookieOptions, value: token })
  return response
}
