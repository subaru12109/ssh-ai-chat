import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import path from 'node:path'
import process from 'node:process'
import { drizzle as pgDrizzle } from 'drizzle-orm/node-postgres'
import { migrate as pgMigrate } from 'drizzle-orm/node-postgres/migrator'
import { drizzle as pgliteDrizzle } from 'drizzle-orm/pglite'
import { migrate as pgliteMigrate } from 'drizzle-orm/pglite/migrator'
import env from '@/config/env'
import * as schema from './schema'

const db = env.DATABASE_URL
  ? pgDrizzle({
      connection: env.DATABASE_URL,
      schema,
    })
  : pgliteDrizzle({
      connection: path.join(import.meta.dirname, '../../data/pglite'),
      schema,
    })

async function migrateDb() {
  if (env.DATABASE_URL) {
    await pgMigrate(db as NodePgDatabase<typeof schema>, { migrationsFolder: path.join(import.meta.dirname, '../../drizzle') })
  }
  else {
    await pgliteMigrate(db, { migrationsFolder: path.join(import.meta.dirname, '../../drizzle') })
  }
}

migrateDb().catch((error) => {
  console.error(error)
  process.exit(1)
})

export default db
