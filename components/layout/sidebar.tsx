'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  Archive,
  ArrowRight,
  BookOpen,
  FileQuestion,
  House,
  LibraryBig,
  LogOut,
  ShieldCheck,
  SlidersHorizontal,
  WandSparkles,
  X,
} from 'lucide-react';

type NavItem = {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const workflowNav: NavItem[] = [
  { name: 'Overview', href: '/dashboard', icon: House },
  { name: 'Question Library', href: '/question-bank', icon: LibraryBig },
  { name: 'Paper Studio', href: '/generate-paper', icon: WandSparkles },
  { name: 'Paper Archive', href: '/generated-papers', icon: Archive },
];

const academicNav: NavItem[] = [
  { name: 'Academic Setup', href: '/academic-setup', icon: SlidersHorizontal },
  { name: 'Courses & Modules', href: '/courses', icon: BookOpen },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [isSignOutOpen, setIsSignOutOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const isActive = (path: string) => pathname === path || (path !== '/dashboard' && pathname?.startsWith(path));
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsSignOutOpen(false);
    };

    if (isSignOutOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => document.removeEventListener('keydown', handleEscape);
  }, [isSignOutOpen]);

  const confirmSignOut = async () => {
    setIsSigningOut(true);

    if (typeof window !== 'undefined') {
      Object.keys(localStorage)
        .filter((key) => key.startsWith('pmu_'))
        .forEach((key) => localStorage.removeItem(key));
      sessionStorage.clear();
    }

    await logout();
  };

  const renderNav = (items: NavItem[]) => (
    <nav className="space-y-1">
      {items.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-all ${
              active
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {active && <span className="absolute bottom-2 left-0 top-2 w-0.5 rounded-full bg-indigo-600" />}
            <Icon className={`h-[17px] w-[17px] transition-colors ${active ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
            <span>{item.name}</span>
            {item.name === 'Paper Studio' && (
              <ArrowRight className={`ml-auto h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 ${active ? 'text-indigo-500' : 'text-slate-300'}`} />
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <aside className="flex min-h-screen w-[224px] shrink-0 flex-col border-r border-slate-200/80 bg-white text-slate-700">
        <div className="border-b border-slate-100 px-6 py-5">
          <Link href="/dashboard" className="flex flex-col items-start gap-2" aria-label="PMIST QMS dashboard">
            <span className="flex h-12 w-full items-center justify-start overflow-hidden">
              <img src="/logo.png" alt="PMIST QMS" className="h-full w-[160px] object-contain object-left" />
            </span>
            <span className="font-poppins text-lg font-bold leading-none tracking-tight text-slate-900">
              PMIST <span className="text-indigo-600">QMS</span>
            </span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin">
          <div>
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Workspace</p>
            {renderNav(workflowNav)}
          </div>

          <div className="mt-7">
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Academic structure</p>
            {renderNav(academicNav)}
          </div>

        </div>

        <div className="border-t border-slate-100 p-4">
          <div className="mb-3 flex items-center gap-2 px-2 text-[10px] font-semibold text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            Secure institutional access
          </div>
          <button
            type="button"
            onClick={() => setIsSignOutOpen(true)}
            className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-[17px] w-[17px] text-slate-400 transition-colors group-hover:text-red-500" />
            Sign out
          </button>
        </div>
      </aside>

      {isSignOutOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/25 p-6 backdrop-blur-[2px]"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsSignOutOpen(false);
          }}
        >
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/15" role="dialog" aria-modal="true" aria-labelledby="sign-out-title">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <LogOut className="h-5 w-5" />
                </div>
                <h2 id="sign-out-title" className="font-poppins text-lg font-bold text-slate-900">Sign out of PMIST QMS?</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">Your local session data and temporary paper data will be cleared from this browser.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsSignOutOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close sign out dialog"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setIsSignOutOpen(false)}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Stay signed in
              </button>
              <button
                type="button"
                onClick={confirmSignOut}
                disabled={isSigningOut}
                className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSigningOut ? 'Signing out...' : 'Clear & sign out'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}