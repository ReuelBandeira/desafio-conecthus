import { http, HttpResponse } from 'msw';

const API_BASE = 'http://localhost:5000/api/v1';

export interface MockUser {
  id: string;
  name: string;
  registration: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
}

export let mockUsers: MockUser[] = [];

export function seedMockUsers(users: MockUser[]): void {
  mockUsers = users;
}

export function makeMockUser(overrides: Partial<MockUser> = {}): MockUser {
  return {
    id: overrides.id ?? `user-${Math.random().toString(36).slice(2, 8)}`,
    name: 'Raimundo Neto Abreu Teixeira',
    registration: '12345678',
    email: 'raimundo@email.com',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: null,
    deletedAt: null,
    ...overrides,
  };
}

export const handlers = [
  http.get(`${API_BASE}/users`, ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('filter[search]')?.toLowerCase();
    const page = Number(url.searchParams.get('page') ?? 1);
    const limit = Number(url.searchParams.get('limit') ?? 5);

    const filtered = search
      ? mockUsers.filter((user) => user.name.toLowerCase().includes(search))
      : mockUsers;

    const start = (page - 1) * limit;
    const result = filtered.slice(start, start + limit);

    return HttpResponse.json({
      result,
      pagination: {
        page,
        size: limit,
        totalPages: Math.max(Math.ceil(filtered.length / limit), 1),
        total: filtered.length,
      },
    });
  }),

  http.get(`${API_BASE}/users/:id`, ({ params }) => {
    const user = mockUsers.find((item) => item.id === params.id);
    if (!user) {
      return HttpResponse.json(
        { statusCode: 400, message: 'Usuário não encontrado.' },
        { status: 400 },
      );
    }
    return HttpResponse.json(user);
  }),

  http.post(`${API_BASE}/users`, async ({ request }) => {
    const body = (await request.json()) as {
      name: string;
      registration: string;
      email: string;
    };

    if (mockUsers.some((user) => user.registration === body.registration)) {
      return HttpResponse.json(
        {
          statusCode: 409,
          message: 'Já existe um usuário cadastrado com esta matrícula.',
        },
        { status: 409 },
      );
    }
    if (mockUsers.some((user) => user.email === body.email)) {
      return HttpResponse.json(
        { statusCode: 409, message: 'Já existe um usuário cadastrado com este e-mail.' },
        { status: 409 },
      );
    }

    const newUser = makeMockUser(body);
    mockUsers.push(newUser);
    return HttpResponse.json(newUser, { status: 201 });
  }),

  http.put(`${API_BASE}/users/:id`, async ({ params, request }) => {
    const index = mockUsers.findIndex((user) => user.id === params.id);
    if (index === -1) {
      return HttpResponse.json(
        { statusCode: 400, message: 'Usuário não encontrado.' },
        { status: 400 },
      );
    }
    const body = (await request.json()) as Partial<MockUser>;
    const current = mockUsers[index];

    // Mirrors the real backend's UpdateUserUseCase: only re-checks
    // uniqueness when the field actually changed, against every *other*
    // user.
    if (
      body.registration &&
      body.registration !== current.registration &&
      mockUsers.some(
        (user) => user.id !== current.id && user.registration === body.registration,
      )
    ) {
      return HttpResponse.json(
        { statusCode: 409, message: 'Esta matrícula já está em uso.' },
        { status: 409 },
      );
    }
    if (
      body.email &&
      body.email !== current.email &&
      mockUsers.some((user) => user.id !== current.id && user.email === body.email)
    ) {
      return HttpResponse.json(
        { statusCode: 409, message: 'Este e-mail já está em uso.' },
        { status: 409 },
      );
    }

    mockUsers[index] = {
      ...current,
      ...body,
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json(mockUsers[index]);
  }),

  http.delete(`${API_BASE}/users/:id`, ({ params }) => {
    const index = mockUsers.findIndex((user) => user.id === params.id);
    if (index === -1) {
      return HttpResponse.json(
        { statusCode: 400, message: 'Usuário não encontrado para exclusão.' },
        { status: 400 },
      );
    }
    mockUsers.splice(index, 1);
    return new HttpResponse(null, { status: 204 });
  }),
];
