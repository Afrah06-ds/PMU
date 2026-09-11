'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CourseOutcomesRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/courses');
  }, [router]);

  return (
    <div className="p-8 text-center text-slate-400 text-sm font-medium">
      Redirecting to Courses & Course Outcomes...
    </div>
  );
}
