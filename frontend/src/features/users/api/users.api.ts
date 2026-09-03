import { apiRequest } from '@/shared/lib/api-client';
import type {
  CreateUserPayload,
  UpdateUserPayload,
  User,
  UsersPage,
  UsersQueryParams,
} from '../types/user.types';

function buildUsersQuery(params: UsersQueryParams): string {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.order) searchParams.set('order', params.order);
  if (params.orderBy) searchParams.set('orderBy', params.orderBy);
  if (params.search) searchParams.set('filter[search]', params.search);

  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

export const usersApi = {
  list(params: UsersQueryParams): Promise<UsersPage> {
    return apiRequest(`/users${buildUsersQuery(params)}`);
  },

  getById(id: string): Promise<User> {
    return apiRequest(`/users/${id}`);
  },

  create(payload: CreateUserPayload): Promise<User> {
    return apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update(id: string, payload: UpdateUserPayload): Promise<User> {
    return apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  remove(id: string): Promise<void> {
    return apiRequest(`/users/${id}`, { method: 'DELETE' });
  },
};
