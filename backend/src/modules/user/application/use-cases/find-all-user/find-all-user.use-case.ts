import {
  PageRequest,
  UserFilter,
} from '@/core/pagination/pagination.interface';
import {
  USER_REPOSITORY,
  type UserRepositoryPort,
} from '@/modules/user/domain/repositories/user-repository.port';
import { Inject, Injectable } from '@nestjs/common';
import { OutputFindUsersUseCaseDto } from './find-all-user.use-case.dto';

@Injectable()
export class FindAllUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}
  async execute(
    request: PageRequest<UserFilter>,
  ): Promise<OutputFindUsersUseCaseDto> {
    if (request.filter) {
      request.filter = Object.fromEntries(
        Object.entries(request.filter).filter(
          ([, value]) => value && value !== 'string',
        ),
      );
    }

    const user = await this.userRepository.find(request);

    return {
      result: user.result,
      pagination: user.pagination,
    };
  }
}
