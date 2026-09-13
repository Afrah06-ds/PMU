'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, CheckSquare, FileText, Settings, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Syllabus', href: '/syllabus', icon: BookOpen },
  { name: 'Tracker', href: '/tracker', icon: CheckSquare },
  { name: 'Notes', href: '/notes', icon: FileText },
];

export function Sidebar({ mobileOpen, setMobileOpen }: SidebarProps) {
  const pathname = usePathname();

  const isCurrent = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <aside
      className={clsx(
        'w-64 border-r border-border bg-card flex flex-col justify-between select-none transition-transform duration-200 z-30',
        'fixed inset-y-0 left-0 lg:static lg:translate-x-0',
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}
    >
      <div>
        {/* Brand Header */}
        <div className="h-14 px-5 flex items-center border-b border-border gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-black text-sm shadow-sm">
            T
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm tracking-tight text-foreground flex items-center gap-1.5">
              TRACKER PRO
              <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-accent text-accent-foreground font-mono">
                v1.0
              </span>
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const active = isCurrent(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen && setMobileOpen(false)}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  active
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                )}
              >
                <Icon className={clsx('w-4 h-4', active ? 'text-primary' : 'text-muted-foreground')} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Settings */}
      <div className="p-3 border-t border-border">
        <Link
          href="/settings"
          onClick={() => setMobileOpen && setMobileOpen(false)}
          className={clsx(
            'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
            isCurrent('/settings')
              ? 'bg-primary/10 text-primary font-semibold'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
          )}
        >
          <Settings className="w-4 h-4 text-muted-foreground" />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}
