import { NavLink, Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'text-sm font-medium transition-colors hover:text-blue-700',
    isActive ? 'text-blue-700' : 'text-slate-600',
  );

export function Layout() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <NavLink to="/sites" className="text-xl font-semibold text-slate-900">
            Журнал работ
          </NavLink>
          <nav className="flex flex-wrap gap-6">
            <NavLink to="/sites" className={navLinkClass}>
              Объекты
            </NavLink>
            <NavLink to="/employees" className={navLinkClass}>
              Сотрудники
            </NavLink>
            <NavLink to="/work-types" className={navLinkClass}>
              Виды работ
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
