import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { makeMockUser, seedMockUsers } from '@/test/msw/handlers';
import { renderWithProviders, screen } from '@/test/test-utils';
import { CreateUserPage } from './CreateUserPage';

function renderCreatePage() {
  return renderWithProviders(
    <Routes>
      <Route path="/usuarios/novo" element={<CreateUserPage />} />
      <Route path="/usuarios" element={<div>Lista de usuários</div>} />
    </Routes>,
    { initialEntries: ['/usuarios/novo'] },
  );
}

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Insira o nome completo*'), 'Joao Silva');
  await user.type(screen.getByLabelText('Insira o Nº da matrícula*'), '99988877');
  await user.type(screen.getByLabelText('Insira o E-mail*'), 'joao@email.com');
  await user.type(screen.getByLabelText('Senha'), 'Ab1c2d');
  await user.type(screen.getByLabelText('Repetir Senha'), 'Ab1c2d');
}

describe('CreateUserPage', () => {
  it('creates a user and navigates back to the list on success', async () => {
    seedMockUsers([]);
    const user = userEvent.setup();
    renderCreatePage();

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: 'Cadastrar' }));

    expect(await screen.findByText('Lista de usuários')).toBeInTheDocument();
  });

  it('shows a field-level error when the registration is already taken', async () => {
    seedMockUsers([makeMockUser({ registration: '99988877' })]);
    const user = userEvent.setup();
    renderCreatePage();

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: 'Cadastrar' }));

    expect(
      await screen.findByText('Essa matrícula já está cadastrada.'),
    ).toBeInTheDocument();
    // Stays on the form — no navigation happened.
    expect(screen.queryByText('Lista de usuários')).not.toBeInTheDocument();
  });
});
