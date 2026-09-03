export interface User {
  id: string;
  name: string;
  registration: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
}

export interface Pagination {
  page: number;
  size: number;
  totalPages: number;
  total: number;
}

export interface UsersPage {
  result: User[];
  pagination: Pagination;
}

export type SortOrder = 'asc' | 'desc';

export type SortableField =
  | 'name'
  | 'registration'
  | 'email'
  | 'createdAt'
  | 'updatedAt';

export interface UsersQueryParams {
  search?: string;
  page?: number;
  limit?: number;
  order?: SortOrder;
  orderBy?: SortableField;
}

export interface CreateUserPayload {
  name: string;
  registration: string;
  email: string;
  password: string;
  isActive: boolean;
}

export interface UpdateUserPayload {
  name: string;
  registration: string;
  email: string;
  password?: string;
  isActive: boolean;
}
