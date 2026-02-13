'use client';

import { useRef, useEffect, useState } from 'react';
import type { Grade } from '@/lib/scorer/types';

function useAnimatedNumber(target: number) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const duration = 1200;
          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return { value, ref };
}

function getScoreColor(score: number): { stroke: string; glow: string; text: string } {
  if (score >= 81) return { stroke: '#22c55e', glow: 'rgba(34,197,94,0.4)', text: 'text-green-400' };
  if (score >= 61) return { stroke: '#06d6a0', glow: 'rgba(6,214,160,0.4)', text: 'text-emerald-400' };
  if (score >= 31) return { stroke: '#f59e0b', glow: 'rgba(245,158,11,0.4)', text: 'text-amber-400' };
  return { stroke: '#ef4444', glow: 'rgba(239,68,68,0.4)', text: 'text-red-400' };
}

interface ScoreGaugeProps {
  score: number;
  grade: Grade;
  size?: number;
}

export function ScoreGauge({ score, grade, size = 200 }: ScoreGaugeProps) {
  const animated = useAnimatedNumber(score);
  const colors = getScoreColor(score);

  const center = size / 2;
  const strokeWidth = size * 0.06;
  const radius = center - strokeWidth - 4;
  const circumference = 2 * Math.PI * radius;
  const progress = animated.value / 100;
  const dashOffset = circumference * (1 - progress);

  return (
    <div ref={animated.ref} className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-800"
        />
        {/* Progress arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{
            filter: `drop-shadow(0 0 8px ${colors.glow})`,
            transition: 'stroke-dashoffset 0.05s linear',
          }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-5xl font-bold tracking-tighter ${colors.text}`}>
          {animated.value}
        </span>
        <span className={`text-lg font-semibold ${colors.text} opacity-80`}>
          {grade}
        </span>
      </div>
    </div>
  );
}
