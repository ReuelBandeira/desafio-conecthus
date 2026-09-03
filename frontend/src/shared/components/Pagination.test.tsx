import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('shows the total and current/total pages', () => {
    render(
      <Pagination
        page={2}
        totalPages={5}
        total={42}
        limit={15}
        onPageChange={vi.fn()}
        onLimitChange={vi.fn()}
      />,
    );

    expect(screen.getByText('Total de itens 42')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('de 5')).toBeInTheDocument();
  });

  it('disables previous/first on the first page and calls onPageChange for next', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(
      <Pagination
        page={1}
        totalPages={3}
        total={30}
        limit={10}
        onPageChange={onPageChange}
        onLimitChange={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'Página anterior' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Primeira página' })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'Próxima página' }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('disables next/last on the last page', () => {
    render(
      <Pagination
        page={3}
        totalPages={3}
        total={30}
        limit={10}
        onPageChange={vi.fn()}
        onLimitChange={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'Próxima página' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Última página' })).toBeDisabled();
  });

  it('calls onLimitChange when the page-size select changes', async () => {
    const user = userEvent.setup();
    const onLimitChange = vi.fn();

    render(
      <Pagination
        page={1}
        totalPages={2}
        total={20}
        limit={15}
        onPageChange={vi.fn()}
        onLimitChange={onLimitChange}
      />,
    );

    await user.selectOptions(screen.getByLabelText('Itens por página'), '25');
    expect(onLimitChange).toHaveBeenCalledWith(25);
  });
});
