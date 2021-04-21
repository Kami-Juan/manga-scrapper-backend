import { LoginUseCase } from './LoginUseCase';
import { LoginController } from './LoginController';
import { userRepository } from '../../repository';

const getLoginUseCase = new LoginUseCase(userRepository);
const getLoginController = new LoginController(getLoginUseCase);

export { getLoginUseCase, getLoginController };
