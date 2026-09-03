import clsx from 'clsx';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  type LucideIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

const LIMIT_OPTIONS = [5, 10, 15, 25, 50];

export function Pagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  onLimitChange,
}: PaginationProps) {
  const safeTotalPages = Math.max(totalPages, 1);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-surface-border px-4 py-3 text-sm font-medium text-green">
      <span>Total de itens {total}</span>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          Itens por página
          <select
            aria-label="Itens por página"
            value={limit}
            onChange={(event) => onLimitChange(Number(event.target.value))}
            className="appearance-none bg-transparent pr-1 text-ink outline-none"
          >
            {LIMIT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span aria-hidden="true" className="text-[10px] text-ink-muted">
            ▾
          </span>
        </label>
        <div className="flex items-center gap-1">
          <PageButton
            icon={ChevronsLeft}
            label="Primeira página"
            disabled={page <= 1}
            onClick={() => onPageChange(1)}
          />
          <PageButton
            icon={ChevronLeft}
            label="Página anterior"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          />
          <span className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-teal text-center font-medium text-white">
            {page}
          </span>
          <PageButton
            icon={ChevronRight}
            label="Próxima página"
            disabled={page >= safeTotalPages}
            onClick={() => onPageChange(page + 1)}
          />
          <PageButton
            icon={ChevronsRight}
            label="Última página"
            disabled={page >= safeTotalPages}
            onClick={() => onPageChange(safeTotalPages)}
          />
          <span>de {safeTotalPages}</span>
        </div>
      </div>
    </div>
  );
}

function PageButton({
  icon: Icon,
  label,
  disabled,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  disabled: boolean;
  onClick: () => void;
}): ReactNode {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={clsx(
        'flex h-7 w-7 items-center justify-center rounded-md text-ink-muted hover:bg-surface-muted',
        'disabled:cursor-not-allowed disabled:opacity-40',
      )}
    >
      <Icon size={16} />
    </button>
  );
}
