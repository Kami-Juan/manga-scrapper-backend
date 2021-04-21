import express from 'express';
import passport from 'passport';

import { getChaptersController } from '../../useCases/getChapters';
import { getChapterController } from '../../useCases/getChapter';

const chapterRouter = express.Router();

chapterRouter.get(
  '/:mangaId/chapters',
  passport.authenticate('cookie', { session: false }),
  (req, res) => getChaptersController.execute(req, res),
);

chapterRouter.post(
  '/',
  passport.authenticate('cookie', { session: false }),
  (req, res) => getChapterController.execute(req, res),
);

export { chapterRouter };
