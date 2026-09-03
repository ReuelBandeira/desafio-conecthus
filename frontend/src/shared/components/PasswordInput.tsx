import clsx from 'clsx';
import { Eye, EyeOff } from 'lucide-react';
import { forwardRef, useId, useState } from 'react';

export interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  hint?: string;
  error?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, hint, error, id, className, ...props }, ref) => {
    const [visible, setVisible] = useState(false);
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1">
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={visible ? 'text' : 'password'}
            placeholder=" "
            aria-invalid={Boolean(error)}
            className={clsx(
              'peer h-14 w-full rounded-t border-0 border-b-2 bg-surface-filled px-4 pb-2 pr-10 pt-5 text-sm text-ink',
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
          <button
            type="button"
            onClick={() => setVisible((value) => !value)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
            aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
            tabIndex={-1}
          >
            {visible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
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
PasswordInput.displayName = 'PasswordInput';
