import { HashService } from '@/core/services/hash.service';
import UserFactory from '@/modules/user/domain/factories/user.factory';
import {
  USER_REPOSITORY,
  type UserRepositoryPort,
} from '@/modules/user/domain/repositories/user-repository.port';

import { UserMessages } from '@/core/utils/user.messages';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import {
  InputCreateUserUseCaseDto,
  OutputCreateUserUseCaseDto,
} from './create-user.use-case.dto';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    private readonly hashService: HashService,
  ) {}

  async execute(
    input: InputCreateUserUseCaseDto,
  ): Promise<OutputCreateUserUseCaseDto> {
    const [existsRegistration, existsEmail] = await Promise.all([
      this.userRepository.findByRegistration(input.registration),
      this.userRepository.findByEmail(input.email),
    ]);

    if (existsRegistration) {
      throw new HttpException(
        UserMessages.REGISTRATION_ALREADY_EXISTS,
        HttpStatus.CONFLICT,
      );
    }

    if (existsEmail) {
      throw new HttpException(
        UserMessages.EMAIL_ALREADY_EXISTS,
        HttpStatus.CONFLICT,
      );
    }
    const user = UserFactory.createUserFactory({
      ...input,
      createdAt: new Date(),
    });
    const hashedPassword = await this.hashService.hash(input.password);
    user.password = hashedPassword;
    const userCreated = await this.userRepository.create(user);

    Logger.log(
      `User created. [ID: ${user.id}][name: ${user.name}]`,
      'CreateUserUseCase.execute',
    );

    return userCreated.toJSON();
  }
}
