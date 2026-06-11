import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyPassword, createPasswordHash } from "@/lib/auth/crypto";
import { query } from "@/lib/db";
import { createSessionToken, getCredentialsConfig, sessionCookieOptions } from "@/lib/auth/session";

const loginSchema = z.object({
  username: z.string().trim().min(1),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    console.log("Login failed: payload invalid");
    return NextResponse.json({ error: "Datos de login inválidos" }, { status: 400 });
  }

  const { username, password } = parsed.data;
  const config = getCredentialsConfig();
  console.log(`Login attempt for user: ${username}`);

  try {
    // Buscar en la base de datos
    const rows: any = await query("SELECT id, username, password_hash FROM users WHERE username = ? LIMIT 1", [username]);
    if (Array.isArray(rows) && rows.length > 0) {
      const user = rows[0];
      // Verificar con bcrypt
      const passwordValid = await verifyPassword(password, user.password_hash);
      if (passwordValid) {
        console.log(`Login successful for user ${username} using database credentials`);
        const token = await createSessionToken(username);
        const response = NextResponse.json({ ok: true, user: { username } });
        response.cookies.set({ ...sessionCookieOptions, value: token });
        return response;
      } else {
        console.log(`Login failed for user ${username}: incorrect password`);
        return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 });
      }
    }
    console.log(`Login user not found in database: ${username}`);
  } catch (err) {
    console.error("DB error during login check:", err);
  }

  // Fallback a credenciales de configuración (admin)
  // Nota: ahora createPasswordHash recibe solo un argumento
  let storedHash = config.passwordHash;
  if (!storedHash) {
    storedHash = await createPasswordHash(config.fallbackPassword);
  }
  const usernameValid = username === config.username;
  const passwordValid = await verifyPassword(password, storedHash);

  if (usernameValid && passwordValid) {
    console.log(`Login successful for admin user ${username} using credentials config`);
    const token = await createSessionToken(username);
    const response = NextResponse.json({ ok: true, user: { username } });
    response.cookies.set({ ...sessionCookieOptions, value: token });
    return response;
  }

  console.log(`Login failed for user ${username}: no matching credentials`);
  return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 });
}