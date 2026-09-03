import { Button } from './Button';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = 'Sim',
  cancelLabel = 'Não',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div className="w-[478px] max-w-full rounded-[6px] bg-white px-10 py-8 text-center shadow-[0px_1px_4px_#00000029]">
        <h2
          id="confirm-modal-title"
          className="text-[26px] font-bold leading-[36px] text-green"
        >
          {title}
        </h2>
        <p className="mt-2 text-[18px] font-medium leading-6 text-green">
          {description}
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button variant="secondary" className="min-w-[124px]" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant="primary" className="min-w-[124px]" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
