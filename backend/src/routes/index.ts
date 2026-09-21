import { Router } from 'express';

import { applicationsRouter } from '../modules/applications/application.routes.js';
import { authRouter } from '../modules/auth/auth.routes.js';
import { dealRoomRouter } from '../modules/deal-room/deal-room.routes.js';
import { investorsRouter } from '../modules/investors/investor.routes.js';
import { meetingsRouter } from '../modules/meetings/meeting.routes.js';
import { adminMentorsRouter, mentorsRouter } from '../modules/mentors/mentor.routes.js';
import { roadmapRouter } from '../modules/roadmap/roadmap.routes.js';
import { startupsRouter } from '../modules/startups/startup.routes.js';
import { healthRouter } from './health.routes.js';

export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/applications', applicationsRouter);
apiRouter.use('/deal-room', dealRoomRouter);
apiRouter.use('/investors', investorsRouter);
apiRouter.use('/meetings', meetingsRouter);
apiRouter.use('/startups', startupsRouter);
apiRouter.use('/startups', roadmapRouter);
apiRouter.use('/mentors', mentorsRouter);
apiRouter.use('/admin/mentors', adminMentorsRouter);
