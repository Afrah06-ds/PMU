'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  LayoutDashboard,
  FileQuestion,
  Wand2,
  FileText,
  Building2,
  BookOpen,
  Boxes,
  Target,
  GraduationCap,
  FileSpreadsheet,
  Users,
  ShieldCheck,
  LogOut
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function Sidebar() {
  const pathname = usePathname();
  const { user, isAdmin, logout } = useAuth();

  const mainNav = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Questions', href: '/question-bank', icon: FileQuestion },
    { name: 'Generate Paper', href: '/generate-paper', icon: Wand2 },
    { name: 'Generated Papers', href: '/generated-papers', icon: FileText },
  ];

  const academicNav = [
    { name: 'Departments', href: '/departments', icon: Building2 },
    { name: 'Courses', href: '/courses', icon: BookOpen },
    { name: 'Modules', href: '/modules', icon: Boxes },
    { name: 'Course Outcomes', href: '/course-outcomes', icon: Target },
    { name: 'K-Levels', href: '/k-levels', icon: GraduationCap },
  ];

  const adminNav = [
    { name: 'Faculty Management', href: '/faculty', icon: Users }
  ];

  const isActive = (path: string) => pathname === path || (path !== '/dashboard' && pathname?.startsWith(path));

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-screen border-r border-slate-800">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800 bg-slate-950/50">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="PMU Logo" className="w-9 h-9 rounded-lg object-contain bg-white shadow-md shadow-brand-500/20" />
          <div>
            <h1 className="font-bold text-white tracking-tight leading-none text-base font-poppins">PMIST EMS</h1>
            <p className="text-[11px] text-indigo-300 font-medium mt-0.5">Exam Management System</p>
          </div>
        </div>
      </div>

      {/* Profile Bar */}
      <div className="px-4 py-3 border-b border-slate-800 bg-slate-850/40">
        <div className="flex items-center justify-between">
          <div className="truncate pr-2">
            <p className="text-xs font-semibold text-slate-200 truncate">{user?.full_name || 'Administrator'}</p>
            <p className="text-[11px] text-slate-400 truncate">{user?.email || 'admin@pmu.edu'}</p>
          </div>
          <Badge variant={isAdmin ? 'primary' : 'info'} className="capitalize shrink-0">
            {isAdmin ? (
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-brand-400" /> Admin
              </span>
            ) : (
              'Faculty'
            )}
          </Badge>
        </div>
      </div>

      {/* Nav Content */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin">
        {/* Core Workflow */}
        <div>
          <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Core Workflow</p>
          <nav className="space-y-1">
            {mainNav.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-brand-600 text-white font-semibold shadow-sm shadow-brand-600/30'
                      : 'hover:bg-slate-800 hover:text-white text-slate-300'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Academic Setup & Management */}
        <div>
          <p className="px-3 text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-2">Academic Setup</p>
          <nav className="space-y-1">
            <Link
              href="/academic-setup"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/academic-setup')
                  ? 'bg-brand-600 text-white font-semibold shadow-sm shadow-brand-600/30'
                  : 'hover:bg-slate-800 hover:text-white text-slate-300'
              }`}
            >
              <Building2 className="w-4 h-4 text-indigo-400" />
              <span>Academic Setup</span>
            </Link>

            <Link
              href="/courses"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/courses')
                  ? 'bg-brand-600 text-white font-semibold shadow-sm shadow-brand-600/30'
                  : 'hover:bg-slate-800 hover:text-white text-slate-300'
              }`}
            >
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>Courses & Modules</span>
            </Link>

          </nav>
        </div>
      </div>

      {/* Logout */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/30">
        <button
          type="button"
          onClick={() => logout()}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
