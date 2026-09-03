import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { makeMockUser, seedMockUsers } from '@/test/msw/handlers';
import { renderWithProviders, screen } from '@/test/test-utils';
import { ViewUserPage } from './ViewUserPage';

function renderViewPage(id: string) {
  return renderWithProviders(
    <Routes>
      <Route path="/usuarios/:id" element={<ViewUserPage />} />
      <Route path="/usuarios" element={<div>Lista de usuários</div>} />
    </Routes>,
    { initialEntries: [`/usuarios/${id}`] },
  );
}

describe('ViewUserPage', () => {
  it('shows a loading state before the user data arrives', () => {
    seedMockUsers([makeMockUser({ id: 'u1' })]);
    renderViewPage('u1');
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('renders the user data read-only, with no password fields', async () => {
    seedMockUsers([
      makeMockUser({
        id: 'u1',
        name: 'Joao Silva',
        registration: '12345678',
        email: 'joao@email.com',
        updatedAt: null,
      }),
    ]);
    renderViewPage('u1');

    expect(await screen.findByText('Joao Silva')).toBeInTheDocument();
    expect(screen.getByText('12345678')).toBeInTheDocument();
    expect(screen.getByText('joao@email.com')).toBeInTheDocument();
    expect(screen.getByText('Última edição')).toBeInTheDocument();
    expect(screen.getByText('Nenhuma')).toBeInTheDocument();
    expect(screen.queryByLabelText('Senha')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Salvar' })).not.toBeInTheDocument();
  });

  it('shows the formatted last-edit date when the user has been updated', async () => {
    seedMockUsers([
      makeMockUser({
        id: 'u1',
        name: 'Joao Silva',
        updatedAt: '2024-05-08T12:00:00.000Z',
      }),
    ]);
    renderViewPage('u1');

    await screen.findByText('Joao Silva');
    expect(screen.getByText('08/05/2024')).toBeInTheDocument();
  });

  it('navigates back to the list from Fechar or the close button', async () => {
    seedMockUsers([makeMockUser({ id: 'u1', name: 'Joao Silva' })]);
    const user = userEvent.setup();
    renderViewPage('u1');

    await screen.findByText('Joao Silva');
    await user.click(screen.getByRole('button', { name: 'Fechar' }));

    expect(await screen.findByText('Lista de usuários')).toBeInTheDocument();
  });
});
