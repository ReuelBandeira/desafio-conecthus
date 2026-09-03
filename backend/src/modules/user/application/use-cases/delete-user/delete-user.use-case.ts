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

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(id: string): Promise<void> {
    const existsUser = await this.userRepository.findById(id);

    if (!existsUser) {
      throw new HttpException(
        UserMessages.ID_NOT_FOUND_FOR_DELETE,
        HttpStatus.BAD_REQUEST,
      );
    }

    const deleteUser = await this.userRepository.delete(id);

    Logger.log(
      `User deleted. [ID: ${deleteUser.id}][name: ${deleteUser.name}]`,
      'DeleteUserUseCase.execute',
    );
  }
}
