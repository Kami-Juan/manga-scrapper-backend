import { BaseController } from '../../../../core/infraestructure/BaseController';
import { LoginUseCase } from './LoginUseCase';
import { LoginErrors } from './LoginErrors';
import { LoginDTO } from './LoginDTO';

export class LoginController extends BaseController {
  constructor(private useCase: LoginUseCase) {
    super();
  }

  async executeImpl(): Promise<any> {
    const dto: LoginDTO = (this.req.body as any) as LoginDTO;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isRight()) {
        this.res.cookie('token', result.value.getValue().token);

        return this.ok(this.res, {
          token: result.value.getValue().token,
          userId: result.value.getValue().userId,
          tokenExpiration: result.value.getValue().tokenExpiration,
        });
      }

      if (result.isLeft()) {
        const errors = result.value;

        switch (errors.constructor) {
          case LoginErrors.UserNotFound:
            return this.conflict(errors.errorValue().message);
          case LoginErrors.UserInvalidPassword:
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
