import { ViewIcon, EditIcon, DeleteIcon } from '@/shared/components/icons';
import type { ReactNode } from 'react';
import type { User } from '../types/user.types';

interface UsersTableProps {
  users: User[];
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  emptyContent?: ReactNode;
}

export function UsersTable({
  users,
  onView,
  onEdit,
  onDelete,
  emptyContent,
}: UsersTableProps) {
  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="h-12 bg-navy text-white">
          <th className="rounded-l-[6px] px-4 font-medium">Nome</th>
          <th className="rounded-r-[6px] px-4 text-right font-medium">Ações</th>
        </tr>
      </thead>
      <tbody>
        {users.length === 0 && emptyContent ? (
          <tr>
            <td colSpan={2}>{emptyContent}</td>
          </tr>
        ) : (
          users.map((user) => (
            <tr
              key={user.id}
              className="h-9 border-b border-surface-border last:border-0"
            >
              <td className="px-4 text-ink">{user.name}</td>
              <td className="px-4">
                <div className="flex justify-end gap-3 text-green/80">
                  <button
                    type="button"
                    aria-label={`Ver ${user.name}`}
                    onClick={() => onView(user)}
                    className="hover:text-teal"
                  >
                    <ViewIcon className="h-6 w-6" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Editar ${user.name}`}
                    onClick={() => onEdit(user)}
                    className="hover:text-teal"
                  >
                    <EditIcon className="h-6 w-6" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Excluir ${user.name}`}
                    onClick={() => onDelete(user)}
                    className="hover:text-red-500"
                  >
                    <DeleteIcon className="h-6 w-6" />
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
