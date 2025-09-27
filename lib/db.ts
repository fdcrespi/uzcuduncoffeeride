import { Pool } from 'pg';

let pool: Pool;

if (!process.env.POSTGRES_HOST) {
  throw new Error('Missing POSTGRES_HOST environment variable');
}

if (!process.env.POSTGRES_PORT) {
    throw new Error('Missing POSTGRES_PORT environment variable');
}

if (!process.env.POSTGRES_DATABASE) {
    throw new Error('Missing POSTGRES_DATABASE environment variable');
}

if (process.env.NODE_ENV === 'production') {
  pool = new Pool({
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    database: process.env.POSTGRES_DATABASE,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
  });
} else {
  // In development, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global.hasOwnProperty('db')) {
    (global as any).db = new Pool({
        host: process.env.POSTGRES_HOST,
        port: Number(process.env.POSTGRES_PORT),
        database: process.env.POSTGRES_DATABASE,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
      });
  }
  pool = (global as any).db;
}

export const db = pool;
