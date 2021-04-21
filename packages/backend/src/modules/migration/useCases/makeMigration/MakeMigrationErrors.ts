import { Result } from '../../../../core/logic/Result';
import { UseCaseError } from '../../../../core/logic/UseCaseError';

export namespace MakeMigrationErrors {
  export class BadCredentials extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: 'The provided credencials are wrong',
      } as UseCaseError);
    }
  }

  export class EmptyLists extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: 'The user lists are empty',
      } as UseCaseError);
    }
  }
}
