import { GetChapterUseCase } from './GetChapterUseCase';
import { GetChapterController } from './GetChapterController';
import { chapterRepository } from '../../repository';

const getChapterUseCase = new GetChapterUseCase(
  chapterRepository
);

const getChapterController = new GetChapterController(getChapterUseCase);

export { getChapterUseCase, getChapterController };
