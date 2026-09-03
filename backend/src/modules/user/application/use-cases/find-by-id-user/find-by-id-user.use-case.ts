import { UserMessages } from '@/core/utils/user.messages';
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
import { OutputFindByIdUserUseCaseDto } from './find-by-id-user.use-case.dto';

@Injectable()
export class FindByIdUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}
  async execute(id: string): Promise<OutputFindByIdUserUseCaseDto> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new HttpException(
        UserMessages.ID_NOT_FOUND,
        HttpStatus.BAD_REQUEST,
      );
    }

    Logger.log(
      `User found. [ID: ${user.id}][name: ${user.name}]`,
      'FindByIdUserUseCase.execute',
    );

    return user?.toJSON();
  }
}
