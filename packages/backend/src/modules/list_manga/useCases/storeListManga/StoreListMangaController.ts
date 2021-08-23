import { BaseController } from '../../../../core/infraestructure/BaseController';
import { StoreListMangaUseCase } from './StoreListMangaUseCase';
import { StoreListMangaDTO } from './StoreListMangaDTO';
import { StoreListMangaErrors } from './StoreListMangaErrors';

export class StoreListMangaController extends BaseController {
  constructor(private useCase: StoreListMangaUseCase) {
    super();
  }

  async executeImpl(): Promise<any> {
    const user = this.req.user as { userId: string };

    const dto = (this.req.body as any) as StoreListMangaDTO;

    try {
      const result = await this.useCase.execute({
        ...dto,
        userId: user.userId
      });

      if (result.isRight()) {
        return this.ok(this.res, result.value.getValue());
      }

      if (result.isLeft()) {
        const errors = result.value;

        switch (errors.constructor) {
          case StoreListMangaErrors.ListMangaError:
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
