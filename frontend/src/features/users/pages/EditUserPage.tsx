import { ChevronLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Breadcrumb } from '@/shared/components/Breadcrumb';
import { ApiError } from '@/shared/lib/api-error';
import { toastSuccess } from '@/shared/lib/toast-success';
import { useUpdateUserMutation, useUserQuery } from '../api/users.queries';
import { UserForm, type UserFormValues } from '../components/UserForm';

export function EditUserPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: user, isLoading } = useUserQuery(id);
  const updateUser = useUpdateUserMutation(id ?? '');

  function handleSubmit(values: UserFormValues) {
    if (!id) return;
    updateUser.mutate(
      {
        name: values.name,
        registration: values.registration,
        email: values.email,
        password: values.password || undefined,
        isActive: true,
      },
      {
        onSuccess: () => {
          toastSuccess('Usuário atualizado com sucesso.');
          navigate('/usuarios');
        },
        onError: (error) => {
          if (!(error instanceof ApiError) || !error.field) {
            toast.error(
              error instanceof ApiError
                ? error.message
                : 'Não foi possível atualizar o usuário.',
            );
          }
        },
      },
    );
  }

  if (isLoading || !user) {
    return <p className="text-sm text-ink-muted">Carregando...</p>;
  }

  const error = updateUser.error;

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Usuários', to: '/usuarios' },
          { label: 'Editar Usuário' },
        ]}
      />
      <h1 className="mt-2 flex items-center gap-2 text-[38px] font-bold leading-[52px] text-green">
        <button
          type="button"
          onClick={() => navigate('/usuarios')}
          aria-label="Voltar para usuários"
          className="-ml-1 text-green"
        >
          <ChevronLeft size={32} />
        </button>
        Editar Usuário
      </h1>
      <div className="mt-4 rounded-[5px] bg-white p-6 shadow-card">
        <UserForm
          mode="edit"
          defaultValues={{
            name: user.name,
            registration: user.registration,
            email: user.email,
          }}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/usuarios')}
          isSubmitting={updateUser.isPending}
          apiError={
            error instanceof ApiError
              ? { field: error.field, message: error.message }
              : null
          }
        />
      </div>
    </div>
  );
}
