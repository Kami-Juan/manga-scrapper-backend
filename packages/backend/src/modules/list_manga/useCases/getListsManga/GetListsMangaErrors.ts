import { Result } from '../../../../core/logic/Result';
import { UseCaseError } from '../../../../core/logic/UseCaseError';

export namespace GetListsMangaErrors {
  export class EmptyLists extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: 'The user lists are empty',
      } as UseCaseError);
    }
  }
}
