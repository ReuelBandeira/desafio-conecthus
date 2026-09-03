import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { usersApi } from './users.api';
import type {
  CreateUserPayload,
  UpdateUserPayload,
  UsersQueryParams,
} from '../types/user.types';

const USERS_KEY = ['users'] as const;

export function useUsersQuery(params: UsersQueryParams) {
  return useQuery({
    queryKey: [...USERS_KEY, 'list', params],
    queryFn: () => usersApi.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useUserQuery(id: string | undefined) {
  return useQuery({
    queryKey: [...USERS_KEY, 'detail', id],
    queryFn: () => usersApi.getById(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateUserPayload) => usersApi.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [...USERS_KEY, 'list'] });
    },
  });
}

export function useUpdateUserMutation(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateUserPayload) => usersApi.update(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [...USERS_KEY, 'list'] });
      void queryClient.invalidateQueries({
        queryKey: [...USERS_KEY, 'detail', id],
      });
    },
  });
}

export function useDeleteUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => usersApi.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [...USERS_KEY, 'list'] });
    },
  });
}
