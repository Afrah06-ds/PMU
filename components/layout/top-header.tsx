'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Plus, Wand2, Search, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function TopHeader() {
  const pathname = usePathname();

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
        <span className="text-slate-400 font-medium">PMU</span>
        <span className="text-slate-300">/</span>
        {breadcrumbs.map((b, idx) => (
          <React.Fragment key={b.href}>
            {idx > 0 && <span className="text-slate-300">/</span>}
            <Link
              href={b.href}
              className={`font-medium capitalize ${
                idx === breadcrumbs.length - 1
                  ? 'text-slate-900 font-semibold'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {b.name}
            </Link>
          </React.Fragment>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Link href="/question-bank/add">
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4" />
            <span>Add Question</span>
          </Button>
        </Link>
        <Link href="/generate-paper">
          <Button variant="primary" size="sm">
            <Wand2 className="w-4 h-4" />
            <span>Generate Paper</span>
          </Button>
        </Link>
      </div>
    </header>
  );
}
