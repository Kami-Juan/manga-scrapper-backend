import { Either, left, Result, right } from '../../../../core/logic/Result';
import { GenericAppError } from '../../../../core/logic/AppError';
import { StoreMangaErrors } from './StoreMangaErrors';
import { UseCase } from '../../../../core/domain/ValueObject';
import Prisma from '@prisma/client';

import { ChapterRepository } from '../../../chapters/repository/ChapterRepository';
import { ListMangaRepository } from '../../../list_manga/repository/ListMangaRepository';
import { MangaRepository } from '../../repository/MangaRepository';
import { StoreMangaDTO } from './StoreMangaDTO';

type Response = Either<
  | StoreMangaErrors.MangaNotFound
  | StoreMangaErrors.MangaTimeout
  | StoreMangaErrors.MangaEmpty
  | StoreMangaErrors.ListNotFound
  | Result<any>,
  Result<Prisma.Manga>
>;

export class StoreMangaUseCase
  implements UseCase<StoreMangaDTO, Promise<Response>> {
  constructor(private chapterRepository: ChapterRepository, private mangaRepository: MangaRepository, private listMangaRepository: ListMangaRepository) {}

  async execute(request?: StoreMangaDTO): Promise<Response> {
    try {
      const manga = await this.chapterRepository.getMangaData(request.url);

      if (!manga) {
        return left(new StoreMangaErrors.MangaEmpty()) as Response;
      }

      const listManga = await this.listMangaRepository.getListById(request.idList);

      if (!listManga) {
        return left(new StoreMangaErrors.ListNotFound()) as Response;
      }

      const storedManga = await this.mangaRepository.storeManga(manga, listManga);

      return right(
        Result.ok<Prisma.Manga>(storedManga),
      ) as Response;
    } catch (error) {
      return left(new GenericAppError.UnexpectedError(error)) as Response;
    }
  }
}
