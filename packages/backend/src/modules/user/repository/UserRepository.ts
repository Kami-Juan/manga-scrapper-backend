import { User } from '../domain/User';
import { PrismaClient } from '@prisma/client';
import { UserMap, UserRaw } from '../mappers/UserMap';

interface IUserRepository {
  existUser(username: string, email: string): Promise<boolean>;
  createUser(user: User): Promise<UserRaw>;
}

export class UserRepository implements IUserRepository {
  constructor(private ctx: PrismaClient) {}

  async existUser(username: string, email: string): Promise<boolean> {
    const user = await this.getUser(username, email);

    return !!user === true;
  }

  async getUser(username: string, email: string): Promise<UserRaw> {
    return this.ctx.user.findFirst({
      where: {
        OR: [
          {
            email,
          },
          {
            username,
          },
        ],
      },
    });
  }

  async createUser(user: User): Promise<UserRaw> {
    const userRaw = await UserMap.toPersistence(user);

    return this.ctx.user.create({
      data: {
        email: userRaw.email,
        password: userRaw.password,
        username: userRaw.username,
      },
    });
  }

  async getAllUsers(): Promise<UserRaw[]> {
    return this.ctx.user.findMany();
  }
}
