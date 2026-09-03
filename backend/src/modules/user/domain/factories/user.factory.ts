import {
  UserEntity,
  UserProps,
} from '@/modules/user/domain/entities/user.entity';

export default class UserFactory {
  public static createUserFactory(props: UserProps): UserEntity {
    return new UserEntity(props);
  }
}
