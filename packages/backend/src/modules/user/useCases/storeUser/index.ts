import { StoreUserUseCase } from './StoreUserUseCase';
import { StoreUserController } from './StoreUserController';
import { userRepository } from '../../repository';

const getStoreUserUseCase = new StoreUserUseCase(userRepository);
const getStoreUserController = new StoreUserController(getStoreUserUseCase);

export { getStoreUserUseCase, getStoreUserController };
