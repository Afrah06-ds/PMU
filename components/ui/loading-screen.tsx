'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = 'Preparing your workspace' }: LoadingScreenProps) {
  return (
    <div className="pmu-loading-screen fixed inset-0 z-50 flex select-none flex-col items-center justify-center overflow-hidden bg-[#f7f8fc] p-6 text-slate-950">
      <div className="pmu-loading-grid absolute inset-0" aria-hidden="true" />
      <div className="absolute -left-40 top-1/3 h-80 w-80 rounded-full bg-indigo-200/20 blur-3xl" aria-hidden="true" />
      <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-cyan-200/20 blur-3xl" aria-hidden="true" />

      <div className="relative z-10 flex w-full max-w-xs flex-col items-center text-center">
        <div className="pmu-loading-mark mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-100 bg-white shadow-lg shadow-indigo-100/80">
          <span className="pmu-loading-core h-3 w-3 rounded-full bg-indigo-600" />
        </div>

        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.22em] text-indigo-600">PMIST QMS</p>
          <h1 className="font-poppins text-xl font-bold tracking-tight text-slate-900">
            PMIST Question Management System
          </h1>
        </div>

        <div className="mt-9 w-full">
          <div className="pmu-loading-track h-1 w-full overflow-hidden rounded-full bg-slate-200">
            <span className="pmu-loading-progress block h-full w-2/5 rounded-full bg-indigo-600" />
          </div>
          <p className="mt-3 text-xs font-medium text-slate-500">{message}</p>
        </div>

        <div className="mt-8 flex items-center gap-2 text-[11px] font-semibold text-slate-400">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          Secure institutional access
        </div>
      </div>

      <p className="absolute bottom-7 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        PMIST QMS V1 · Powered by Informatics
      </p>

      <style jsx global>{`
        @keyframes pmu-loading-progress {
          0% { transform: translateX(-140%); }
          100% { transform: translateX(300%); }
        }

        @keyframes pmu-loading-core {
          0%, 100% { transform: scale(0.75); box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.22); }
          50% { transform: scale(1); box-shadow: 0 0 0 12px rgba(79, 70, 229, 0.08); }
        }

        @keyframes pmu-loading-mark {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        .pmu-loading-grid {
          opacity: 0.42;
          background-image: linear-gradient(rgba(99, 102, 241, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.05) 1px, transparent 1px);
          background-size: 52px 52px;
          mask-image: linear-gradient(to bottom, black, transparent 85%);
        }

        .pmu-loading-mark { animation: pmu-loading-mark 3.5s ease-in-out infinite; }
        .pmu-loading-core { animation: pmu-loading-core 2.2s ease-in-out infinite; }
        .pmu-loading-progress { animation: pmu-loading-progress 1.8s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .pmu-loading-mark,
          .pmu-loading-core,
          .pmu-loading-progress {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}