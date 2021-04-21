import { Either, left, Result, right } from '../../../../core/logic/Result';
import { GenericAppError } from '../../../../core/logic/AppError';
import { MakeMigrationErrors } from './MakeMigrationErrors';
import { UseCase } from '../../../../core/domain/ValueObject';

import { ListMangaRepository } from '../../../list_manga/repository/ListMangaRepository';
import { MigrationRepository } from '../../repository/MigrationRepository';

import { MakeMigrationDTO } from './MakeMigrationDTO';
import { UserUsername } from '../../../user/domain/UserUsername';
import { UserPassword } from '../../../user/domain/UserPassword';
import { User } from '../../../user/domain/User';

import Prisma from '@prisma/client';
import { UserEmail } from '../../../user/domain/UserEmail';

export interface MakeMigrationResponse {
  lists: Prisma.List[];
}

type Response = Either<
  MakeMigrationErrors.BadCredentials | Result<any>,
  Result<MakeMigrationResponse>
>;

export class MakeMigrationUseCase
  implements UseCase<MakeMigrationDTO, Promise<Response>> {
  constructor(
    private migrationRepository: MigrationRepository,
    private listMangaRepository: ListMangaRepository,
  ) {}
  async execute(request?: MakeMigrationDTO): Promise<Response> {
    const { email, password, userId } = request;

    const passwordOrError = UserPassword.create({ value: password });
    const emailOrError = UserEmail.create({ value: email });

    const combineResults = Result.combine([emailOrError, passwordOrError]);

    if (combineResults.isFailure) {
      return left(Result.fail<void>(combineResults.error)) as Response;
    }

    const userOrError = User.create({
      password: passwordOrError.getValue(),
      email: emailOrError.getValue(),
      userId,
    });

    if (userOrError.isFailure) {
      return left(Result.fail<void>(userOrError.error)) as Response;
    }

    const user: User = userOrError.getValue();

    try {
      const listsManga = await this.migrationRepository.getLists(user);

      if (listsManga.length === 0) {
        // Do something
        return left(new MakeMigrationErrors.EmptyLists()) as Response;
      }

      const mangas = await this.migrationRepository.getMangasByList(
        user,
        listsManga,
      );

      const listMangas = await this.listMangaRepository.storeAlllListManga(
        userId,
        mangas,
      );

      return right(
        Result.ok<MakeMigrationResponse>({
          lists: listMangas,
        }),
      ) as Response;
    } catch (error) {
      return left(new GenericAppError.UnexpectedError(error)) as Response;
    }
  }
}
