import { env } from './env.js';

export function getMariaDbConnectionString(): string {
  const url = new URL(env.DATABASE_URL);
  const database = decodeURIComponent(url.pathname.replace(/^\/+/, ''));

  if (!database) {
    throw new Error('DATABASE_URL doit contenir un nom de base de données.');
  }

  if (!url.searchParams.has('connectionLimit')) {
    url.searchParams.set('connectionLimit', String(env.DATABASE_CONNECTION_LIMIT));
  }

  return url.toString();
}
