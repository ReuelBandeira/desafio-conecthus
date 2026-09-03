import { Search } from 'lucide-react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders the title and description', () => {
    render(
      <EmptyState
        icon={Search}
        title="Nenhum Resultado Encontrado"
        description="Tente refazer a pesquisa."
      />,
    );

    expect(screen.getByText('Nenhum Resultado Encontrado')).toBeInTheDocument();
    expect(screen.getByText('Tente refazer a pesquisa.')).toBeInTheDocument();
  });

  it('renders without a description', () => {
    render(<EmptyState icon={Search} title="Nenhum Usuário Registrado" />);
    expect(screen.getByText('Nenhum Usuário Registrado')).toBeInTheDocument();
  });

  it('renders without an icon when none is given (matches the design for the "no users at all" state)', () => {
    const { container } = render(<EmptyState title="Nenhum Usuário Registrado" />);
    expect(screen.getByText('Nenhum Usuário Registrado')).toBeInTheDocument();
    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });

  it('renders a custom illustration instead of the icon', () => {
    const { container } = render(
      <EmptyState
        icon={Search}
        illustration={<svg data-testid="illustration" />}
        title="Nenhum Resultado Encontrado"
      />,
    );

    expect(screen.getByTestId('illustration')).toBeInTheDocument();
    expect(container.querySelectorAll('svg')).toHaveLength(1);
  });
});
