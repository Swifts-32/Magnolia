import express from 'express';
import { handler } from './build/handler.js';

const app = express();
const PORT = 8080;

app.use(handler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 