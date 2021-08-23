import { BaseController } from '../../../../core/infraestructure/BaseController';
import { StoreMangaDTO } from './StoreMangaDTO';
import { StoreMangaErrors } from './StoreMangaErrors';
import { StoreMangaUseCase } from './StoreMangaUseCase';

export class StoreMangaController extends BaseController {
  constructor(private useCase: StoreMangaUseCase) {
    super();
  }

  async executeImpl(): Promise<any> {
    const dto = (this.req.body as any) as StoreMangaDTO;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isRight()) {
        return this.ok(this.res, result.value.getValue());
      }

      if (result.isLeft()) {
        const errors = result.value;

        switch (errors.constructor) {
          case StoreMangaErrors.MangaNotFound:
            return this.forbidden(errors.errorValue().message);
          case StoreMangaErrors.MangaTimeout:
              return this.forbidden(errors.errorValue().message);
          case StoreMangaErrors.MangaEmpty:
              return this.forbidden(errors.errorValue().message);
          case StoreMangaErrors.ListNotFound:
              return this.notFound(errors.errorValue().message);
          default:
            return this.fail(errors.errorValue());
        }
      }
    } catch (error) {
      return this.fail(error);
    }
  }
}
