import { PrismaMariaDb } from '@prisma/adapter-mariadb';

import { env } from '../config/env.js';
import { getMariaDbConnectionString } from '../config/database.js';
import { PrismaClient } from '../generated/prisma/client.js';

const globalForPrisma = globalThis as unknown as {
  inCubatorPrisma?: PrismaClient;
};

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaMariaDb(getMariaDbConnectionString());

  return new PrismaClient({
    adapter,
    errorFormat: env.NODE_ENV === 'development' ? 'pretty' : 'minimal',
    log: env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });
}

export const prisma = globalForPrisma.inCubatorPrisma ?? createPrismaClient();

if (env.NODE_ENV !== 'production') {
  globalForPrisma.inCubatorPrisma = prisma;
}
