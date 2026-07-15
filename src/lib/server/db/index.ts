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

async function testConnection() {
  try {
    // Send a cheap query to check if the database answers
    await pool.query('SELECT 1');
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

testConnection();