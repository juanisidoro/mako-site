'use client';

import { CopyButton } from '@/components/copy-button';

export function HeadersPreview({
  headers,
}: {
  headers: Record<string, string>;
}) {
  const headerEntries = Object.entries(headers);
  const headersText = headerEntries
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');

  return (
    <div className="rounded-xl border border-slate-800 bg-[#0a0f1a] overflow-hidden">
      {/* Mac-style title bar */}
      <div className="flex items-center justify-between border-b border-slate-800/50 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <div className="h-3 w-3 rounded-full bg-[#28c840]" />
          <span className="ml-3 text-xs text-slate-500 font-mono">
            HTTP Headers
          </span>
        </div>
        <CopyButton text={headersText} />
      </div>

      {/* Header content */}
      <div className="max-h-[28rem] overflow-auto p-5">
        <pre className="font-mono text-[0.8125rem] leading-relaxed">
          <code>
            {headerEntries.map(([key, value], i) => (
              <span key={i} className="block">
                <span className="text-emerald-400">{key}</span>
                <span className="text-slate-500">: </span>
                <span className="text-white break-all">{value}</span>
              </span>
            ))}
            {headerEntries.length === 0 && (
              <span className="text-slate-500">No headers available</span>
            )}
          </code>
        </pre>
      </div>
    </div>
  );
}
