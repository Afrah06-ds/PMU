import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge(clsx('bg-white rounded-xl border border-slate-200/80 shadow-sm p-5', className))}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={twMerge(clsx('mb-4 pb-3 border-b border-slate-100', className))}>{children}</div>;
}

export function CardTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return <h3 className={twMerge(clsx('text-lg font-semibold text-slate-900 tracking-tight', className))}>{children}</h3>;
}

export function CardDescription({ className, children }: { className?: string; children: React.ReactNode }) {
  return <p className={twMerge(clsx('text-sm text-slate-500 mt-1', className))}>{children}</p>;
}
