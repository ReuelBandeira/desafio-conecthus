import {
  PageRequest,
  UserFilter,
} from '@/core/pagination/pagination.interface';
import type { UserRepositoryPort } from '@/modules/user/domain/repositories/user-repository.port';
import { FindAllUserUseCase } from './find-all-user.use-case';

const makeRepositoryMock = (): jest.Mocked<UserRepositoryPort> => ({
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findById: jest.fn(),
  findByRegistration: jest.fn(),
  findByEmail: jest.fn(),
  find: jest.fn(),
});

describe('FindAllUserUseCase', () => {
  let repository: jest.Mocked<UserRepositoryPort>;
  let useCase: FindAllUserUseCase;

  beforeEach(() => {
    repository = makeRepositoryMock();
    useCase = new FindAllUserUseCase(repository);
    repository.find.mockResolvedValue({
      result: [],
      pagination: { page: 1, size: 5, totalPages: 0, total: 0 },
    });
  });

  it('strips empty and placeholder ("string") filter values before querying', async () => {
    const request: PageRequest<UserFilter> = {
      page: 1,
      filter: { name: 'Joao', registration: 'string', email: '' },
    };

    await useCase.execute(request);

    expect(repository.find).toHaveBeenCalledWith({
      page: 1,
      filter: { name: 'Joao' },
    });
  });

  it('passes the request through untouched when there is no filter', async () => {
    const request: PageRequest<UserFilter> = { page: 2 };

    await useCase.execute(request);

    expect(repository.find).toHaveBeenCalledWith(request);
  });

  it('returns the repository result and pagination as-is', async () => {
    const paginated = {
      result: [{ id: '1' } as never],
      pagination: { page: 1, size: 5, totalPages: 1, total: 1 },
    };
    repository.find.mockResolvedValue(paginated);

    const result = await useCase.execute({});

    expect(result).toEqual(paginated);
  });
});
