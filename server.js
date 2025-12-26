import express from 'express';
import 'dotenv/config'; // Load .env if present (useful for local testing)
import { handler } from './build/handler.js';

const app = express();
const PORT = 8080;

console.log('Database URL configured:', process.env.DATABASE_URL ? 'YES' : 'NO');

app.use(handler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 