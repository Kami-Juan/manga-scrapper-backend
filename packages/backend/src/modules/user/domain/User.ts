import { ValueObject } from '../../../core/domain/UseCase';
import { Result } from '../../../core/logic/Result';

import { UserEmail } from './UserEmail';
import { UserPassword } from './UserPassword';
import { UserUsername } from './UserUsername';

interface UserProps {
  username?: UserUsername;
  password: UserPassword;
  email?: UserEmail;
  userId?: string;
}

export class User extends ValueObject<UserProps> {
  get username(): UserUsername {
    return this.props.username;
  }

  get password(): UserPassword {
    return this.props.password;
  }

  get userId(): string {
    return this.props.userId;
  }

  get email(): UserEmail {
    return this.props.email;
  }

  private constructor(props: UserProps) {
    super(props);
  }

  public static create(props: UserProps): Result<User> {
    const user = new User({
      ...props,
    });

    return Result.ok<User>(user);
  }
}
