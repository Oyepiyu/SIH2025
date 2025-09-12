import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import apiRouter from './routes/index.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandlers.js';
import { CONFIG } from './config/env.js';

const app = express();

app.use(cors({ origin: (origin, cb) => {
  if (!origin || CONFIG.allowedOrigins.includes(origin)) return cb(null, true);
  return cb(new Error('Not allowed by CORS'));
}}));
app.use(express.json({ limit: '1mb' }));
app.use(morgan(CONFIG.logLevel));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: Date.now() });
});

app.use('/api', apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(CONFIG.port, () => {
  console.log(`API server listening on port ${CONFIG.port}`);
});
