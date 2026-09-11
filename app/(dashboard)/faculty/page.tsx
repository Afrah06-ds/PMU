'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FacultyRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/academic-setup');
  }, [router]);

  return (
    <div className="p-8 text-center text-slate-400 text-sm font-medium">
      Redirecting to Academic Setup...
    </div>
  );
}
