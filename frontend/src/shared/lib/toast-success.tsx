import { X } from 'lucide-react';
import { toast } from 'sonner';
import { CheckIcon } from '@/shared/components/icons';

export function toastSuccess(message: string) {
  toast.custom(
    (id) => (
      <div className="flex min-w-[280px] items-center gap-3 rounded-l-md bg-alert-green px-4 py-3 text-white shadow-modal">
        <CheckIcon className="h-5 w-5 shrink-0" aria-hidden="true" />
        <span className="flex-1 text-right text-[16px] font-bold leading-[22px]">
          {message}
        </span>
        <button
          type="button"
          onClick={() => toast.dismiss(id)}
          aria-label="Fechar"
          className="text-white/90 hover:text-white"
        >
          <X size={16} />
        </button>
      </div>
    ),
    { duration: 4000 },
  );
}
