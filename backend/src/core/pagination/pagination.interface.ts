export interface PageRequest<TFilter = any> {
  filter?: TFilter;
  page?: number;
  limit?: number;
  order?: 'asc' | 'desc';
  orderBy?: string;
}

export interface PageResponse<T> {
  result: T[];
  pagination: {
    page: number;
    size: number;
    totalPages: number;
    total: number;
  };
}

export interface UserFilter {
  name?: string;
  registration?: string;
  email?: string;
  search?: string;
}
