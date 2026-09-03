import { AlertTriangle, X } from 'lucide-react';
import { toast } from 'sonner';

export function toastWarning(message: string) {
  toast.custom(
    (id) => (
      <div className="flex min-w-[280px] items-center gap-3 rounded-md bg-alert-orange px-4 py-3 text-white shadow-modal">
        <AlertTriangle size={24} strokeWidth={2} aria-hidden="true" />
        <span className="flex-1 text-[16px] font-bold leading-[22px]">
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
