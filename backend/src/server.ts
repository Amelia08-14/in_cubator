import { createServer } from 'node:http';

import { app } from './app.js';
import { env } from './config/env.js';
import { prisma } from './lib/prisma.js';

const server = createServer(app);
let isShuttingDown = false;

server.listen(env.PORT, env.HOST, () => {
  console.info(`IN-CUBATOR API listening on http://${env.HOST}:${env.PORT}${env.API_PREFIX}`);
});

async function shutdown(signal: string, exitCode: number): Promise<void> {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.info(`${signal} reçu, arrêt gracieux en cours.`);

  const forceExit = setTimeout(() => {
    console.error('Arrêt gracieux expiré.');
    process.exit(1);
  }, 10_000);
  forceExit.unref();

  server.close(async (closeError) => {
    if (closeError) {
      console.error(closeError);
      exitCode = 1;
    }

    try {
      await prisma.$disconnect();
    } catch (disconnectError) {
      console.error(disconnectError);
      exitCode = 1;
    } finally {
      clearTimeout(forceExit);
      process.exit(exitCode);
    }
  });
}

process.once('SIGINT', () => void shutdown('SIGINT', 0));
process.once('SIGTERM', () => void shutdown('SIGTERM', 0));

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
  void shutdown('unhandledRejection', 1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  void shutdown('uncaughtException', 1);
});
