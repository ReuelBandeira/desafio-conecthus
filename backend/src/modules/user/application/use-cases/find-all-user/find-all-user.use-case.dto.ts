import { PageRequest } from '@/core/pagination/pagination.interface';
import { UserProps } from '../../../domain/entities/user.entity';

export interface OutputFindUsersUseCaseDto {
  result: UserProps[];
  pagination: PageRequest;
}
