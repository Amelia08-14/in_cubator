import { Router } from 'express';

import { prisma } from '../lib/prisma.js';

export const healthRouter = Router();

healthRouter.get('/', (_request, response) => {
  response.status(200).json({
    data: {
      status: 'ok',
      service: 'in-cubator-api',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
    },
  });
});

healthRouter.get('/ready', async (_request, response) => {
  await prisma.$queryRaw`SELECT 1`;
  response.status(200).json({
    data: {
      status: 'ready',
      service: 'in-cubator-api',
      timestamp: new Date().toISOString(),
    },
  });
});
