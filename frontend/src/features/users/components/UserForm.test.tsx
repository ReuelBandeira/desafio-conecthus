import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@/test/test-utils';
import { UserForm } from './UserForm';

const VALID_INPUT = {
  name: 'Joao Silva',
  registration: '12345678',
  email: 'joao@email.com',
  password: 'Ab1c2d',
};

describe('UserForm (create)', () => {
  it('does not show validation errors on a fresh, untouched form', async () => {
    render(<UserForm mode="create" onSubmit={vi.fn()} onCancel={vi.fn()} />);

    // The button starts disabled (nothing filled in yet), but that must not
    // come with a wall of red error text nobody has earned by interacting.
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Cadastrar' })).toBeDisabled(),
    );
    expect(screen.queryByText(/obrigatório/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText('Nome deve conter apenas letras.'),
    ).not.toBeInTheDocument();
  });

  it('keeps the submit button disabled until every field is valid', async () => {
    const user = userEvent.setup();
    render(<UserForm mode="create" onSubmit={vi.fn()} onCancel={vi.fn()} />);

    const submitButton = screen.getByRole('button', { name: 'Cadastrar' });
    expect(submitButton).toBeDisabled();

    await user.type(screen.getByLabelText('Insira o nome completo*'), VALID_INPUT.name);
    await user.type(screen.getByLabelText('Insira o Nº da matrícula*'), VALID_INPUT.registration);
    await user.type(screen.getByLabelText('Insira o E-mail*'), VALID_INPUT.email);
    expect(submitButton).toBeDisabled();

    await user.type(screen.getByLabelText('Senha'), VALID_INPUT.password);
    expect(submitButton).toBeDisabled();

    await user.type(screen.getByLabelText('Repetir Senha'), VALID_INPUT.password);
    expect(submitButton).toBeEnabled();
  });

  it('rejects a name with digits as invalid input', async () => {
    const user = userEvent.setup();
    render(<UserForm mode="create" onSubmit={vi.fn()} onCancel={vi.fn()} />);

    await user.type(screen.getByLabelText('Insira o nome completo*'), 'Jo4o');
    await user.tab();

    expect(
      await screen.findByText('Nome deve conter apenas letras.'),
    ).toBeInTheDocument();
  });

  it('calls onSubmit with the typed values once valid', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<UserForm mode="create" onSubmit={onSubmit} onCancel={vi.fn()} />);

    await user.type(screen.getByLabelText('Insira o nome completo*'), VALID_INPUT.name);
    await user.type(screen.getByLabelText('Insira o Nº da matrícula*'), VALID_INPUT.registration);
    await user.type(screen.getByLabelText('Insira o E-mail*'), VALID_INPUT.email);
    await user.type(screen.getByLabelText('Senha'), VALID_INPUT.password);
    await user.type(screen.getByLabelText('Repetir Senha'), VALID_INPUT.password);

    await user.click(screen.getByRole('button', { name: 'Cadastrar' }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: VALID_INPUT.name,
        registration: VALID_INPUT.registration,
        email: VALID_INPUT.email,
        password: VALID_INPUT.password,
        confirmPassword: VALID_INPUT.password,
      }),
      expect.anything(),
    );
  });

  it('toggles password visibility', async () => {
    const user = userEvent.setup();
    render(<UserForm mode="create" onSubmit={vi.fn()} onCancel={vi.fn()} />);

    const passwordInput = screen.getByLabelText('Senha');
    expect(passwordInput).toHaveAttribute('type', 'password');

    // "Senha" and "Repetir Senha" each render their own toggle — the first
    // one in DOM order belongs to "Senha".
    const [showPasswordButton] = screen.getAllByRole('button', {
      name: 'Mostrar senha',
    });
    await user.click(showPasswordButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
  });

  it('asks for confirmation before cancelling a dirty form', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<UserForm mode="create" onSubmit={vi.fn()} onCancel={onCancel} />);

    await user.type(screen.getByLabelText('Insira o nome completo*'), 'Joao');
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(screen.getByText('Deseja cancelar?')).toBeInTheDocument();
    expect(onCancel).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Sim' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('cancels immediately when the form is untouched', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<UserForm mode="create" onSubmit={vi.fn()} onCancel={onCancel} />);

    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Deseja cancelar?')).not.toBeInTheDocument();
  });
});

describe('UserForm (edit)', () => {
  it('allows submitting with an empty password to keep the current one', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <UserForm
        mode="edit"
        defaultValues={{
          name: VALID_INPUT.name,
          registration: VALID_INPUT.registration,
          email: VALID_INPUT.email,
        }}
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />,
    );

    const saveButton = await screen.findByRole('button', { name: 'Salvar' });
    await waitFor(() => expect(saveButton).toBeEnabled());
    await user.click(saveButton);

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ password: '', confirmPassword: '' }),
      expect.anything(),
    );
  });
});
