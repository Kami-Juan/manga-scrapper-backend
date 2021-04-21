import { Result } from '../../../../core/logic/Result';
import { UseCaseError } from '../../../../core/logic/UseCaseError';

export namespace GetAllUsersErrors {
  export class UsersEmpty extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: 'The list of users is empty',
      } as UseCaseError);
    }
  }
}
