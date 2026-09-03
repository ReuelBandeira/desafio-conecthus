import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { makeMockUser, seedMockUsers } from '@/test/msw/handlers';
import { renderWithProviders, screen } from '@/test/test-utils';
import { EditUserPage } from './EditUserPage';

function renderEditPage(id: string) {
  return renderWithProviders(
    <Routes>
      <Route path="/usuarios/:id/editar" element={<EditUserPage />} />
      <Route path="/usuarios" element={<div>Lista de usuários</div>} />
    </Routes>,
    { initialEntries: [`/usuarios/${id}/editar`] },
  );
}

describe('EditUserPage', () => {
  it('shows a loading state before the user data arrives', () => {
    seedMockUsers([makeMockUser({ id: 'u1' })]);
    renderEditPage('u1');
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('pre-fills the form with the fetched user and updates it', async () => {
    seedMockUsers([
      makeMockUser({
        id: 'u1',
        name: 'Joao Silva',
        registration: '12345678',
        email: 'joao@email.com',
      }),
    ]);
    const user = userEvent.setup();
    renderEditPage('u1');

    const nameInput = await screen.findByLabelText('Insira o nome completo*');
    expect(nameInput).toHaveValue('Joao Silva');
    expect(screen.getByLabelText('Insira o Nº da matrícula*')).toHaveValue('12345678');
    expect(screen.getByLabelText('Insira o E-mail*')).toHaveValue('joao@email.com');

    await user.clear(nameInput);
    await user.type(nameInput, 'Joao Silva Junior');
    await user.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(await screen.findByText('Lista de usuários')).toBeInTheDocument();
  });

  it('updates without touching the password field', async () => {
    seedMockUsers([makeMockUser({ id: 'u1', name: 'Joao Silva' })]);
    const user = userEvent.setup();
    renderEditPage('u1');

    await screen.findByLabelText('Insira o nome completo*');
    // Password fields are left blank on purpose.
    await user.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(await screen.findByText('Lista de usuários')).toBeInTheDocument();
  });

  it('shows a field-level error when the new registration is already taken', async () => {
    seedMockUsers([
      makeMockUser({ id: 'u1', name: 'Joao Silva', registration: '11111111' }),
      makeMockUser({ id: 'u2', name: 'Ana Souza', registration: '22222222' }),
    ]);
    const user = userEvent.setup();
    renderEditPage('u1');

    const registrationInput = await screen.findByLabelText('Insira o Nº da matrícula*');
    await user.clear(registrationInput);
    await user.type(registrationInput, '22222222');
    await user.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(
      await screen.findByText('Essa matrícula já está cadastrada.'),
    ).toBeInTheDocument();
    expect(screen.queryByText('Lista de usuários')).not.toBeInTheDocument();
  });
});
