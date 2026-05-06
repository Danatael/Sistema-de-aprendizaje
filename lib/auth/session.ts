import { decryptString, encryptString } from "@/lib/auth/crypto"

export const SESSION_COOKIE = "pc_builder_session"

const TWELVE_HOURS_IN_SECONDS = 60 * 60 * 12
const DEFAULT_SECRET = "change-this-session-secret-in-production"

type SessionPayload = {
  sub: string
  exp: number
}

export function getSessionSecret(): string {
  return process.env.AUTH_SESSION_SECRET ?? DEFAULT_SECRET
}

export function getCredentialsConfig() {
  const username = process.env.AUTH_USERNAME ?? "admin"
  const salt = process.env.AUTH_PASSWORD_SALT ?? "change-this-password-salt"
  const fallbackPassword = process.env.AUTH_PASSWORD ?? "admin12345"
  const passwordHash = process.env.AUTH_PASSWORD_HASH

  return { username, salt, fallbackPassword, passwordHash }
}

export async function createSessionToken(username: string): Promise<string> {
  const payload: SessionPayload = {
    sub: username,
    exp: Date.now() + TWELVE_HOURS_IN_SECONDS * 1000,
  }

  return encryptString(JSON.stringify(payload), getSessionSecret())
}

export async function readSessionToken(token?: string): Promise<SessionPayload | null> {
  if (!token) {
    return null
  }

  const decoded = await decryptString(token, getSessionSecret())
  if (!decoded) {
    return null
  }

  try {
    const parsed = JSON.parse(decoded) as SessionPayload
    if (!parsed?.sub || typeof parsed.exp !== "number") {
      return null
    }

    if (Date.now() > parsed.exp) {
      return null
    }

    return parsed
  } catch {
    return null
  }
}

export const sessionCookieOptions = {
  name: SESSION_COOKIE,
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: TWELVE_HOURS_IN_SECONDS,
}
