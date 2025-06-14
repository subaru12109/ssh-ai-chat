import { defineConfig } from 'drizzle-kit'
import env from './src/config/env'

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  ...(env.DATABASE_URL ? {} : { driver: 'pglite' }),
  dbCredentials: {
    url: env.DATABASE_URL || './data/pglite',
  },
})
