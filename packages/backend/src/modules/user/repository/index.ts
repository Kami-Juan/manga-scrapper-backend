import prisma from '../../../configuration/prisma';
import { UserRepository } from './UserRepository';

const userRepository = new UserRepository(prisma);

export { userRepository };
