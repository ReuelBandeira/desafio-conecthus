import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { ConfirmModal } from './ConfirmModal';

describe('ConfirmModal', () => {
  it('renders nothing when closed', () => {
    render(
      <ConfirmModal
        open={false}
        title="Deseja excluir?"
        description="O usuário será excluído."
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders the title/description and calls the right handler for each button', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    render(
      <ConfirmModal
        open
        title="Deseja excluir?"
        description="O usuário será excluído."
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Deseja excluir?')).toBeInTheDocument();
    expect(screen.getByText('O usuário será excluído.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Não' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Sim' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
