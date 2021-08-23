import express from 'express';
import passport from 'passport';

import { storeMangaController } from '../../useCases/storeManga';

const mangaRouter = express.Router();

mangaRouter.post(
  '/',
  passport.authenticate('cookie', { session: false }),
  (req, res) => storeMangaController.execute(req, res),
);

export { mangaRouter };
