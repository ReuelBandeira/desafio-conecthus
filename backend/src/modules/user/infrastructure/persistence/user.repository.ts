import {
  PageRequest,
  PageResponse,
  UserFilter,
} from '@/core/pagination/pagination.interface';

import { USER_SORTABLE_FIELDS } from '@/modules/user/domain/value-objects/sortable-fields.vo';
import {
  UserEntity,
  UserProps,
} from '@/modules/user/domain/entities/user.entity';
import { UserRepositoryPort } from '@/modules/user/domain/repositories/user-repository.port';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserOrmEntity } from './user.orm-entity';

@Injectable()
export class UserRepository implements UserRepositoryPort {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repository: Repository<UserOrmEntity>,
  ) {}

  async create(entity: UserEntity): Promise<UserEntity> {
    const persistedUser = await this.repository.save({
      id: entity.id,
      name: entity.name,
      registration: entity.registration,
      email: entity.email,
      password: entity.password,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    });

    return this.toDomain(persistedUser);
  }

  async update(entity: UserEntity): Promise<UserEntity> {
    await this.repository.update(entity.id, {
      name: entity.name,
      registration: entity.registration,
      email: entity.email,
      password: entity.password,
      isActive: entity.isActive,
      updatedAt: entity.updatedAt,
    });

    const updatedUser = await this.repository.findOneByOrFail({
      id: entity.id,
    });
    return this.toDomain(updatedUser);
  }

  async delete(id: string): Promise<UserEntity> {
    const user = await this.repository.findOneByOrFail({ id });
    await this.repository.softDelete(id);
    return this.toDomain(user);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.repository.findOneBy({ id });
    if (!user) return null;
    return this.toDomain(user);
  }

  async findByRegistration(registration: string): Promise<UserEntity | null> {
    // registration/email keep a DB-level UNIQUE constraint even after a
    // soft delete (the row still physically occupies the index), so these
    // uniqueness lookups must include soft-deleted rows — otherwise a
    // duplicate insert would pass the app check and then crash on the DB
    // constraint instead of returning a clean 409.
    const user = await this.repository.findOne({
      where: { registration },
      withDeleted: true,
    });
    if (!user) return null;
    return this.toDomain(user);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.repository.findOne({
      where: { email },
      withDeleted: true,
    });
    if (!user) return null;
    return this.toDomain(user);
  }

  async find(
    query: PageRequest<UserFilter>,
  ): Promise<PageResponse<UserEntity>> {
    const { filter = {}, order = 'desc' } = query;

    // Defensive whitelist: even though the DTO already validates this, the
    // use-case is also callable outside HTTP, so the repository can't trust
    // orderBy is safe to interpolate into SQL without checking again here.
    const orderBy = (USER_SORTABLE_FIELDS as readonly string[]).includes(
      query.orderBy ?? '',
    )
      ? query.orderBy!
      : 'createdAt';

    const limit = Number(query.limit) || 5;
    const page = Number(query.page) || 1;
    const skip = (page - 1) * limit;

    const qb = this.repository.createQueryBuilder('user');

    const conditions: string[] = [];
    const params: Record<string, string> = {};

    if (filter.name || filter.search) {
      conditions.push('user.name LIKE :name');
      params.name = `%${filter.name ?? filter.search}%`;
    }

    if (filter.registration || filter.search) {
      conditions.push('user.registration LIKE :registration');
      params.registration = `%${filter.registration ?? filter.search}%`;
    }

    if (filter.email || filter.search) {
      conditions.push('user.email LIKE :email');
      params.email = `%${filter.email ?? filter.search}%`;
    }

    if (conditions.length > 0) {
      qb.where(conditions.join(' OR '), params);
    }

    const [users, total] = await qb
      .orderBy(`user.${orderBy}`, order.toUpperCase() as 'ASC' | 'DESC')
      .skip(skip)
      .take(Number(limit))
      .getManyAndCount();

    return {
      result: users.map((user) => this.toDomain(user)),
      pagination: {
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        size: Number(limit),
        total,
      },
    };
  }

  private toDomain(entity: UserProps): UserEntity {
    return new UserEntity({
      id: entity.id,
      name: entity.name,
      registration: entity.registration,
      email: entity.email,
      password: entity.password,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    });
  }
}
