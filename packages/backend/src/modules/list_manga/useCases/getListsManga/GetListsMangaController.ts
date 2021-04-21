import { BaseController } from '../../../../core/infraestructure/BaseController';
import { GetListsMangaDTO } from './GetListsMangaDTO';
import { GetListsMangaErrors } from './GetListsMangaErrors';
import { GetListsMangaUseCase } from './GetListsMangaUseCase';
export class GetListsMangaController extends BaseController {
  constructor(private useCase: GetListsMangaUseCase) {
    super();
  }

  async executeImpl(): Promise<any> {
    const user = this.req.user as { userId: string };

    const dto: GetListsMangaDTO = {
      userId: user.userId,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isRight()) {
        return this.ok(this.res, result.value.getValue());
      }

      if (result.isLeft()) {
        const errors = result.value;

        switch (errors.constructor) {
          case GetListsMangaErrors.EmptyLists:
            return this.conflict(errors.errorValue().message);
          default:
            return this.fail(errors.errorValue());
        }
      }
    } catch (error) {
      return this.fail(error);
    }
  }
}
