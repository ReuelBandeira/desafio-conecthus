import { X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/shared/components/Button';
import { useUserQuery } from '../api/users.queries';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR');
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-ink-muted">{label}</p>
      <p className="mt-1 text-lg font-bold leading-6 text-green">{value}</p>
    </div>
  );
}

export function ViewUserPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: user, isLoading } = useUserQuery(id);

  function close() {
    navigate('/usuarios');
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
      <div
        className="flex h-full w-[614px] max-w-full flex-col rounded-l-[6px] bg-white shadow-[-7px_0px_27px_#0000001A]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="view-user-title"
      >
        <div className="flex items-center justify-between px-9 pt-7">
          <h1
            id="view-user-title"
            className="text-[24px] font-bold leading-[33px] text-green"
          >
            Visualizar Usuário
          </h1>
          <button
            type="button"
            aria-label="Fechar detalhes do usuário"
            onClick={close}
            className="text-ink hover:text-green"
          >
            <X size={22} />
          </button>
        </div>

        {isLoading || !user ? (
          <p className="px-9 py-6 text-sm text-ink-muted">Carregando...</p>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-9 py-6">
              <section>
                <h2 className="border-b border-surface-border pb-2 text-sm font-bold text-green">
                  Dados do Usuário
                </h2>
                <div className="mt-4 grid grid-cols-2 gap-x-10 gap-y-4">
                  <Field label="Nome" value={user.name} />
                  <Field label="Matrícula" value={user.registration} />
                </div>
                <div className="mt-4">
                  <Field label="E-mail" value={user.email} />
                </div>
              </section>

              <section className="mt-6">
                <h2 className="border-b border-surface-border pb-2 text-sm font-bold text-green">
                  Detalhes
                </h2>
                <div className="mt-4 grid grid-cols-2 gap-x-10 gap-y-4">
                  <Field label="Data de criação" value={formatDate(user.createdAt)} />
                  <Field
                    label="Última edição"
                    value={user.updatedAt ? formatDate(user.updatedAt) : 'Nenhuma'}
                  />
                </div>
              </section>
            </div>

            <div className="flex justify-center px-9 pb-9 pt-4">
              <Button
                type="button"
                variant="secondary"
                className="!border-green h-[58px] min-w-[152px]"
                onClick={close}
              >
                Fechar
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
