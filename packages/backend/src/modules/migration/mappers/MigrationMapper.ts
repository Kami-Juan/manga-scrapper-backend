import { User } from '../../user/domain/User';

export interface MigrationRaw {
  email: string;
  userId: string;
  password: string;
}

export class MigrationMap {
  public static toPersistence(user: User): MigrationRaw {
    return {
      email: user.email.email,
      password: user.password.rawValue,
      userId: user.userId,
    };
  }
}
