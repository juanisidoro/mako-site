'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents({ headings }: { headings: TocItem[] }) {
  const t = useTranslations('docs');
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0px -80% 0px', threshold: 0 }
    );

    for (const heading of headings) {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <div className="w-56 shrink-0 hidden xl:block">
      <div className="sticky top-20">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
          {t('on_this_page')}
        </p>
        <nav className="space-y-1 max-h-[calc(100vh-8rem)] overflow-y-auto">
          {headings.map((heading) => (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              className={`block text-sm leading-6 transition-colors ${
                heading.level === 3 ? 'pl-3' : ''
              } ${
                activeId === heading.id
                  ? 'text-emerald-400 font-medium'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {heading.text}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
