import { createPool, Pool } from 'mysql2/promise'

const DATABASE_URL = process.env.DATABASE_URL || 'mysql://pc3d:012345678@localhost:3306/ps3d'

let pool: Pool | null = null

export function getPool(): Pool {
  if (!pool) {
    pool = createPool(DATABASE_URL)
  }
  return pool
}

export async function query(sql: string, params?: any[]) {
  const p = getPool()
  const [rows] = await p.query(sql, params)
  return rows
}
