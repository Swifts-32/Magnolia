import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pg from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL environment variable is not set.');
  process.exit(1);
}

const pool = new pg.Pool({ connectionString });
const db = drizzle(pool);

async function runMigrations() {
  console.log('Running database migrations...');
  try {
    // Make sure this points to where migrations exist in the container
    await migrate(db, { migrationsFolder: './migrations' });
    console.log('Migrations completed successfully!');
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    await pool.end();
    process.exit(1);
  }
}

runMigrations();