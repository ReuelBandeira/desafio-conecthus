import { PlusIcon, SearchIcon } from '@/shared/components/icons';
import clsx from 'clsx';
import { X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/shared/components/Button';
import { ConfirmModal } from '@/shared/components/ConfirmModal';
import { EmptyState } from '@/shared/components/EmptyState';
import { Pagination } from '@/shared/components/Pagination';
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';
import { toastSuccess } from '@/shared/lib/toast-success';
import { useDeleteUserMutation, useUsersQuery } from '../api/users.queries';
import { UsersTable } from '../components/UsersTable';
import type { User } from '../types/user.types';

export function UsersListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const debouncedSearch = useDebouncedValue(search);

  const { data, isLoading } = useUsersQuery({
    search: debouncedSearch || undefined,
    page,
    limit,
  });

  const deleteUser = useDeleteUserMutation();

  const users = data?.result ?? [];
  const pagination = data?.pagination;
  const hasSearch = debouncedSearch.trim().length > 0;

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleConfirmDelete() {
    if (!userToDelete) return;
    const name = userToDelete.name;
    deleteUser.mutate(userToDelete.id, {
      onSuccess: () => {
        toastSuccess(`${name} foi excluído com sucesso.`);
        setUserToDelete(null);
      },
      onError: () => {
        toast.error('Não foi possível excluir o usuário.');
        setUserToDelete(null);
      },
    });
  }

  return (
    <div>
      <h1 className="text-[38px] font-bold leading-[52px] text-green">Usuários</h1>

      <div className="mt-4 rounded-[5px] bg-white shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div className="relative w-[285px]">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <input
              value={search}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Pesquisa"
              aria-label="Pesquisar usuário por nome, matrícula ou e-mail"
              className={clsx(
                'h-14 w-[285px] rounded-[7px] border bg-white py-2 pl-9 pr-9 text-sm shadow-[0px_3px_5px_#15223214] outline-none focus:border-teal',
                search ? 'border-teal' : 'border-surface-border',
              )}
            />
            {search && (
              <button
                type="button"
                onClick={() => handleSearchChange('')}
                aria-label="Limpar pesquisa"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button
            className="h-14 min-w-[223px] !justify-start"
            onClick={() => navigate('/usuarios/novo')}
          >
            <PlusIcon className="h-[18px] w-[18px]" />
            Cadastrar Usuário
          </Button>
        </div>

        {!isLoading && users.length === 0 && !hasSearch ? (
          <EmptyState
            title="Nenhum Usuário Registrado"
            description="Clique em 'Cadastrar Usuário' para começar a cadastrar."
          />
        ) : (
          <UsersTable
            users={users}
            onView={(user) => navigate(`/usuarios/${user.id}`)}
            onEdit={(user) => navigate(`/usuarios/${user.id}/editar`)}
            onDelete={setUserToDelete}
            emptyContent={
              !isLoading && users.length === 0 && hasSearch ? (
                <EmptyState
                  illustration={
                    <img
                      src="/no-results-illustration.png"
                      alt=""
                      width={227}
                      height={225}
                    />
                  }
                  title="Nenhum Resultado Encontrado"
                  description="Não foi possível achar nenhum resultado para sua busca. Tente refazer a pesquisa para encontrar o que busca."
                />
              ) : undefined
            }
          />
        )}

        {pagination && (
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={(value) => {
              setLimit(value);
              setPage(1);
            }}
          />
        )}
      </div>

      <ConfirmModal
        open={Boolean(userToDelete)}
        title="Deseja excluir?"
        description="O usuário será excluído."
        onCancel={() => setUserToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
