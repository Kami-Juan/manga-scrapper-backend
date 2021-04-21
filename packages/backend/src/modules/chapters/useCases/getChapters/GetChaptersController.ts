import { BaseController } from '../../../../core/infraestructure/BaseController';
import { GetChaptersDTO } from './GetChaptersDTO';
import { GetChaptersErrors } from './GetChaptersErrors';
import { GetChaptersUseCase } from './GetChaptersUseCase';
export class GetChaptersController extends BaseController {
  constructor(private useCase: GetChaptersUseCase) {
    super();
  }

  async executeImpl(): Promise<any> {
    const dto = (this.req.params as any) as GetChaptersDTO;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isRight()) {
        return this.ok(this.res, result.value.getValue());
      }

      if (result.isLeft()) {
        const errors = result.value;

        switch (errors.constructor) {
          case GetChaptersErrors.ChaptersNotFound:
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
