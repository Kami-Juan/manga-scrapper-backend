import { User } from '../domain/User';

export interface UserRaw {
  id?: string;
  username: string;
  email: string;
  password: string;
}

export class UserMap {
  public static async toPersistence(user: User): Promise<UserRaw> {
    return {
      username: user.username.value,
      email: user.email.email,
      password: await user.password.getHashedValue(),
    };
  }
}
