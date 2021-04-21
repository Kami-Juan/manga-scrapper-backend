import { GetMangasByListMangaUseCase } from './GetMangasByListMangaUseCase';
import { GetMangasByListMangaController } from './GetMangasByListMangaController';
import { listMangaRepository } from '../../repository';

const getMangasByListMangaCase = new GetMangasByListMangaUseCase(listMangaRepository);

const getMangasByListMangaController = new GetMangasByListMangaController(
  getMangasByListMangaCase,
);

export { getMangasByListMangaCase, getMangasByListMangaController };
