import { listMangaRepository } from '../../repository';
import { StoreListMangaController } from './StoreListMangaController';
import { StoreListMangaUseCase } from './StoreListMangaUseCase';

const storeListMangaUseCase = new StoreListMangaUseCase(listMangaRepository);
const storeListMangaController = new StoreListMangaController(
  storeListMangaUseCase,
);

export { storeListMangaUseCase, storeListMangaController };
