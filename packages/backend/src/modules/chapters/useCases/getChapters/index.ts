import { GetChaptersUseCase } from './GetChaptersUseCase';
import { GetChaptersController } from './GetChaptersController';
import { chapterRepository } from '../../repository';
import { mangaRepository } from '../../../manga/repository';

const getChaptersUseCase = new GetChaptersUseCase(
  chapterRepository,
  mangaRepository,
);

const getChaptersController = new GetChaptersController(getChaptersUseCase);

export { getChaptersUseCase, getChaptersController };
