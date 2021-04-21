import { Either, left, Result, right } from '../../../../core/logic/Result';
import { GenericAppError } from '../../../../core/logic/AppError';
import { GetMangasByListMangaErrors } from './GetMangasByListMangaErrors';
import { UseCase } from '../../../../core/domain/ValueObject';

import { ListMangaRepository } from '../../repository/ListMangaRepository';

import Prisma from '@prisma/client';
import { GetMangasByListMangaDTO } from './GetMangasByListMangaDTO';

export interface GetMangasByListMangaResponse {
  mangas: Prisma.Manga[];
}

type Response = Either<
  GetMangasByListMangaErrors.ListNoFound | Result<any>,
  Result<GetMangasByListMangaResponse>
>;

export class GetMangasByListMangaUseCase
  implements UseCase<GetMangasByListMangaDTO, Promise<Response>> {
  constructor(private listMangaRepository: ListMangaRepository) {}
  async execute(request?: GetMangasByListMangaDTO): Promise<Response> {
    try {
      const list = await this.listMangaRepository.getListById(request.listMangaId);

      if (!list) {
        return left(new GetMangasByListMangaErrors.ListNoFound());
      }

      const mangas = await this.listMangaRepository.getMangasByListId(
        request.listMangaId,
      );

      return right(
        Result.ok<GetMangasByListMangaResponse>({
          mangas,
        }),
      ) as Response;
    } catch (error) {
      return left(new GenericAppError.UnexpectedError(error)) as Response;
    }
  }
}
