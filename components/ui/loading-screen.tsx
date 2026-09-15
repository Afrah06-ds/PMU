'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message }: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-6 select-none overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Card Container */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-sm w-full space-y-6">
        
        {/* Animated Logo Container */}
        <div className="relative flex items-center justify-center">
          {/* Outer Pulsing Aura */}
          <div className="absolute w-24 h-24 rounded-3xl bg-indigo-600/20 animate-ping duration-1000" />
          <div className="absolute w-20 h-20 rounded-2xl bg-indigo-500/30 blur-md animate-pulse" />
          
          {/* Main Logo Badge */}
          <div className="relative w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-xl shadow-indigo-600/40 border border-indigo-400/30 overflow-hidden">
            <img src="/logo.png" alt="PMU Logo" className="w-full h-full object-contain" />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-2">
          {/* Line 1 */}
          <h1 className="font-poppins font-semibold text-white text-lg md:text-xl tracking-tight">
            PMIST EMS - Examination Management System
          </h1>

          {/* Line 2 */}
          <p className="font-sans text-xs md:text-sm font-medium text-indigo-300 tracking-wide uppercase">
            Powered by Informatics
          </p>
        </div>

        {/* Super Buffer Progress Bar */}
        <div className="w-full max-w-[220px] space-y-2 pt-2">
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden relative">
            <div className="h-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-indigo-600 rounded-full w-1/2 animate-pulse relative shadow-sm shadow-indigo-500" 
                 style={{
                   animation: 'bufferProgress 1.8s ease-in-out infinite'
                 }}
            />
          </div>
          {message && (
            <p className="text-[11px] text-slate-400 font-medium animate-pulse">
              {message}
            </p>
          )}
        </div>

        {/* Security / System Footer Badge */}
        <div className="pt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span>Secured Institutional SaaS Environment</span>
        </div>
      </div>

      {/* Inline Keyframe Animation CSS */}
      <style jsx global>{`
        @keyframes bufferProgress {
          0% {
            transform: translateX(-100%) scaleX(0.2);
          }
          50% {
            transform: translateX(50%) scaleX(0.8);
          }
          100% {
            transform: translateX(200%) scaleX(0.2);
          }
        }
      `}</style>
    </div>
  );
}
