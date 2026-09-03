import { UserMessages } from '@/core/utils/user.messages';
import { HashService } from '@/core/services/hash.service';
import UserFactory from '@/modules/user/domain/factories/user.factory';
import {
  UserEntity,
  UserProps,
} from '@/modules/user/domain/entities/user.entity';
import type { UserRepositoryPort } from '@/modules/user/domain/repositories/user-repository.port';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UpdateUserUseCase } from './update-user.use-case';
import { InputUpdateUserUseCaseDto } from './update-user.use-case.dto';

const makeRepositoryMock = (): jest.Mocked<UserRepositoryPort> => ({
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findById: jest.fn(),
  findByRegistration: jest.fn(),
  findByEmail: jest.fn(),
  find: jest.fn(),
});

const makeHashServiceMock = (): jest.Mocked<HashService> =>
  ({
    hash: jest.fn(),
    compare: jest.fn(),
  }) as unknown as jest.Mocked<HashService>;

const baseUserProps: UserProps = {
  id: 'existing-id',
  name: 'Joao Silva',
  registration: '12345678',
  email: 'joao@email.com',
  password: 'previously-hashed-password',
  isActive: true,
  createdAt: new Date('2026-01-01T00:00:00Z'),
};

const makeExistingUser = (overrides: Partial<UserProps> = {}): UserEntity =>
  UserFactory.createUserFactory({ ...baseUserProps, ...overrides });

const baseInput: InputUpdateUserUseCaseDto = {
  id: 'existing-id',
  name: 'Joao Silva Junior',
  registration: '12345678',
  email: 'joao@email.com',
  password: '',
  isActive: true,
};

describe('UpdateUserUseCase', () => {
  let repository: jest.Mocked<UserRepositoryPort>;
  let hashService: jest.Mocked<HashService>;
  let useCase: UpdateUserUseCase;

  beforeEach(() => {
    repository = makeRepositoryMock();
    hashService = makeHashServiceMock();
    useCase = new UpdateUserUseCase(repository, hashService);
    repository.update.mockImplementation((entity) => Promise.resolve(entity));
  });

  it('rejects with 400 when the user does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    const error: HttpException = await useCase
      .execute(baseInput)
      .catch((e: HttpException) => e);

    expect(error).toBeInstanceOf(HttpException);
    expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
    expect(error.message).toBe(UserMessages.ID_NOT_FOUND);
  });

  it('rejects with 409 when the user is inactive', async () => {
    repository.findById.mockResolvedValue(
      makeExistingUser({ isActive: false }),
    );

    const error: HttpException = await useCase
      .execute(baseInput)
      .catch((e: HttpException) => e);

    expect(error).toBeInstanceOf(HttpException);
    expect(error.getStatus()).toBe(HttpStatus.CONFLICT);
    expect(error.message).toBe(UserMessages.USER_NOT_ACTIVE);
  });

  it('rejects with 409 when the new registration is already used by someone else', async () => {
    repository.findById.mockResolvedValue(makeExistingUser());
    repository.findByRegistration.mockResolvedValue({} as UserEntity);

    const error: HttpException = await useCase
      .execute({ ...baseInput, registration: '99999999' })
      .catch((e: HttpException) => e);

    expect(error).toBeInstanceOf(HttpException);
    expect(error.getStatus()).toBe(HttpStatus.CONFLICT);
    expect(error.message).toBe(
      UserMessages.REGISTRATION_ALREADY_EXISTS_FOR_UPDATE,
    );
  });

  it('rejects with 409 when the new email is already used by someone else', async () => {
    repository.findById.mockResolvedValue(makeExistingUser());
    repository.findByEmail.mockResolvedValue({} as UserEntity);

    const error: HttpException = await useCase
      .execute({ ...baseInput, email: 'other@email.com' })
      .catch((e: HttpException) => e);

    expect(error).toBeInstanceOf(HttpException);
    expect(error.getStatus()).toBe(HttpStatus.CONFLICT);
    expect(error.message).toBe(UserMessages.EMAIL_ALREADY_EXISTS_FOR_UPDATE);
  });

  it('keeps the current password hash when no new password is given', async () => {
    const existingUser = makeExistingUser();
    repository.findById.mockResolvedValue(existingUser);

    const result = await useCase.execute(baseInput);

    expect(hashService.hash).not.toHaveBeenCalled();
    const persisted = repository.update.mock.calls[0][0];
    expect(persisted.password).toBe(existingUser.password);
    expect(result.name).toBe(baseInput.name);
  });

  it('hashes and stores a new password when one is provided', async () => {
    const existingUser = makeExistingUser();
    repository.findById.mockResolvedValue(existingUser);
    hashService.hash.mockResolvedValue('new-hashed-password');

    await useCase.execute({ ...baseInput, password: 'Nn3p5q' });

    expect(hashService.hash).toHaveBeenCalledWith('Nn3p5q');
    const persisted = repository.update.mock.calls[0][0];
    expect(persisted.password).toBe('new-hashed-password');
  });
});
