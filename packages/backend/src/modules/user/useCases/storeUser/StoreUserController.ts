import { BaseController } from '../../../../core/infraestructure/BaseController';
import { StoreUserUseCase } from './StoreUserUseCase';
import { StoreUserErrors } from './StoreUserErrors';
import { StoreUserDTO } from './StoreUserDTO';

export class StoreUserController extends BaseController {
  constructor(private useCase: StoreUserUseCase) {
    super();
  }

  async executeImpl(): Promise<any> {
    const dto: StoreUserDTO = (this.req.body as any) as StoreUserDTO;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isRight()) {
        return this.ok(this.res, result.value.getValue());
      }

      if (result.isLeft()) {
        const errors = result.value;

        switch (errors.constructor) {
          case StoreUserErrors.UserAlreadyStored:
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
