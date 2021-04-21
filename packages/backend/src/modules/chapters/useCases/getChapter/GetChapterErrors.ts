import { Result } from '../../../../core/logic/Result';
import { UseCaseError } from '../../../../core/logic/UseCaseError';

export namespace GetChapterErrors {
  export class ChapterNotFound extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: 'The chapter doesnt exist',
      } as UseCaseError);
    }
  }

  export class ChapterMangaTimeout extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: 'The chapter takes a lot of time to load',
      } as UseCaseError);
    }
  }
}
