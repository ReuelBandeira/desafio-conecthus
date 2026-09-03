import {
  PageRequest,
  PageResponse,
  UserFilter,
} from '@/core/pagination/pagination.interface';
import { UserEntity } from '../entities/user.entity';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface UserRepositoryPort {
  create(entity: UserEntity): Promise<UserEntity>;
  update(entity: UserEntity): Promise<UserEntity>;
  delete(id: string): Promise<UserEntity>;
  findById(id: string): Promise<UserEntity | null>;
  findByRegistration(registration: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  find(request: PageRequest<UserFilter>): Promise<PageResponse<UserEntity>>;
}
