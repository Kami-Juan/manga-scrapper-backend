import express from 'express';
import passport from 'passport';

import { getListsMangaController } from '../../useCases/getListsManga';
import { storeListMangaController } from '../../useCases/storeListManga';
import { getMangasByListMangaController } from '../../useCases/getMangasByListManga';

const listMangaRouter = express.Router();

listMangaRouter.get(
  '/',
  passport.authenticate('cookie', { session: false }),
  (req, res) => getListsMangaController.execute(req, res),
);

listMangaRouter.post(
  '/',
  passport.authenticate('cookie', { session: false }),
  (req, res) => storeListMangaController.execute(req, res),
);

listMangaRouter.get(
  '/:listMangaId/mangas',
  passport.authenticate('cookie', { session: false }),
  (req, res) => getMangasByListMangaController.execute(req, res),
);

export { listMangaRouter };
