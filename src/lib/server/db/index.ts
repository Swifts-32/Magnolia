import { env } from '$env/dynamic/private';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const connectionString = env.DATABASE_URL;

console.log("DATABASE_URL is", connectionString);

const pool = new Pool({
  connectionString,
});

export const db = drizzle(pool);