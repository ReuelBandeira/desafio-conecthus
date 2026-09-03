import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Breadcrumb } from '@/shared/components/Breadcrumb';
import { ApiError } from '@/shared/lib/api-error';
import { toastSuccess } from '@/shared/lib/toast-success';
import { toastWarning } from '@/shared/lib/toast-warning';
import { useCreateUserMutation } from '../api/users.queries';
import { UserForm, type UserFormValues } from '../components/UserForm';

export function CreateUserPage() {
  const navigate = useNavigate();
  const createUser = useCreateUserMutation();

  function handleSubmit(values: UserFormValues) {
    createUser.mutate(
      {
        name: values.name,
        registration: values.registration,
        email: values.email,
        password: values.password,
        isActive: true,
      },
      {
        onSuccess: () => {
          toastSuccess('Cadastro Realizado!');
          navigate('/usuarios');
        },
        onError: (error) => {
          if (!(error instanceof ApiError) || !error.field) {
            toast.error(
              error instanceof ApiError
                ? error.message
                : 'Não foi possível cadastrar o usuário.',
            );
          }
        },
      },
    );
  }

  const error = createUser.error;

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Usuários', to: '/usuarios' },
          { label: 'Cadastro de Usuário' },
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
        Cadastro de Usuário
      </h1>
      <div className="mt-4 rounded-[5px] bg-white p-6 shadow-card">
        <UserForm
          mode="create"
          onSubmit={handleSubmit}
          onCancel={() => {
            toastWarning('Cadastro cancelado');
            navigate('/usuarios');
          }}
          isSubmitting={createUser.isPending}
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
