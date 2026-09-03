import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/shared/components/Button';
import { ConfirmModal } from '@/shared/components/ConfirmModal';
import { FloatingInput } from '@/shared/components/FloatingInput';
import { PasswordInput } from '@/shared/components/PasswordInput';
import type { UserFieldName } from '@/shared/lib/api-error';
import {
  createUserSchema,
  editUserSchema,
  type UserFormValues,
} from '../schemas/user-form.schema';

export type { UserFormValues } from '../schemas/user-form.schema';

export type UserFormMode = 'create' | 'edit';

export interface UserFormApiError {
  field?: UserFieldName;
  message: string;
}

interface UserFormProps {
  mode: UserFormMode;
  defaultValues?: Partial<UserFormValues>;
  onSubmit: (values: UserFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  apiError?: UserFormApiError | null;
}

const EMPTY_VALUES: UserFormValues = {
  name: '',
  registration: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export function UserForm({
  mode,
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
  apiError,
}: UserFormProps) {
  const schema = mode === 'edit' ? editUserSchema : createUserSchema;
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    trigger,
    formState: { errors, isValid, isDirty, touchedFields, isSubmitted },
  } = useForm<UserFormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { ...EMPTY_VALUES, ...defaultValues },
  });

  // React Hook Form only computes `isValid` after a validation pass, which
  // otherwise wouldn't happen until the user touches a field. Editing a
  // user whose current data is already valid (the common case) would then
  // show a wrongly-disabled Salvar button until something was typed.
  useEffect(() => {
    void trigger();
  }, [trigger]);

  useEffect(() => {
    if (apiError?.field) {
      setError(apiError.field, { type: 'server', message: apiError.message });
    }
  }, [apiError, setError]);

  // The mount-time `trigger()` above populates `errors` for every empty
  // required field on a fresh create form — showing all of that before the
  // user has typed anything would look broken. Only surface an error once
  // the field has actually been touched (or the form was submitted).
  function visibleError(field: keyof UserFormValues): string | undefined {
    if (touchedFields[field] || isSubmitted) {
      return errors[field]?.message;
    }
    return undefined;
  }

  function handleCancelClick() {
    if (isDirty) {
      setCancelConfirmOpen(true);
      return;
    }
    onCancel();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
      <fieldset className="space-y-6 border-0 p-0">
        <section>
          <h2 className="border-b border-surface-border pb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Dados do Usuário
          </h2>
          <div className="mt-4 grid gap-x-14 gap-y-6 sm:grid-cols-2">
            <FloatingInput
              label="Insira o nome completo*"
              hint="Máx. 30 Caracteres"
              error={visibleError('name')}
              autoComplete="off"
              {...register('name')}
            />
            <FloatingInput
              label="Insira o Nº da matrícula*"
              hint="Mín. 4 - Máx. 10 números"
              error={visibleError('registration')}
              autoComplete="off"
              {...register('registration')}
            />
            <FloatingInput
              label="Insira o E-mail*"
              type="email"
              hint="Máx. 40 Caracteres"
              error={visibleError('email')}
              autoComplete="off"
              {...register('email')}
            />
          </div>
        </section>

        <section>
          <h2 className="border-b border-surface-border pb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Dados de acesso
          </h2>
          <div className="mt-4 grid gap-x-14 gap-y-6 sm:grid-cols-2">
            <PasswordInput
              label="Senha"
              hint={
                mode === 'edit'
                  ? 'Deixe em branco para manter a senha atual'
                  : '6 caracteres alfanuméricos'
              }
              error={visibleError('password')}
              autoComplete="new-password"
              {...register('password')}
            />
            <PasswordInput
              label="Repetir Senha"
              error={visibleError('confirmPassword')}
              autoComplete="new-password"
              {...register('confirmPassword')}
            />
          </div>
        </section>
      </fieldset>

      {apiError && !apiError.field && (
        <p className="mt-4 text-sm text-red-500">{apiError.message}</p>
      )}

      <div className="mt-8 flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={handleCancelClick}>
          Cancelar
        </Button>
        <Button type="submit" disabled={!isValid || isSubmitting}>
          {mode === 'edit' ? 'Salvar' : 'Cadastrar'}
        </Button>
      </div>

      <ConfirmModal
        open={cancelConfirmOpen}
        title="Deseja cancelar?"
        description="Os dados inseridos não serão salvos"
        onCancel={() => setCancelConfirmOpen(false)}
        onConfirm={() => {
          setCancelConfirmOpen(false);
          onCancel();
        }}
      />
    </form>
  );
}
