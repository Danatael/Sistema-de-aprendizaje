import bcrypt from 'bcrypt';

// ------------------------------
// Funciones de cifrado AES (para sesiones) - SE MANTIENEN
// ------------------------------
const encoder = new TextEncoder();
const decoder = new TextDecoder();

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBytes(value: string): Uint8Array {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  const output = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    output[i] = binary.charCodeAt(i);
  }
  return output;
}

async function sha256(input: string): Promise<ArrayBuffer> {
  return crypto.subtle.digest("SHA-256", encoder.encode(input));
}

async function createAesKey(secret: string): Promise<CryptoKey> {
  const keyMaterial = await sha256(secret);
  return crypto.subtle.importKey("raw", keyMaterial, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
}

export async function encryptString(input: string, secret: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await createAesKey(secret);
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoder.encode(input));
  const encryptedBytes = new Uint8Array(encrypted);
  return `${bytesToBase64Url(iv)}.${bytesToBase64Url(encryptedBytes)}`;
}

export async function decryptString(token: string, secret: string): Promise<string | null> {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  try {
    const [ivPart, dataPart] = parts;
    const iv = base64UrlToBytes(ivPart);
    const encryptedBytes = base64UrlToBytes(dataPart);
    const key = await createAesKey(secret);
    const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, encryptedBytes);
    return decoder.decode(decrypted);
  } catch {
    return null;
  }
}

// ------------------------------
// NUEVAS FUNCIONES DE HASH CON BCRYPT (estándar)
// ------------------------------
const SALT_ROUNDS = 10;

/**
 * Genera un hash seguro de una contraseña usando bcrypt.
 * @param password Contraseña en texto plano
 * @returns Hash en formato bcrypt (ej: $2b$10$...)
 */
export async function createPasswordHash(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verifica si una contraseña coincide con su hash bcrypt.
 * @param password Contraseña en texto plano
 * @param hash Hash almacenado (debe empezar con $2b$)
 * @returns true si coincide, false en caso contrario
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}