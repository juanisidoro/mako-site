import fs from 'fs';
import path from 'path';

export interface DocHeading {
  id: string;
  text: string;
  level: number;
}

export interface DocPage {
  slug: string;
  title: string;
  description: string;
  content: string;
  headings: DocHeading[];
}

const SPEC_DIR = path.join(process.cwd(), 'content', 'spec');

const DOCS: Record<string, { file: string; title: string; description: string }> = {
  spec: {
    file: 'spec.md',
    title: 'MAKO Specification v0.1.0',
    description: 'The full MAKO protocol specification: file format, content types, frontmatter schema, HTTP headers, and conformance levels.',
  },
  cef: {
    file: 'cef.md',
    title: 'CEF — Compact Embedding Format',
    description: 'Standard method for compressing semantic embedding vectors for HTTP header transport.',
  },
  headers: {
    file: 'headers.md',
    title: 'HTTP Headers Reference',
    description: 'Complete reference for MAKO request and response HTTP headers.',
  },
  examples: {
    file: '__examples__',
    title: 'Examples',
    description: 'Real-world MAKO file examples: product, article, and documentation pages.',
  },
};

const EXAMPLES = ['product.mako.md', 'article.mako.md', 'docs.mako.md'];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function extractHeadings(markdown: string): DocHeading[] {
  const headings: DocHeading[] = [];
  const lines = markdown.split('\n');
  let inCodeBlock = false;

  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (match) {
      const text = match[2].replace(/\*\*/g, '').trim();
      headings.push({
        id: slugify(text),
        text,
        level: match[1].length,
      });
    }
  }

  return headings;
}

function buildExamplesContent(): string {
  const parts: string[] = ['# Examples\n\nReal-world MAKO file examples showing the protocol in action.\n'];

  for (const filename of EXAMPLES) {
    const filePath = path.join(SPEC_DIR, 'examples', filename);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const label = filename.replace('.mako.md', '');
    const title = label.charAt(0).toUpperCase() + label.slice(1);

    parts.push(`## ${title} Example\n`);
    parts.push('```yaml');
    parts.push(raw.trim());
    parts.push('```\n');
  }

  return parts.join('\n');
}

export function getDocSlugs(): string[] {
  return Object.keys(DOCS);
}

export function getDocMeta(slug: string) {
  return DOCS[slug] ?? null;
}

export function getAllDocsMeta() {
  return Object.entries(DOCS).map(([slug, meta]) => ({ slug, ...meta }));
}

export function getDocPage(slug: string): DocPage | null {
  const meta = DOCS[slug];
  if (!meta) return null;

  let content: string;

  if (meta.file === '__examples__') {
    content = buildExamplesContent();
  } else {
    const filePath = path.join(SPEC_DIR, meta.file);
    if (!fs.existsSync(filePath)) return null;
    content = fs.readFileSync(filePath, 'utf-8');
  }

  const headings = extractHeadings(content);

  return {
    slug,
    title: meta.title,
    description: meta.description,
    content,
    headings,
  };
}
