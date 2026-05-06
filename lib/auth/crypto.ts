const encoder = new TextEncoder()
const decoder = new TextDecoder()

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = ""
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
}

function base64UrlToBytes(value: string): Uint8Array {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/")
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4)
  const binary = atob(padded)
  const output = new Uint8Array(binary.length)

  for (let i = 0; i < binary.length; i += 1) {
    output[i] = binary.charCodeAt(i)
  }

  return output
}

async function sha256(input: string): Promise<ArrayBuffer> {
  return crypto.subtle.digest("SHA-256", encoder.encode(input))
}

async function createAesKey(secret: string): Promise<CryptoKey> {
  const keyMaterial = await sha256(secret)
  return crypto.subtle.importKey("raw", keyMaterial, { name: "AES-GCM" }, false, ["encrypt", "decrypt"])
}

export async function encryptString(input: string, secret: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await createAesKey(secret)
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoder.encode(input)
  )

  const encryptedBytes = new Uint8Array(encrypted)
  return `${bytesToBase64Url(iv)}.${bytesToBase64Url(encryptedBytes)}`
}

export async function decryptString(token: string, secret: string): Promise<string | null> {
  const parts = token.split(".")
  if (parts.length !== 2) {
    return null
  }

  try {
    const [ivPart, dataPart] = parts
    const iv = base64UrlToBytes(ivPart)
    const encryptedBytes = base64UrlToBytes(dataPart)
    const key = await createAesKey(secret)

    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      encryptedBytes
    )

    return decoder.decode(decrypted)
  } catch {
    return null
  }
}

export async function createPasswordHash(password: string, salt: string): Promise<string> {
  const passwordKey = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"])
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: encoder.encode(salt),
      iterations: 120_000,
    },
    passwordKey,
    256
  )

  return `${salt}.${bytesToBase64Url(new Uint8Array(derivedBits))}`
}

function timingSafeEqual(left: string, right: string): boolean {
  const maxLength = Math.max(left.length, right.length)
  let mismatch = left.length === right.length ? 0 : 1

  for (let i = 0; i < maxLength; i += 1) {
    const leftCode = i < left.length ? left.charCodeAt(i) : 0
    const rightCode = i < right.length ? right.charCodeAt(i) : 0
    mismatch |= leftCode ^ rightCode
  }

  return mismatch === 0
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const separatorIndex = storedHash.indexOf(".")
  if (separatorIndex === -1) {
    return false
  }

  const salt = storedHash.slice(0, separatorIndex)
  const expectedHash = await createPasswordHash(password, salt)
  return timingSafeEqual(expectedHash, storedHash)
}
