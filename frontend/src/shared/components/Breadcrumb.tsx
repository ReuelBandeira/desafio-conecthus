import { Fragment } from 'react';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  to?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="breadcrumb" className="text-xs text-ink-muted">
      {items.map((item, index) => (
        <Fragment key={item.label}>
          {index > 0 && <span className="mx-1">&gt;</span>}
          {item.to ? (
            <Link to={item.to} className="hover:text-teal-dark">
              {item.label}
            </Link>
          ) : (
            <span>{item.label}</span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
