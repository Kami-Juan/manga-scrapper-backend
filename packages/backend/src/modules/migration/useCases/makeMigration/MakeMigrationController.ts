import { BaseController } from '../../../../core/infraestructure/BaseController';
import { MakeMigrationUseCase } from './MakeMigrationUseCase';
import { MakeMigrationErrors } from './MakeMigrationErrors';
import { MakeMigrationDTO } from './MakeMigrationDTO';

export class MakeMigrationController extends BaseController {
  constructor(private useCase: MakeMigrationUseCase) {
    super();
  }

  async executeImpl(): Promise<any> {
    const user = this.req.user as { userId: string };

    const dto: MakeMigrationDTO = {
      email: this.req.body.email,
      password: this.req.body.password,
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
          case MakeMigrationErrors.BadCredentials:
            return this.conflict(errors.errorValue().message);
          case MakeMigrationErrors.EmptyLists:
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
