'use client';

import { useState } from 'react';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export function CodeBlock({ code, language, filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="group relative">
      {filename && (
        <div className="flex items-center gap-2 rounded-t-lg border border-b-0 border-zinc-800 bg-zinc-900 px-4 py-2 text-xs text-zinc-500">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
            <path d="M3.5 2A1.5 1.5 0 002 3.5v9A1.5 1.5 0 003.5 14h9a1.5 1.5 0 001.5-1.5v-7A1.5 1.5 0 0012.5 5H7.621a1.5 1.5 0 01-1.06-.44L5.439 3.44A1.5 1.5 0 004.378 3H3.5z" />
          </svg>
          {filename}
          {language && <span className="ml-auto text-zinc-600">{language}</span>}
        </div>
      )}
      <div className={`code-block ${filename ? '!rounded-t-none !border-t-0' : ''}`}>
        <button
          onClick={handleCopy}
          className="absolute right-2 top-2 rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1 text-xs text-zinc-400 opacity-0 transition hover:bg-zinc-700 hover:text-white group-hover:opacity-100"
          aria-label="Copy code"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <pre className="!p-4 !text-sm !leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
