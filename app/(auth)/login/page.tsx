'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('admin@pmu.edu');
  const [password, setPassword] = useState('admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      router.push('/dashboard');
    } else {
      setErrorMsg(result.error || 'Unable to authenticate with these credentials.');
    }
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#f7f8fc] text-slate-950 lg:h-screen lg:overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(99,102,241,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.035)_1px,transparent_1px)] bg-[size:52px_52px]" />
      <div className="absolute -left-40 top-1/3 h-80 w-80 rounded-full bg-indigo-200/20 blur-3xl" />
      <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-cyan-200/20 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-5 sm:px-10 lg:h-full lg:min-h-0 lg:px-16 lg:py-6">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-indigo-100 bg-white shadow-sm shadow-indigo-100">
              <img src="/logo.png" alt="PMIST QMS" className="h-full w-full object-contain" />
            </div>
            <div>
              <p className="font-poppins text-sm font-bold tracking-tight text-slate-900">PMIST QMS</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Question management</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 text-xs font-semibold text-slate-400 sm:flex">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            Secure institutional access
          </div>
        </header>

        <section className="grid min-h-0 flex-1 items-center gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-20 lg:py-6">
          <div className="hidden max-w-xl lg:block">
            <div className="mb-8 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
              <span className="h-px w-10 bg-indigo-500" />
              PMIST Question Management System
            </div>
            <h1 className="max-w-2xl font-poppins text-5xl font-bold leading-[1.08] tracking-tight text-slate-950 xl:text-6xl">
              Manage your question bank.
            </h1>
            <p className="mt-7 max-w-lg text-base leading-7 text-slate-500">
              Create, classify, and prepare questions for examinations.
            </p>
            <div className="mt-10 flex items-center gap-6 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500" />Structured academic data</span>
              <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-indigo-500" />Ready when you are</span>
            </div>
          </div>

          <div className="w-full rounded-2xl border border-slate-200/80 bg-white/85 p-7 shadow-xl shadow-slate-200/50 backdrop-blur sm:p-9">
            <div className="mb-8">
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-600">Welcome back</p>
              <h2 className="font-poppins text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl">
                Sign in to your workspace.
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Manage academic setup, question banks, and examination papers from one place.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMsg && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600" role="alert">
                  {errorMsg}
                </div>
              )}

              <div>
                <label htmlFor="email" className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
                  Institutional email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="name@institution.edu"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium text-slate-900 shadow-sm shadow-slate-200/40 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="password" className="block text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
                    Password
                  </label>
                  <span className="text-[11px] font-semibold text-slate-400">Protected access</span>
                </div>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 text-sm font-medium text-slate-900 shadow-sm shadow-slate-200/40 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Signing in...' : 'Sign in to PMIST QMS'}
                {!loading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
              </button>
            </form>

            <div className="mt-8 flex items-center justify-between border-t border-slate-200/80 pt-5 text-[11px] font-medium text-slate-400">
              <span>PMIST QMS V1</span>
              <span>Powered by Informatics</span>
            </div>
          </div>
        </section>

        <footer className="text-center text-[11px] font-medium text-slate-400">
          For authorized institutional users only
        </footer>
      </div>
    </main>
  );
}