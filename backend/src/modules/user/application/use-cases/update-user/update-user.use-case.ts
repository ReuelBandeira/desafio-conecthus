import { HashService } from '@/core/services/hash.service';
import { UserMessages } from '@/core/utils/user.messages';
import UserFactory from '@/modules/user/domain/factories/user.factory';
import {
  USER_REPOSITORY,
  type UserRepositoryPort,
} from '@/modules/user/domain/repositories/user-repository.port';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import {
  InputUpdateUserUseCaseDto,
  OutputUpdateUserUseCaseDto,
} from './update-user.use-case.dto';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    private readonly hashService: HashService,
  ) {}
  async execute(
    input: InputUpdateUserUseCaseDto,
  ): Promise<OutputUpdateUserUseCaseDto> {
    const existingUser = await this.userRepository.findById(input.id);

    if (!existingUser) {
      throw new HttpException(
        UserMessages.ID_NOT_FOUND,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!existingUser.isActive) {
      throw new HttpException(
        UserMessages.USER_NOT_ACTIVE,
        HttpStatus.CONFLICT,
      );
    }

    if (input && input.registration !== existingUser.registration) {
      const existeRegistration = await this.userRepository.findByRegistration(
        input.registration,
      );
      if (existeRegistration) {
        throw new HttpException(
          UserMessages.REGISTRATION_ALREADY_EXISTS_FOR_UPDATE,
          HttpStatus.CONFLICT,
        );
      }
    }

    if (input && input.email !== existingUser.email) {
      const getEmail = await this.userRepository.findByEmail(input.email);
      if (getEmail) {
        throw new HttpException(
          UserMessages.EMAIL_ALREADY_EXISTS_FOR_UPDATE,
          HttpStatus.CONFLICT,
        );
      }
    }

    let passwordToSave = existingUser.password;

    if (input.password && input.password.trim() !== '') {
      passwordToSave = await this.hashService.hash(input.password);
    }

    const user = UserFactory.createUserFactory({
      id: existingUser.id,
      name: input.name ?? existingUser.name,
      email: input.email ?? existingUser.email,
      registration: input.registration ?? existingUser.registration,
      password: passwordToSave,
      isActive: existingUser.isActive,
      createdAt: existingUser.createdAt,
      updatedAt: new Date(),
      deletedAt: existingUser.deletedAt,
    });
    const userUpdated = await this.userRepository.update(user);

    Logger.log(
      `User updated. [ID: ${user.id}][name: ${user.name}]`,
      'UpdateUserUseCase.execute',
    );

    return userUpdated.toJSON();
  }
}
