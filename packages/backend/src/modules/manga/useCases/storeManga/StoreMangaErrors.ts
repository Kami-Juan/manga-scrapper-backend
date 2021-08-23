import { Result } from '../../../../core/logic/Result';
import { UseCaseError } from '../../../../core/logic/UseCaseError';

export namespace StoreMangaErrors {
  export class MangaNotFound extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: 'The manga doesnt exist',
      } as UseCaseError);
    }
  }

  export class ListNotFound extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: 'The manga list doesnt exist',
      } as UseCaseError);
    }
  }

  export class MangaEmpty extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: 'The manga data is empty',
      } as UseCaseError);
    }
  }

  export class MangaTimeout extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: 'The manga takes a lot of time to load',
      } as UseCaseError);
    }
  }
}
