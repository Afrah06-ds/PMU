'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, House, RefreshCw, WifiOff } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  const retry = () => {
    window.location.reload();
  };

  return (
    <main className="pmu-error-page min-h-screen overflow-hidden bg-slate-50 text-slate-900">
      <div className="pmu-error-grid" aria-hidden="true" />
      <div className="pmu-error-glow pmu-error-glow-one" aria-hidden="true" />
      <div className="pmu-error-glow pmu-error-glow-two" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-6 sm:px-10 lg:px-12">
        <header className="flex items-center justify-between">
          <Link href="/login" className="flex items-center gap-3" aria-label="PMIST QMS sign in">
            <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-indigo-100 bg-white shadow-sm">
              <img src="/logo.png" alt="" className="h-full w-full object-contain" />
            </span>
            <span className="hidden text-sm font-bold tracking-tight text-slate-800 sm:block">
              PMIST QMS
              <span className="ml-2 font-medium text-slate-400">/ Question Management</span>
            </span>
          </Link>

          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
            <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_0_4px_rgba(251,191,36,0.12)]" />
            System notice
          </div>
        </header>

        <section className="flex flex-1 items-center justify-center py-14 lg:py-20">
          <div className="max-w-3xl text-center">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-600 shadow-sm backdrop-blur">
              <WifiOff className="h-3.5 w-3.5" />
              Network error · 404
            </div>

            <h1 className="font-poppins text-5xl font-bold leading-[1.05] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              This page
              <span className="block text-indigo-600">lost the signal.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-lg text-base leading-7 text-slate-500 sm:text-lg">
              The route you requested is unavailable or may have moved. Check the address, then try again or return to your workspace.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={retry}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <RefreshCw className="h-4 w-4" />
                Retry connection
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white/80 px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Go back
              </button>
            </div>
          </div>
        </section>

        <footer className="flex flex-col gap-4 border-t border-slate-200/80 py-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>PMIST Question Management System V1</span>
          <Link href="/login" className="inline-flex items-center gap-1.5 font-semibold text-slate-500 transition hover:text-indigo-600">
            <House className="h-3.5 w-3.5" />
            Return to sign in
          </Link>
        </footer>
      </div>
    </main>
  );
}