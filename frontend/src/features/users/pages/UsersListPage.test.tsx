import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderWithProviders, screen, waitFor } from '@/test/test-utils';
import { makeMockUser, seedMockUsers } from '@/test/msw/handlers';
import { UsersListPage } from './UsersListPage';

describe('UsersListPage', () => {
  it('shows the empty state when there are no users', async () => {
    seedMockUsers([]);
    renderWithProviders(<UsersListPage />);

    expect(
      await screen.findByText('Nenhum Usuário Registrado'),
    ).toBeInTheDocument();
    expect(screen.queryByText('Nome')).not.toBeInTheDocument();
  });

  it('lists existing users', async () => {
    seedMockUsers([
      makeMockUser({ id: 'u1', name: 'Ana Souza' }),
      makeMockUser({ id: 'u2', name: 'Bruno Lima' }),
    ]);
    renderWithProviders(<UsersListPage />);

    expect(await screen.findByText('Ana Souza')).toBeInTheDocument();
    expect(screen.getByText('Bruno Lima')).toBeInTheDocument();
  });

  it('filters the list by search', async () => {
    seedMockUsers([
      makeMockUser({ id: 'u1', name: 'Ana Souza' }),
      makeMockUser({ id: 'u2', name: 'Bruno Lima' }),
    ]);
    const user = userEvent.setup();
    renderWithProviders(<UsersListPage />);

    await screen.findByText('Ana Souza');

    await user.type(
      screen.getByLabelText('Pesquisar usuário por nome, matrícula ou e-mail'),
      'Bruno',
    );

    await waitFor(() => {
      expect(screen.queryByText('Ana Souza')).not.toBeInTheDocument();
    });
    expect(screen.getByText('Bruno Lima')).toBeInTheDocument();
  });

  it('shows the no-results empty state for a search with no matches', async () => {
    seedMockUsers([makeMockUser({ id: 'u1', name: 'Ana Souza' })]);
    const user = userEvent.setup();
    renderWithProviders(<UsersListPage />);

    await screen.findByText('Ana Souza');
    await user.type(
      screen.getByLabelText('Pesquisar usuário por nome, matrícula ou e-mail'),
      'Zzz',
    );

    expect(
      await screen.findByText('Nenhum Resultado Encontrado'),
    ).toBeInTheDocument();
    expect(screen.getByText('Nome')).toBeInTheDocument();
    expect(screen.getByText('Ações')).toBeInTheDocument();
    expect(document.querySelector('img[src="/no-results-illustration.png"]')).toBeInTheDocument();
  });

  it('deletes a user after confirming the modal', async () => {
    seedMockUsers([makeMockUser({ id: 'u1', name: 'Ana Souza' })]);
    const user = userEvent.setup();
    renderWithProviders(<UsersListPage />);

    await screen.findByText('Ana Souza');
    await user.click(screen.getByRole('button', { name: 'Excluir Ana Souza' }));

    expect(screen.getByText('Deseja excluir?')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Sim' }));

    await waitFor(() => {
      expect(screen.queryByText('Ana Souza')).not.toBeInTheDocument();
    });
  });

  it('keeps the user when the delete confirmation is declined', async () => {
    seedMockUsers([makeMockUser({ id: 'u1', name: 'Ana Souza' })]);
    const user = userEvent.setup();
    renderWithProviders(<UsersListPage />);

    await screen.findByText('Ana Souza');
    await user.click(screen.getByRole('button', { name: 'Excluir Ana Souza' }));
    await user.click(screen.getByRole('button', { name: 'Não' }));

    expect(screen.queryByText('Deseja excluir?')).not.toBeInTheDocument();
    expect(screen.getByText('Ana Souza')).toBeInTheDocument();
  });
});
