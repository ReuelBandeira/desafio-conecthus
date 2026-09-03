import { UserMessages } from '@/core/utils/user.messages';
import UserFactory from '@/modules/user/domain/factories/user.factory';
import { UserEntity } from '@/modules/user/domain/entities/user.entity';
import type { UserRepositoryPort } from '@/modules/user/domain/repositories/user-repository.port';
import { HttpException, HttpStatus } from '@nestjs/common';
import { DeleteUserUseCase } from './delete-user.use-case';

const makeRepositoryMock = (): jest.Mocked<UserRepositoryPort> => ({
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findById: jest.fn(),
  findByRegistration: jest.fn(),
  findByEmail: jest.fn(),
  find: jest.fn(),
});

const makeExistingUser = (): UserEntity =>
  UserFactory.createUserFactory({
    id: 'existing-id',
    name: 'Joao Silva',
    registration: '12345678',
    email: 'joao@email.com',
    password: 'hashed-password',
    isActive: true,
    createdAt: new Date('2026-01-01T00:00:00Z'),
  });

describe('DeleteUserUseCase', () => {
  let repository: jest.Mocked<UserRepositoryPort>;
  let useCase: DeleteUserUseCase;

  beforeEach(() => {
    repository = makeRepositoryMock();
    useCase = new DeleteUserUseCase(repository);
  });

  it('rejects with 400 when the user does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    const error: HttpException = await useCase
      .execute('missing-id')
      .catch((e: HttpException) => e);

    expect(error).toBeInstanceOf(HttpException);
    expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
    expect(error.message).toBe(UserMessages.ID_NOT_FOUND_FOR_DELETE);
    expect(repository.delete).not.toHaveBeenCalled();
  });

  it('soft-deletes an existing user', async () => {
    const existingUser = makeExistingUser();
    repository.findById.mockResolvedValue(existingUser);
    repository.delete.mockResolvedValue(existingUser);

    await useCase.execute('existing-id');

    expect(repository.delete).toHaveBeenCalledWith('existing-id');
  });
});
