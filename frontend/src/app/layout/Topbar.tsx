import { LogOut } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Avatar } from '@/shared/components/Avatar';
import { CURRENT_USER_NAME, CURRENT_USER_EMAIL } from '@/shared/lib/current-user';

export function Topbar() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="flex h-[84px] items-center justify-end bg-white px-6 shadow-[0px_3px_5px_#15223214]">
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu do usuário"
          className="cursor-pointer"
        >
          <Avatar name={CURRENT_USER_NAME} />
        </button>

        {open && (
          <div className="absolute right-0 top-full z-50 mt-2 w-[294px] rounded-[5px] bg-white p-4 shadow-[0px_1px_4px_#00860029]">
            <div className="flex items-center gap-3">
              <Avatar name={CURRENT_USER_NAME} />
              <div className="min-w-0">
                <p className="truncate text-[14px] font-bold leading-[19px] text-green">
                  {CURRENT_USER_NAME}
                </p>
                <p className="truncate text-[14px] font-normal leading-[19px] text-green/80">
                  {CURRENT_USER_EMAIL}
                </p>
              </div>
            </div>
            <hr className="my-3 border-surface-border" />
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-[14px] font-medium text-green/80 transition-colors hover:bg-surface-muted hover:text-green"
            >
              <LogOut size={16} />
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
