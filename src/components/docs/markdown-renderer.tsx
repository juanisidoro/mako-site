'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import type { Components } from 'react-markdown';
import { isAsciiPipeline, PipelineDiagram } from './pipeline-diagram';

function extractTextFromChildren(children: React.ReactNode): string {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) return children.map(extractTextFromChildren).join('');
  if (children && typeof children === 'object' && 'props' in children) {
    return extractTextFromChildren((children as React.ReactElement<{ children?: React.ReactNode }>).props.children);
  }
  return '';
}

function LinkIcon() {
  return (
    <svg className="inline-block h-4 w-4 ml-1 opacity-0 group-hover:opacity-50 transition-opacity" viewBox="0 0 16 16" fill="currentColor">
      <path d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z" />
    </svg>
  );
}

const components: Components = {
  h1: ({ children, id, ...props }) => (
    <h1 id={id} className="text-3xl font-bold text-white mb-6 scroll-mt-24" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, id, ...props }) => (
    <h2 id={id} className="group text-xl font-bold text-white mt-12 mb-4 pb-2 border-b border-slate-800 scroll-mt-24" {...props}>
      <a href={`#${id}`} className="no-underline text-inherit">
        {children}
        <LinkIcon />
      </a>
    </h2>
  ),
  h3: ({ children, id, ...props }) => (
    <h3 id={id} className="group text-lg font-semibold text-white mt-8 mb-3 scroll-mt-24" {...props}>
      <a href={`#${id}`} className="no-underline text-inherit">
        {children}
        <LinkIcon />
      </a>
    </h3>
  ),
  h4: ({ children, id, ...props }) => (
    <h4 id={id} className="group text-base font-semibold text-white mt-6 mb-2 scroll-mt-24" {...props}>
      {children}
    </h4>
  ),
  p: ({ children, ...props }) => (
    <p className="text-slate-300 leading-7 mb-4" {...props}>
      {children}
    </p>
  ),
  a: ({ href, children, ...props }) => {
    const isExternal = href?.startsWith('http');
    return (
      <a
        href={href}
        className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition-colors"
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...props}
      >
        {children}
      </a>
    );
  },
  strong: ({ children, ...props }) => (
    <strong className="text-white font-semibold" {...props}>{children}</strong>
  ),
  em: ({ children, ...props }) => (
    <em className="text-slate-200" {...props}>{children}</em>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote className="border-l-2 border-emerald-500/50 pl-4 my-4 text-slate-400 italic" {...props}>
      {children}
    </blockquote>
  ),
  ul: ({ children, ...props }) => (
    <ul className="list-disc list-outside pl-5 mb-4 space-y-1 text-slate-300" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="list-decimal list-outside pl-5 mb-4 space-y-1 text-slate-300" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="leading-7" {...props}>{children}</li>
  ),
  code: ({ className, children, ...props }) => {
    const isBlock = className?.includes('language-');
    if (isBlock) {
      return (
        <code className={`${className} text-[0.8125rem] leading-relaxed`} {...props}>
          {children}
        </code>
      );
    }
    return (
      <code className="bg-slate-800 text-emerald-300 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
        {children}
      </code>
    );
  },
  pre: ({ children, ...props }) => {
    // Extract text content to check for ASCII pipeline diagrams
    const text = extractTextFromChildren(children);
    if (text && isAsciiPipeline(text)) {
      return <PipelineDiagram code={text} />;
    }
    return (
      <pre className="bg-[#0a0f1a] border border-slate-800 rounded-lg p-4 mb-4 overflow-x-auto" {...props}>
        {children}
      </pre>
    );
  },
  table: ({ children, ...props }) => (
    <div className="overflow-x-auto mb-4">
      <table className="w-full text-sm border-collapse" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead className="border-b border-slate-700" {...props}>{children}</thead>
  ),
  th: ({ children, ...props }) => (
    <th className="text-left text-white font-semibold px-3 py-2 border-b border-slate-700" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="text-slate-300 px-3 py-2 border-b border-slate-800/50" {...props}>
      {children}
    </td>
  ),
  hr: () => (
    <hr className="border-slate-800 my-8" />
  ),
};

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="docs-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeHighlight]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
