import express from "express";
import "dotenv/config"; // Load .env if present (useful for local testing)
import { handler } from "./build/handler.js";
import { Pool } from "pg";

const app = express();
const PORT = 8080;

app.set("trust proxy", true);

async function testDatabase() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("No connection string found");
  }

  const pool = new Pool({ connectionString });
  try {
    await pool.query("SELECT 1");
    console.log("Database connection established successfully!");
  } catch (error) {
    console.error("Database connection failed:", error.message);
  } finally {
    await pool.end();
  }
}

testDatabase();

app.use(handler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
