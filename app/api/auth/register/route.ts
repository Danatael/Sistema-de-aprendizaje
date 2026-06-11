import { NextResponse } from "next/server"
import { z } from "zod"
import { createPasswordHash } from "@/lib/auth/crypto"
import { query } from "@/lib/db"
import { createSessionToken, sessionCookieOptions } from "@/lib/auth/session"

const registerSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8),
})

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = registerSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos de registro invalidos" }, { status: 400 })
  }

  const { email, password } = parsed.data
  const username = email.toLowerCase()

  try {
    const existing: any = await query('SELECT id FROM users WHERE username = ? LIMIT 1', [username])
    if (Array.isArray(existing) && existing.length > 0) {
      return NextResponse.json({ error: "El correo ya existe" }, { status: 409 })
    }

    const passwordHash = await createPasswordHash(password, username)
    await query('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username, passwordHash])

    const token = await createSessionToken(username)
    const response = NextResponse.json({ ok: true, user: { username } })
    response.cookies.set({ ...sessionCookieOptions, value: token })
    return response
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json({ error: "No se pudo registrar el usuario" }, { status: 500 })
  }
}
