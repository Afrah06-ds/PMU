'use client';

import React, { useState, useEffect } from 'react';
import { KLevel } from '@/types';
import { MasterDataService } from '@/services/master-data.service';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap } from 'lucide-react';

export default function KLevelsPage() {
  const [klevels, setKlevels] = useState<KLevel[]>([]);

  useEffect(() => {
    MasterDataService.getKLevels().then(setKlevels);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-brand-600" />
          K-Levels Framework (Bloom's Revised Taxonomy)
        </h1>
        <p className="text-sm text-slate-500 mt-1">Cognitive complexity levels for question classification and paper balancing.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {klevels.map(k => (
          <Card key={k.id} className="hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between">
              <Badge variant="primary" className="font-mono text-base px-3 py-1">
                {k.code}
              </Badge>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{k.name}</span>
            </div>
            <p className="text-xs text-slate-600 mt-3 leading-relaxed">{k.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
