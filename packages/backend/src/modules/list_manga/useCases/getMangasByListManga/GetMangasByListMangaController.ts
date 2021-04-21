import { BaseController } from '../../../../core/infraestructure/BaseController';
import { GetMangasByListMangaDTO } from './GetMangasByListMangaDTO';
import { GetMangasByListMangaErrors } from './GetMangasByListMangaErrors';
import { GetMangasByListMangaUseCase } from './GetMangasByListMangaUseCase';
export class GetMangasByListMangaController extends BaseController {
  constructor(private useCase: GetMangasByListMangaUseCase) {
    super();
  }

  async executeImpl(): Promise<any> {
    const dto = (this.req.params as any) as GetMangasByListMangaDTO;;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isRight()) {
        return this.ok(this.res, result.value.getValue());
      }

      if (result.isLeft()) {
        const errors = result.value;

        switch (errors.constructor) {
          case GetMangasByListMangaErrors.ListNoFound:
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
