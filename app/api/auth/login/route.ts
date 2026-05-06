import { NextResponse } from "next/server"
import { z } from "zod"
import { createPasswordHash, verifyPassword } from "@/lib/auth/crypto"
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
  const storedHash =
    config.passwordHash ?? (await createPasswordHash(config.fallbackPassword, config.salt))

  const usernameValid = username === config.username
  const passwordValid = await verifyPassword(password, storedHash)

  if (!usernameValid || !passwordValid) {
    return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 })
  }

  const token = await createSessionToken(username)
  const response = NextResponse.json({ ok: true, user: { username } })
  response.cookies.set({ ...sessionCookieOptions, value: token })
  return response
}
