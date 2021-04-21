import { Either, left, Result, right } from '../../../../core/logic/Result';
import { GenericAppError } from '../../../../core/logic/AppError';
import { LoginErrors } from './LoginErrors';
import { UseCase } from '../../../../core/domain/ValueObject';

import { UserRepository } from '../../repository/UserRepository';
import { LoginDTO } from './LoginDTO';
import { UserPassword } from '../../domain/UserPassword';

import jwt from 'jsonwebtoken';

export interface LoginResponse {
  tokenExpiration: number;
  userId: string;
  token: string;
}

type Response = Either<
  LoginErrors.UserInvalidPassword | LoginErrors.UserNotFound | Result<any>,
  Result<LoginResponse>
>;

export class LoginUseCase implements UseCase<LoginDTO, Promise<Response>> {
  constructor(private userRepository: UserRepository) {}
  async execute(request?: LoginDTO): Promise<Response> {
    const { account, password } = request;

    try {
      const user = await this.userRepository.getUser(account, account);

      if (!!user !== true) {
        return left(new LoginErrors.UserNotFound());
      }

      const passwordOrError = UserPassword.create({
        value: user.password,
        hashed: true,
      }).getValue();

      const correctPassword = await passwordOrError.comparePassword(password);

      if (!correctPassword) {
        return left(new LoginErrors.UserInvalidPassword());
      }

      const token = jwt.sign({ userId: user.id, email: user.email }, '123', {
        expiresIn: '1h',
      });

      return right(
        Result.ok<LoginResponse>({
          token,
          tokenExpiration: 1,
          userId: user.id,
        }),
      ) as Response;
    } catch (error) {
      return left(new GenericAppError.UnexpectedError(error)) as Response;
    }
  }
}
