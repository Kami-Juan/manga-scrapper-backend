import express from 'express';

import { userRouter } from '../../../modules/user/infrastructure/http/routes';
import { migrationRouter } from '../../../modules/migration/infrastructure/http/routes';
import { listMangaRouter } from '../../../modules/list_manga/infrastructure/http/routes';
import { chapterRouter } from '../../../modules/chapters/infrastructure/http/routes';

const v1Router = express.Router();

v1Router.use('/users', userRouter);
v1Router.use('/migration', migrationRouter);
v1Router.use('/list-manga', listMangaRouter);
v1Router.use('/mangas', chapterRouter);

export { v1Router };
