import ValidatorInterface from '@/core/domain/validator/validator.interface';
import { UserEntity } from '@/modules/user/domain/entities/user.entity';
import { UserJoiValidator } from '../validators/user.validator';

export class UserValidatorFactory {
  static create(): ValidatorInterface<UserEntity> {
    return new UserJoiValidator();
  }
}
