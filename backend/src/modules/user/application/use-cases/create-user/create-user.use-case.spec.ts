import { UserMessages } from '@/core/utils/user.messages';
import { UserEntity } from '@/modules/user/domain/entities/user.entity';
import type { UserRepositoryPort } from '@/modules/user/domain/repositories/user-repository.port';
import { HttpException, HttpStatus } from '@nestjs/common';
import { HashService } from '@/core/services/hash.service';
import { CreateUserUseCase } from './create-user.use-case';
import { InputCreateUserUseCaseDto } from './create-user.use-case.dto';

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

const input: InputCreateUserUseCaseDto = {
  name: 'Joao Silva',
  registration: '12345678',
  email: 'joao@email.com',
  password: 'Ab1c2d',
  isActive: true,
};

describe('CreateUserUseCase', () => {
  let repository: jest.Mocked<UserRepositoryPort>;
  let hashService: jest.Mocked<HashService>;
  let useCase: CreateUserUseCase;

  beforeEach(() => {
    repository = makeRepositoryMock();
    hashService = makeHashServiceMock();
    useCase = new CreateUserUseCase(repository, hashService);
  });

  it('hashes the password and persists a new user', async () => {
    repository.findByRegistration.mockResolvedValue(null);
    repository.findByEmail.mockResolvedValue(null);
    hashService.hash.mockResolvedValue('hashed-password');
    repository.create.mockImplementation((entity) => Promise.resolve(entity));

    const result = await useCase.execute(input);

    expect(hashService.hash).toHaveBeenCalledWith(input.password);
    expect(repository.create).toHaveBeenCalledTimes(1);
    const persisted = repository.create.mock.calls[0][0];
    expect(persisted.password).toBe('hashed-password');
    expect(result.name).toBe(input.name);
    expect(result).not.toHaveProperty('password');
  });

  it('rejects with 409 when the registration is already taken', async () => {
    repository.findByRegistration.mockResolvedValue({} as UserEntity);
    repository.findByEmail.mockResolvedValue(null);

    const error: HttpException = await useCase
      .execute(input)
      .catch((e: HttpException) => e);

    expect(error).toBeInstanceOf(HttpException);
    expect(error.getStatus()).toBe(HttpStatus.CONFLICT);
    expect(error.message).toBe(UserMessages.REGISTRATION_ALREADY_EXISTS);
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('rejects with 409 when the email is already taken', async () => {
    repository.findByRegistration.mockResolvedValue(null);
    repository.findByEmail.mockResolvedValue({} as UserEntity);

    const error: HttpException = await useCase
      .execute(input)
      .catch((e: HttpException) => e);

    expect(error).toBeInstanceOf(HttpException);
    expect(error.getStatus()).toBe(HttpStatus.CONFLICT);
    expect(error.message).toBe(UserMessages.EMAIL_ALREADY_EXISTS);
    expect(repository.create).not.toHaveBeenCalled();
  });
});
