import { Either, left, Result, right } from '../../../../core/logic/Result';
import { GenericAppError } from '../../../../core/logic/AppError';
import { GetListsMangaErrors } from './GetListsMangaErrors';
import { UseCase } from '../../../../core/domain/ValueObject';

import { ListMangaRepository } from '../../repository/ListMangaRepository';

import Prisma from '@prisma/client';
import { GetListsMangaDTO } from './GetListsMangaDTO';

export interface GetListsMangaResponse {
  lists: Prisma.List[];
}

type Response = Either<
  GetListsMangaErrors.EmptyLists | Result<any>,
  Result<GetListsMangaResponse>
>;

export class GetListsMangaUseCase
  implements UseCase<GetListsMangaDTO, Promise<Response>> {
  constructor(private listMangaRepository: ListMangaRepository) {}
  async execute(request?: GetListsMangaDTO): Promise<Response> {
    try {
      const listMangas = await this.listMangaRepository.getAllListByUser(
        request.userId,
      );

      return right(
        Result.ok<GetListsMangaResponse>({
          lists: listMangas,
        }),
      ) as Response;
    } catch (error) {
      return left(new GenericAppError.UnexpectedError(error)) as Response;
    }
  }
}
