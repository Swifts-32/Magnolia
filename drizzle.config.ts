import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './src/lib/server/db/migrations',
  schema: './src/lib/server/db/schema/*',
  dialect: 'postgresql',

  schemaFilter: ['public', 'app'],

  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgres://postgres:password@127.0.0.1:5433/postgres',
  },
  verbose: true,
  strict: true,
});

