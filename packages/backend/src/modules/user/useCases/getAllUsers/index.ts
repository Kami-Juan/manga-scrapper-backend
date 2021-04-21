import { GetAllUsersUseCase } from './GetAllUsersUseCase';
import { GetAllUsersController } from './GetAllUsersController';
import { userRepository } from '../../repository';

const getAllUsersUserUseCase = new GetAllUsersUseCase(userRepository);
const getAllUsersController = new GetAllUsersController(getAllUsersUserUseCase);

export { getAllUsersUserUseCase, getAllUsersController };
