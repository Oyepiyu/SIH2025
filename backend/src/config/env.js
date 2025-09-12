import dotenv from 'dotenv';
dotenv.config();

const parseList = (val) => (val ? val.split(',').map(v => v.trim()).filter(Boolean) : []);

export const CONFIG = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 4000,
  allowedOrigins: parseList(process.env.ALLOWED_ORIGINS) || ['http://localhost:5173'],
  logLevel: process.env.LOG_LEVEL || 'dev'
};
