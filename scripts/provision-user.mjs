import { pbkdf2Sync, randomBytes } from "node:crypto"
import mysql from "mysql2/promise"

function base64Url(buffer) {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "")
}

function createPasswordHash(password, salt) {
  const derived = pbkdf2Sync(password, Buffer.from(salt, "utf8"), 120000, 32, "sha256")
  return `${salt}.${base64Url(derived)}`
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL || "mysql://pc3d:012345678@localhost:3306/ps3d"
  const email = (process.env.NEW_USER_EMAIL || "alumno@pc3d.local").trim().toLowerCase()
  const password = process.env.NEW_USER_PASSWORD || "Pc3d2026!Acceso"

  if (!email.includes("@")) {
    throw new Error("NEW_USER_EMAIL debe tener formato de correo")
  }

  if (password.length < 8) {
    throw new Error("NEW_USER_PASSWORD debe tener al menos 8 caracteres")
  }

  const url = new URL(databaseUrl)
  const dbName = (url.pathname || "/ps3d").replace(/^\//, "") || "ps3d"

  const connection = await mysql.createConnection(databaseUrl)

  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        username VARCHAR(100) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY uq_users_username (username)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)

    const salt = randomBytes(16).toString("hex")
    const passwordHash = createPasswordHash(password, salt)

    await connection.query(
      "INSERT INTO users (username, password_hash) VALUES (?, ?) ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)",
      [email, passwordHash]
    )

    console.log("Usuario aprovisionado correctamente")
    console.log(`Base de datos: ${dbName}`)
    console.log(`Correo: ${email}`)
    console.log(`Contrasena: ${password}`)
  } finally {
    await connection.end()
  }
}

main().catch((error) => {
  console.error("No se pudo aprovisionar el usuario:", error.message)
  process.exitCode = 1
})
