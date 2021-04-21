import { BaseController } from '../../../../core/infraestructure/BaseController';
import { GetAllUsersUseCase } from './GetAllUsersUseCase';
import { GetAllUsersErrors } from './GetAllUsersErrors';
import { GetAllUsersDTO } from './GetAllUsersDTO';

export class GetAllUsersController extends BaseController {
  constructor(private useCase: GetAllUsersUseCase) {
    super();
  }

  async executeImpl(): Promise<any> {
    const dto: GetAllUsersDTO = (this.req.query as any) as GetAllUsersDTO;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isRight()) {
        return this.ok(this.res, {
          data: result.value.getValue(),
        });
      }

      if (result.isLeft()) {
        const errors = result.value;

        switch (errors.constructor) {
          case GetAllUsersErrors.UsersEmpty:
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
