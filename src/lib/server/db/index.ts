import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { DATABASE_URL } from '$app/env/private';

const connectionString = DATABASE_URL;

console.log("APP DATABASE_URL:", connectionString);

const pool = new Pool({
  connectionString,
});

export const db = drizzle({
  client: pool
});
