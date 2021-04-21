import { Either, left, Result, right } from '../../../../core/logic/Result';
import { GenericAppError } from '../../../../core/logic/AppError';
import { StoreUserErrors } from './StoreUserErrors';
import { UseCase } from '../../../../core/domain/ValueObject';

import { UserRepository } from '../../repository/UserRepository';
import { User } from '../../domain/User';
import { UserEmail } from '../../domain/UserEmail';
import { UserPassword } from '../../domain/UserPassword';
import { UserUsername } from '../../domain/UserUsername';
import { StoreUserDTO } from './StoreUserDTO';
import { UserRaw } from '../../mappers/UserMap';

type Response = Either<
  StoreUserErrors.UserAlreadyStored | Result<any>,
  Result<UserRaw>
>;

export class StoreUserUseCase
  implements UseCase<StoreUserDTO, Promise<Response>> {
  constructor(private userRepository: UserRepository) {}
  async execute(request?: StoreUserDTO): Promise<Response> {
    const { username, password, email } = request;

    const emailOrError = UserEmail.create({ value: email });
    const usernameOrError = UserUsername.create({ value: username });
    const passwordOrError = UserPassword.create({ value: password });

    const combineResults = Result.combine([
      emailOrError,
      usernameOrError,
      passwordOrError,
    ]);

    if (combineResults.isFailure) {
      return left(Result.fail<void>(combineResults.error)) as Response;
    }

    const userOrError = User.create({
      email: emailOrError.getValue(),
      password: passwordOrError.getValue(),
      username: usernameOrError.getValue(),
    });

    if (userOrError.isFailure) {
      return left(Result.fail<void>(userOrError.error)) as Response;
    }

    const user: User = userOrError.getValue();

    const userAlreadyExists = await this.userRepository.existUser(
      user.username.value,
      user.email.email,
    );

    if (userAlreadyExists) {
      return left(new StoreUserErrors.UserAlreadyStored()) as Response;
    }

    try {
      await this.userRepository.createUser(user);
    } catch (err) {
      return left(new GenericAppError.UnexpectedError(err)) as Response;
    }

    const userPassword = await passwordOrError.getValue().getHashedValue();

    return right(
      Result.ok<UserRaw>({
        email: emailOrError.getValue().email,
        password: userPassword,
        username: usernameOrError.getValue().value,
      }),
    ) as Response;
  }
}
