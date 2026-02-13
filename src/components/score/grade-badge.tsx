'use client';

import type { Grade } from '@/lib/scorer/types';

const GRADE_COLORS: Record<Grade, string> = {
  'A+': 'bg-green-500/15 text-green-400 border-green-500/30',
  A: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  B: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  C: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  D: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  F: 'bg-red-500/15 text-red-400 border-red-500/30',
};

interface GradeBadgeProps {
  grade: Grade;
  size?: 'sm' | 'md' | 'lg';
}

export function GradeBadge({ grade, size = 'md' }: GradeBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border font-bold ${GRADE_COLORS[grade]} ${sizeClasses[size]}`}
    >
      {grade}
    </span>
  );
}
