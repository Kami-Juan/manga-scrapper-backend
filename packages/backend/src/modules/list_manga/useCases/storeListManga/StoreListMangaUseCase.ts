import { Either, left, Result, right } from '../../../../core/logic/Result';
import { GenericAppError } from '../../../../core/logic/AppError';
import { UseCase } from '../../../../core/domain/ValueObject';

import { ListMangaRepository } from '../../repository/ListMangaRepository';

import Prisma from '@prisma/client';
import { StoreListMangaDTO } from './StoreListMangaDTO';
import { ListManga } from '../../domain/ListManga';
import { StoreListMangaErrors } from './StoreListMangaErrors';

export type StoreListMangaResponse = Prisma.List;

type Response = Either<
  StoreListMangaErrors.ListMangaError | Result<any>,
  Result<StoreListMangaResponse>
>;

export class StoreListMangaUseCase
  implements UseCase<StoreListMangaDTO, Promise<Response>> {
  constructor(private listMangaRepository: ListMangaRepository) {}
  async execute(request?: StoreListMangaDTO): Promise<Response> {
    try {
      const listMangaOrError = ListManga.create({ ...request, url: '', visibilily: true, followers: 0 });

      if (listMangaOrError.isFailure) {
        return left(Result.fail<void>(listMangaOrError.error)) as Response;
      }

      const listStored = await this.listMangaRepository.storeListManga(request.userId, listMangaOrError.getValue());

      return right(
        Result.ok<StoreListMangaResponse>(listStored),
      ) as Response;
    } catch (error) {
      return left(new GenericAppError.UnexpectedError(error)) as Response;
    }
  }
}
