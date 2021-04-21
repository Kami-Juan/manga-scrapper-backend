import { Either, left, Result, right } from '../../../../core/logic/Result';
import { GenericAppError } from '../../../../core/logic/AppError';
import { GetAllUsersErrors } from './GetAllUsersErrors';
import { UseCase } from '../../../../core/domain/ValueObject';

import { UserRepository } from '../../repository/UserRepository';
import { GetAllUsersDTO } from './GetAllUsersDTO';
import { UserRaw } from '../../mappers/UserMap';

type Response = Either<
    GetAllUsersErrors.UsersEmpty | Result<any>,
    Result<UserRaw[]>
>;

export class GetAllUsersUseCase
    implements UseCase<GetAllUsersDTO, Promise<Response>> {
    constructor(private userRepository: UserRepository) {}
    async execute(request?: GetAllUsersDTO): Promise<Response> {
        try {
            const users = await this.userRepository.getAllUsers();

            if (users.length === 0) {
                return left(new GetAllUsersErrors.UsersEmpty()) as Response;
            }

            return right(Result.ok<UserRaw[]>(users)) as Response;
        } catch (err) {
            return left(new GenericAppError.UnexpectedError(err)) as Response;
        }
    }
}
