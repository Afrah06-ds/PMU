'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Plus, Wand2, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function TopHeader() {
  const pathname = usePathname();
  const { user, isAdmin, logout } = useAuth();

  const getBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 0) return [{ name: 'Dashboard', href: '/dashboard' }];

    return segments.map((seg, idx) => {
      const href = '/' + segments.slice(0, idx + 1).join('/');
      const name = seg.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      return { name, href };
    });
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-indigo-600 font-bold font-poppins">PMIST EMS</span>
        <span className="text-slate-300">/</span>
        {breadcrumbs.map((b, idx) => (
          <React.Fragment key={b.href}>
            {idx > 0 && <span className="text-slate-300">/</span>}
            <Link
              href={b.href}
              className={`font-medium capitalize ${
                idx === breadcrumbs.length - 1
                  ? 'text-slate-900 font-semibold font-poppins'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {b.name}
            </Link>
          </React.Fragment>
        ))}
      </div>

      {/* Actions & User Profile */}
      <div className="flex items-center gap-3">
        <Link href="/generate-paper">
          <Button variant="primary" size="sm">
            <Wand2 className="w-4 h-4" />
            <span className="hidden sm:inline">Generate Paper</span>
          </Button>
        </Link>

        {/* Vertical Divider */}
        <div className="h-6 w-px bg-slate-200 mx-1" />

        {/* User Badge & Sign Out Button */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-lg p-1 pr-1.5">
          <div className="w-7 h-7 rounded-md bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
            {user?.full_name?.charAt(0) || 'U'}
          </div>
          <div className="hidden md:block text-left text-xs pr-1">
            <p className="font-semibold text-slate-900 leading-none truncate max-w-[120px]">
              {user?.full_name || 'User'}
            </p>
            <p className="text-[10px] text-slate-500 capitalize leading-tight mt-0.5">
              {user?.role || 'faculty'}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => logout()}
            title="Sign Out"
            className="h-7 px-2 text-slate-600 hover:text-red-600 hover:bg-red-50 text-xs font-semibold cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 mr-1" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
