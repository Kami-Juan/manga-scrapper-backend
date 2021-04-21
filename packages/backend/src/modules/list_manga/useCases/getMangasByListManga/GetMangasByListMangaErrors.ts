import { Result } from '../../../../core/logic/Result';
import { UseCaseError } from '../../../../core/logic/UseCaseError';

export namespace GetMangasByListMangaErrors {
  export class ListNoFound extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: 'The manga list doesnt exist',
      } as UseCaseError);
    }
  }
}
