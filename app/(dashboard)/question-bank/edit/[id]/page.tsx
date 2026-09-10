'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { QuestionForm } from '@/components/question-bank/question-form';

export default function EditQuestionPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  return <QuestionForm editId={id} />;
}
