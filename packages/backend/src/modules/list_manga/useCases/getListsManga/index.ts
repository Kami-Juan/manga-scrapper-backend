import { GetListsMangaUseCase } from './GetListsMangaUseCase';
import { GetListsMangaController } from './GetListsMangaController';
import { listMangaRepository } from '../../repository';

const getListsMangaUseCase = new GetListsMangaUseCase(listMangaRepository);

const getListsMangaController = new GetListsMangaController(
  getListsMangaUseCase,
);

export { getListsMangaUseCase, getListsMangaController };
