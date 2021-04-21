import { Either, left, Result, right } from '../../../../core/logic/Result';
import { GenericAppError } from '../../../../core/logic/AppError';
import { GetChaptersErrors } from './GetChaptersErrors';
import { UseCase } from '../../../../core/domain/ValueObject';

import { ChapterRepository } from '../../repository/ChapterRepository';
import { MangaRepository } from '../../../manga/repository/MangaRepository';

import Prisma from '@prisma/client';
import { GetChaptersDTO } from './GetChaptersDTO';

export interface GetListsMangaResponse {
  chapters: Prisma.Chapter[];
  manga: Prisma.Manga;
}

type Response = Either<
  GetChaptersErrors.ChaptersNotFound | Result<any>,
  Result<GetListsMangaResponse>
>;

export class GetChaptersUseCase
  implements UseCase<GetChaptersDTO, Promise<Response>> {
  constructor(
    private chapterRepository: ChapterRepository,
    private mangaRepository: MangaRepository,
  ) {}
  async execute(request?: GetChaptersDTO): Promise<Response> {
    try {
      const manga = await this.mangaRepository.getManga(request.mangaId);

      if (!manga) {
        return left(new GetChaptersErrors.ChaptersNotFound()) as Response;
      }

      const totalChapters = await this.chapterRepository.getTotalChaptersByManga(
        manga.id,
      );

      if (totalChapters === 0) {
        const chapters = await this.chapterRepository.getMangaChapters(
          manga.url,
        );

        await this.chapterRepository.storeAllChapters(chapters, manga.id);

        const mangaDetails = await this.chapterRepository.getMangaData(
          manga.url,
        );

        const newMangaData = await this.mangaRepository.updateMangaDetails({
          ...mangaDetails,
          id: manga.id,
        });

        return right(
          Result.ok<GetListsMangaResponse>({
            chapters,
            manga: newMangaData,
          }),
        ) as Response;
      }

      const chapters = await this.chapterRepository.getChapterByManga(manga.id);

      return right(
        Result.ok<GetListsMangaResponse>({
          chapters,
          manga,
        }),
      ) as Response;
    } catch (error) {
      return left(new GenericAppError.UnexpectedError(error)) as Response;
    }
  }
}
