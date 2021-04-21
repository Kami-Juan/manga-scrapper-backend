import { Result } from '../../../../core/logic/Result';
import { UseCaseError } from '../../../../core/logic/UseCaseError';

export namespace LoginErrors {
  export class UserNotFound extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: 'The user is not found',
      } as UseCaseError);
    }
  }
  export class UserInvalidPassword extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: 'The password is invalid',
      } as UseCaseError);
    }
  }
}
