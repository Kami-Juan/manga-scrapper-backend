import { Result } from '../../../../core/logic/Result';
import { UseCaseError } from '../../../../core/logic/UseCaseError';

export namespace GetChaptersErrors {
  export class ChaptersNotFound extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: 'The manga doesnt exist',
      } as UseCaseError);
    }
  }
}
