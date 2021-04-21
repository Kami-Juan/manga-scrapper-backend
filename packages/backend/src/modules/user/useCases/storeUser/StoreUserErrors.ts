import { Result } from '../../../../core/logic/Result';
import { UseCaseError } from '../../../../core/logic/UseCaseError';

export namespace StoreUserErrors {
  export class UserAlreadyStored extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: 'The username or email is already taken',
      } as UseCaseError);
    }
  }
}
