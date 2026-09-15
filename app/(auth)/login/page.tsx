'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { ShieldCheck, UserCheck, Lock, Mail, ArrowRight, Eye, EyeOff, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('admin@pmu.edu');
  const [password, setPassword] = useState('admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      router.push('/dashboard');
    } else {
      setErrorMsg(res.error || 'Invalid authentication credentials');
    }
  };

  const handleQuickLogin = (role: 'admin' | 'faculty') => {
    if (role === 'admin') {
      setEmail('admin@pmu.edu');
      setPassword('admin@123');
    } else {
      setEmail('faculty@pmu.edu');
      setPassword('faculty@123');
    }
  };

  const isSelectedAdmin = email.toLowerCase().includes('admin');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Subtle Top Indigo Accent Bar */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-700 z-30" />

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-md w-full mx-auto z-10 py-6">
        
        {/* Branding Header */}
        <div className="text-center space-y-3 mb-8 w-full flex flex-col items-center">
          <img 
            src="/logo.jpg" 
            alt="PMU Logo" 
            className="w-20 h-20 rounded-2xl object-contain bg-white shadow-lg shadow-indigo-600/30 border border-indigo-500/20" 
          />

          <div className="space-y-1">
            {/* Line 1 */}
            <h1 className="font-poppins font-bold text-slate-900 text-xl sm:text-2xl tracking-tight">
              PMIST EMS - Examination Management System
            </h1>

            {/* Line 2 */}
            <p className="font-sans text-xs font-semibold text-indigo-600 tracking-wider uppercase">
              Powered by Informatics
            </p>
          </div>
        </div>

        {/* Minimal White Card Portal */}
        <div className="w-full bg-white border border-slate-200/80 shadow-xl shadow-slate-200/60 rounded-2xl p-6 sm:p-8 space-y-6">
          
          {/* Micro-tabs Role Selector */}
          <div className="space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Institutional Role Presets
            </p>
            <div className="grid grid-cols-2 gap-1.5 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/60">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isSelectedAdmin
                    ? 'bg-white text-indigo-600 shadow-xs border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Admin Account</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('faculty')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  !isSelectedAdmin
                    ? 'bg-white text-indigo-600 shadow-xs border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Faculty Account</span>
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200/80 text-red-600 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Login Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Institutional Email
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-50/50 border border-slate-300 rounded-lg text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 focus:bg-white transition-all font-medium"
                  placeholder="admin@pmu.edu"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 bg-slate-50/50 border border-slate-300 rounded-lg text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 focus:bg-white transition-all font-medium"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg shadow-sm shadow-indigo-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2 text-sm"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to System</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          {/* Quick Preset Hint */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1 font-medium">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Institutional Portal</span>
            </span>
            <span className="text-[11px] text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded-full">
              SaaS v2.0
            </span>
          </div>
        </div>
      </div>

      {/* Institutional Footer */}
      <footer className="text-center z-10 py-2 text-[11px] text-slate-500 font-medium space-y-1">
        <p>PMIST Examination Management SaaS Platform</p>
        <p className="text-slate-400">Powered by Informatics • All Rights Reserved</p>
      </footer>
    </div>
  );
}
