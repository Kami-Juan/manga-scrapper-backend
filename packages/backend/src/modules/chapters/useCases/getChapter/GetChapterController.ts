import { BaseController } from '../../../../core/infraestructure/BaseController';
import { GetChapterDTO } from './GetChapterDTO';
import { GetChapterErrors } from './GetChapterErrors';
import { GetChapterUseCase } from './GetChapterUseCase';
export class GetChapterController extends BaseController {
  constructor(private useCase: GetChapterUseCase) {
    super();
  }

  async executeImpl(): Promise<any> {
    const dto = (this.req.body as any) as GetChapterDTO;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isRight()) {
        return this.ok(this.res, result.value.getValue());
      }

      if (result.isLeft()) {
        const errors = result.value;

        switch (errors.constructor) {
          case GetChapterErrors.ChapterNotFound:
            return this.forbidden(errors.errorValue().message);
          case GetChapterErrors.ChapterMangaTimeout:
              return this.forbidden(errors.errorValue().message);
          default:
            return this.fail(errors.errorValue());
        }
      }
    } catch (error) {
      return this.fail(error);
    }
  }
}
