import type { ComponentType, ReactNode, SVGProps } from 'react';

interface EmptyStateProps {
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  illustration?: ReactNode;
  title: string;
  description?: string;
}

export function EmptyState({
  icon: Icon,
  illustration,
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {illustration ? <div className="mb-9">{illustration}</div> : null}
      {Icon && !illustration ? (
        <Icon className="mb-3 h-12 w-12 text-teal" aria-hidden="true" />
      ) : null}
      {/* H5 Manrope — 24pt, bold, #0B2B25, opacidade 100% (spec do design) */}
      <p className="text-2xl font-bold leading-[33px] text-green">{title}</p>
      {description ? (
        // B1 Manrope — 18pt, medium, #0B2B25, 89% opacity, 400×48 (spec do design)
        <p className="mt-3 max-w-[400px] text-lg font-medium leading-6 text-green/[0.89]">
          {description}
        </p>
      ) : null}
    </div>
  );
}
