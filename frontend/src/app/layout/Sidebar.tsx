import clsx from 'clsx';
import { ChevronDown, ChevronLeft } from 'lucide-react';
import { useState, type ComponentType, type SVGProps } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Logo } from '@/shared/components/Logo';
import { AccessControlIcon, HomeIcon, UsersIcon } from '@/shared/components/icons';

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [accessOpen, setAccessOpen] = useState(true);
  const location = useLocation();
  const isAccessActive = location.pathname.startsWith('/usuarios');

  return (
    <aside
      className={clsx(
        'relative flex h-screen flex-col bg-navy text-white shadow-[7px_0px_6px_#0000002C] transition-all duration-200',
        collapsed ? 'w-[120px]' : 'w-[336px]',
      )}
    >
      <div
        className={clsx(
          'flex items-center py-6',
          collapsed ? 'justify-center px-6' : 'px-9',
        )}
      >
        {collapsed ? (
          <img src="/wenlock-mark.svg" alt="WenLock" className="h-14 w-auto" />
        ) : (
          <Logo />
        )}
      </div>

      <button
        type="button"
        onClick={() => setCollapsed((value) => !value)}
        aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
        className="absolute right-0 top-[45px] z-10 flex h-[37px] w-[37px] translate-x-1/2 items-center justify-center rounded-full bg-[#F2F2F2] text-navy shadow-[0px_3px_6px_#00000029]"
      >
        <ChevronLeft
          size={16}
          className={clsx('transition-transform', collapsed && 'rotate-180')}
        />
      </button>

      <nav className={clsx('flex-1 space-y-1', collapsed ? 'px-6' : 'px-9')}>
        <SidebarLink to="/home" icon={HomeIcon} label="Home" collapsed={collapsed} />

        <div className="group relative">
          <button
            type="button"
            onClick={() => setAccessOpen((value) => !value)}
            className={clsx(
              'flex h-[37px] w-full items-center gap-3 rounded-[4px] px-3 text-[16px] font-medium leading-[22px]',
              collapsed && 'justify-center',
              collapsed && isAccessActive
                ? 'bg-teal text-green'
                : 'text-white/60 hover:bg-white/5',
            )}
          >
            <AccessControlIcon className="h-[18px] w-[18px] shrink-0" />
            {!collapsed && (
              <>
                <span className="flex-1 text-left">Controle de Acesso</span>
                <ChevronDown
                  size={16}
                  className={clsx(
                    'transition-transform',
                    accessOpen && 'rotate-180',
                  )}
                />
              </>
            )}
          </button>

          {/* expandida: lista embutida, abre/fecha ao clicar */}
          {accessOpen && !collapsed && (
            <div className="mt-1 space-y-1 pl-4">
              <SidebarLink
                to="/usuarios"
                icon={UsersIcon}
                label="Usuários"
                collapsed={collapsed}
              />
            </div>
          )}

          {/* colapsada: submenu em flyout ao passar o mouse no ícone */}
          {collapsed && (
            <div className="invisible absolute left-full top-0 z-50 ml-2 min-w-40 overflow-hidden rounded-md bg-navy py-1 opacity-0 shadow-modal transition-opacity group-hover:visible group-hover:opacity-100">
              <p className="px-4 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-white/40">
                Controle de Acesso
              </p>
              <NavLink
                to="/usuarios"
                className={({ isActive }) =>
                  clsx(
                    'block whitespace-nowrap px-4 py-2 text-sm font-medium transition-colors',
                    isActive ? 'bg-teal text-green' : 'text-white/80 hover:bg-white/10',
                  )
                }
              >
                Usuários
              </NavLink>
            </div>
          )}
        </div>
      </nav>

      <div className="space-y-0.5 px-9 py-6 text-xs text-white/50">
        {!collapsed && (
          <>
            <p>© WenLock</p>
            <p>Powered by Conecthus</p>
            <p>V 1.0.0</p>
          </>
        )}
      </div>
    </aside>
  );
}

function SidebarLink({
  to,
  icon: Icon,
  label,
  collapsed,
}: {
  to: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  collapsed: boolean;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx(
          'flex h-[37px] items-center gap-3 rounded-[4px] px-3 text-[16px] font-medium leading-[22px] transition-colors',
          collapsed && 'justify-center',
          isActive ? 'bg-teal text-green' : 'text-white/60 hover:bg-white/5',
        )
      }
    >
      <Icon className="h-[18px] w-[18px] shrink-0" />
      {!collapsed && <span>{label}</span>}
    </NavLink>
  );
}
