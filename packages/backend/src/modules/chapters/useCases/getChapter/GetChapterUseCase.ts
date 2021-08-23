import { Either, left, Result, right } from '../../../../core/logic/Result';
import { GenericAppError } from '../../../../core/logic/AppError';
import { GetChapterErrors } from './GetChapterErrors';
import { UseCase } from '../../../../core/domain/ValueObject';

import { ChapterRepository } from '../../repository/ChapterRepository';
import { GetChapterDTO } from './GetChapterDTO';

import axios, { AxiosError } from 'axios';

export interface GetListsMangaResponse {
  images: string[];
}

type Response = Either<
  | GetChapterErrors.ChapterMangaTimeout
  | GetChapterErrors.ChapterNotFound
  | Result<any>,
  Result<GetListsMangaResponse>
>;

export class GetChapterUseCase
  implements UseCase<GetChapterDTO, Promise<Response>> {
  constructor(private chapterRepository: ChapterRepository) {}
  async execute(request?: GetChapterDTO): Promise<Response> {
    try {
      const images = await this.chapterRepository.getChapterKissManga(request.url);

      return right(
        Result.ok<GetListsMangaResponse>({
          images,
        }),
      ) as Response;
    } catch (error: any | AxiosError) {
      if (axios.isAxiosError(error)) {
        if (error.response.status === 503) {
          return left(new GetChapterErrors.ChapterMangaTimeout()) as Response;
        }
      }
      return left(new GenericAppError.UnexpectedError(error)) as Response;
    }
  }
}
