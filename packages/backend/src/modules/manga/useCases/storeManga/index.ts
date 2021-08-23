import { StoreMangaUseCase } from './StoreMangaUseCase';
import { StoreMangaController } from './StoreMangaController';
import { chapterRepository } from '../../../chapters/repository';
import { mangaRepository } from '../../../manga/repository';
import { listMangaRepository } from '../../../list_manga/repository';

const storeMangaUseCase = new StoreMangaUseCase(
  chapterRepository,
  mangaRepository,
  listMangaRepository,
);

const storeMangaController = new StoreMangaController(storeMangaUseCase);

export { storeMangaUseCase, storeMangaController };
