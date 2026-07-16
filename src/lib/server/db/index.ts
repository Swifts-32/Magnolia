import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { env } from '$env/dynamic/private';

const connectionString = env.DATABASE_URL;

console.log("APP DATABASE_URL:", connectionString);

const pool = new Pool({
  connectionString,
});

export const db = drizzle({
  client: pool
});