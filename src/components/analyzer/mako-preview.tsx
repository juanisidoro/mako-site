'use client';

import { useTranslations } from 'next-intl';
import { CopyButton } from '@/components/copy-button';

function highlightMako(content: string) {
  const lines = content.split('\n');
  let inFrontmatter = false;
  let frontmatterCount = 0;

  return lines.map((line, i) => {
    // Track frontmatter delimiters
    if (line.trim() === '---') {
      frontmatterCount++;
      inFrontmatter = frontmatterCount === 1;
      return (
        <span key={i} className="text-slate-500">
          {line}
          {'\n'}
        </span>
      );
    }

    // Inside frontmatter: highlight YAML keys and values
    if (inFrontmatter) {
      const match = line.match(/^(\s*)([\w_-]+)(:)(.*)/);
      if (match) {
        const [, indent, key, colon, value] = match;
        return (
          <span key={i}>
            {indent}
            <span className="text-emerald-400">{key}</span>
            <span className="text-slate-500">{colon}</span>
            <span className="text-sky-400">{value}</span>
            {'\n'}
          </span>
        );
      }
      // Array items or continuation values
      if (line.trim().startsWith('-')) {
        return (
          <span key={i} className="text-sky-400">
            {line}
            {'\n'}
          </span>
        );
      }
      return (
        <span key={i} className="text-slate-300">
          {line}
          {'\n'}
        </span>
      );
    }

    // Body content: comments
    if (line.trim().startsWith('#')) {
      return (
        <span key={i} className="text-slate-500">
          {line}
          {'\n'}
        </span>
      );
    }

    // Body: headings (markdown)
    const headingMatch = line.match(/^(#{1,6}\s)(.*)/);
    if (headingMatch) {
      return (
        <span key={i}>
          <span className="text-emerald-400">{headingMatch[1]}</span>
          <span className="text-white font-medium">{headingMatch[2]}</span>
          {'\n'}
        </span>
      );
    }

    // Body: bold text
    if (line.includes('**')) {
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <span key={i}>
          {parts.map((part, j) =>
            part.startsWith('**') && part.endsWith('**') ? (
              <span key={j} className="text-white font-medium">
                {part}
              </span>
            ) : (
              <span key={j} className="text-slate-300">
                {part}
              </span>
            )
          )}
          {'\n'}
        </span>
      );
    }

    // Default body text
    return (
      <span key={i} className="text-slate-300">
        {line}
        {'\n'}
      </span>
    );
  });
}

export function MakoPreview({ makoContent }: { makoContent: string }) {
  const t = useTranslations('analyzer');

  return (
    <div className="rounded-xl border border-slate-800 bg-[#0a0f1a] overflow-hidden">
      {/* Mac-style title bar */}
      <div className="flex items-center justify-between border-b border-slate-800/50 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <div className="h-3 w-3 rounded-full bg-[#28c840]" />
          <span className="ml-3 text-xs text-slate-500 font-mono">output.mako</span>
        </div>
        <CopyButton text={makoContent} />
      </div>

      {/* Code content */}
      <div className="max-h-[32rem] overflow-auto p-5">
        <pre className="font-mono text-[0.8125rem] leading-relaxed whitespace-pre-wrap break-words">
          <code>{highlightMako(makoContent)}</code>
        </pre>
      </div>

      {/* Footer note */}
      <div className="border-t border-slate-800/50 px-4 py-2.5">
        <p className="text-xs text-slate-500 flex items-center gap-1.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-3.5 w-3.5"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
              clipRule="evenodd"
            />
          </svg>
          {t('results.generated_by')} &mdash; {t('results.not_ai')}
        </p>
      </div>
    </div>
  );
}
