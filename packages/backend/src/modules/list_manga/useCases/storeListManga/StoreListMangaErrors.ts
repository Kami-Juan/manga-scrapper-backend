import { Result } from '../../../../core/logic/Result';
import { UseCaseError } from '../../../../core/logic/UseCaseError';

export namespace StoreListMangaErrors {
  export class ListMangaError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: 'The list manga are bad',
      } as UseCaseError);
    }
  }
}
