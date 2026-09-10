'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Database, Copy, CheckCircle2, ShieldCheck, Key } from 'lucide-react';

export default function SettingsPage() {
  const [copied, setCopied] = useState(false);

  const handleCopyEnv = () => {
    const envText = `# Supabase Credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# App Credentials
Admin Account: admin@pmu.edu
Password: admin@123`;
    navigator.clipboard.writeText(envText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-brand-600" />
          System Settings & Database Config
        </h1>
        <p className="text-sm text-slate-500 mt-1">Configure environment variables and view Supabase PostgreSQL migration scripts.</p>
      </div>

      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-brand-600" />
            <h3 className="font-bold text-slate-900">Supabase Database Connection</h3>
          </div>
          <Badge variant="success">Normalized Schema Ready</Badge>
        </div>

        <div className="space-y-3 text-xs text-slate-700">
          <p><span className="font-bold">Database Engine:</span> Supabase PostgreSQL 15</p>
          <p><span className="font-bold">Migration Files Location:</span> <code className="bg-slate-100 px-2 py-0.5 rounded">supabase/migrations/</code></p>
          <p><span className="font-bold">Seed Data File:</span> <code className="bg-slate-100 px-2 py-0.5 rounded">supabase/seed.sql</code></p>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">Configured Admin: admin@pmu.edu</span>
          <Button variant="outline" size="sm" onClick={handleCopyEnv}>
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Env Setup' : 'Copy Env Template'}</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}
