import clsx from 'clsx';
import { forwardRef, useId } from 'react';

export interface FloatingInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
}

export const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ label, hint, error, id, className, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1">
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            placeholder=" "
            aria-invalid={Boolean(error)}
            className={clsx(
              'peer h-14 w-full rounded-t border-0 border-b-2 bg-surface-filled px-4 pb-2 pt-5 text-sm text-ink',
              'outline-none transition-colors',
              'disabled:cursor-not-allowed disabled:opacity-70',
              error
                ? 'border-red-500'
                : 'border-transparent focus:border-teal',
              className,
            )}
            {...props}
          />
          <label
            htmlFor={inputId}
            className={clsx(
              'pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink-muted transition-all',
              'peer-focus:top-3 peer-focus:text-xs peer-focus:text-teal-dark',
              'peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-teal-dark',
            )}
          >
            {label}
          </label>
        </div>
        {error ? (
          <p className="text-xs text-red-500">{error}</p>
        ) : hint ? (
          <p className="text-xs text-ink-muted">{hint}</p>
        ) : null}
      </div>
    );
  },
);
FloatingInput.displayName = 'FloatingInput';
