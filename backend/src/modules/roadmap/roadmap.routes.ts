import { Router } from 'express';

import { requireAuth, requireRoles } from '../../middleware/auth.js';
import {
  createObjectiveHandler,
  createObjectiveTaskHandler,
  createTaskHandler,
  deleteObjectiveHandler,
  deleteTaskHandler,
  getRoadmapHandler,
  patchObjectiveHandler,
  patchTaskHandler,
} from './roadmap.controller.js';

export const roadmapRouter = Router();

roadmapRouter.use(requireAuth, requireRoles('PORTEUR_STARTUP', 'ADMIN', 'GESTIONNAIRE'));
roadmapRouter.use((_request, response, next) => {
  response.setHeader('Cache-Control', 'no-store');
  next();
});

roadmapRouter.get('/:startupId/roadmap', getRoadmapHandler);
roadmapRouter.post('/:startupId/roadmap/objectives', createObjectiveHandler);
roadmapRouter.patch('/:startupId/roadmap/objectives/:objectiveId', patchObjectiveHandler);
roadmapRouter.delete('/:startupId/roadmap/objectives/:objectiveId', deleteObjectiveHandler);
roadmapRouter.post('/:startupId/roadmap/tasks', createTaskHandler);
roadmapRouter.post(
  '/:startupId/roadmap/objectives/:objectiveId/tasks',
  createObjectiveTaskHandler,
);
roadmapRouter.patch('/:startupId/roadmap/tasks/:taskId', patchTaskHandler);
roadmapRouter.delete('/:startupId/roadmap/tasks/:taskId', deleteTaskHandler);
