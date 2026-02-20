#!/usr/bin/env node
/**
 * Pre-build script: generates static cover images for all blog posts.
 * Uses Satori (JSX→SVG) + resvg (SVG→PNG) — same quality as next/og.
 *
 * Run: node scripts/generate-covers.mjs
 * Output: public/covers/{slug}.png
 *
 * Generates covers for Latin-script locales (en, es, pt, fr, de).
 * Chinese (zh) and Japanese (ja) reuse the English cover.
 */
import fs from 'fs';
import path from 'path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import yaml from 'js-yaml';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');
const OUT_DIR = path.join(process.cwd(), 'public', 'covers');
const FONT_DIR = path.join(process.cwd(), 'scripts', 'fonts');
const LOCALES = ['en', 'es', 'pt', 'fr', 'de'];
const DEFAULT_LOCALE = 'en';
const WIDTH = 1200;
const HEIGHT = 630;

// ---------------------------------------------------------------------------
// Satori element helper — h(type, props, ...children)
// ---------------------------------------------------------------------------

function h(type, props = {}, ...children) {
  const flat = children.flat().filter((c) => c != null && c !== false);
  return {
    type,
    props: {
      ...props,
      children:
        flat.length === 0 ? undefined : flat.length === 1 ? flat[0] : flat,
    },
  };
}

// ---------------------------------------------------------------------------
// Theme definitions
// ---------------------------------------------------------------------------

const THEMES = {
  announcement: {
    accent: '#06d6a0',
    gradient:
      'radial-gradient(ellipse at 20% 20%, rgba(6,214,160,0.20) 0%, transparent 55%)',
    icon: '\u2726', // ✦
    label: 'Announcement',
  },
  checklist: {
    accent: '#8b5cf6',
    gradient:
      'radial-gradient(ellipse at 80% 30%, rgba(139,92,246,0.16) 0%, transparent 55%)',
    icon: '\u2713', // ✓
    label: 'Checklist',
  },
  mcp: {
    accent: '#ec4899',
    gradient:
      'radial-gradient(ellipse at 50% 0%, rgba(236,72,153,0.16) 0%, transparent 55%)',
    icon: '\u26A1', // ⚡
    label: 'MCP',
  },
  guide: {
    accent: '#38bdf8',
    gradient:
      'radial-gradient(ellipse at 30% 80%, rgba(56,189,248,0.15) 0%, transparent 55%)',
    icon: '>_',
    label: 'Guide',
  },
  education: {
    accent: '#f59e0b',
    gradient:
      'radial-gradient(ellipse at 70% 70%, rgba(245,158,11,0.14) 0%, transparent 55%)',
    icon: '?',
    label: 'Deep Dive',
  },
  protocol: {
    accent: '#14b8a6',
    gradient:
      'radial-gradient(ellipse at 50% 50%, rgba(20,184,166,0.13) 0%, transparent 55%)',
    icon: '{ }',
    label: 'Protocol',
  },
  default: {
    accent: '#06d6a0',
    gradient:
      'radial-gradient(ellipse at 50% 0%, rgba(6,214,160,0.12) 0%, transparent 60%)',
    icon: 'M',
    label: 'Blog',
  },
};

function resolveTheme(tags) {
  const t = new Set(tags.map((s) => s.toLowerCase()));
  if (t.has('announcement')) return THEMES.announcement;
  if (t.has('checklist')) return THEMES.checklist;
  if (t.has('mcp') || t.has('webmcp')) return THEMES.mcp;
  if (t.has('guide')) return THEMES.guide;
  if (t.has('education')) return THEMES.education;
  if (t.has('protocol')) return THEMES.protocol;
  return THEMES.default;
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function estimateReadingTime(text) {
  return Math.max(1, Math.round(text.split(/\s+/).length / 200));
}

// ---------------------------------------------------------------------------
// Cover template
// ---------------------------------------------------------------------------

function renderCover(post, theme) {
  const title =
    post.title.length > 90 ? post.title.slice(0, 87) + '...' : post.title;
  const fontSize = title.length > 60 ? 38 : 46;

  return h(
    'div',
    {
      style: {
        height: '100%',
        width: '100%',
        display: 'flex',
        backgroundColor: '#050a0e',
        backgroundImage: theme.gradient,
        overflow: 'hidden',
        position: 'relative',
      },
    },
    // Left accent bar
    h('div', {
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 6,
        backgroundColor: theme.accent,
      },
    }),
    // Decorative background icon
    h(
      'div',
      {
        style: {
          position: 'absolute',
          right: -20,
          bottom: -60,
          fontSize: 280,
          fontWeight: 700,
          color: theme.accent,
          opacity: 0.04,
          lineHeight: 1,
        },
      },
      theme.icon,
    ),
    // Content
    h(
      'div',
      {
        style: {
          display: 'flex',
          flexDirection: 'column',
          padding: '48px 64px 40px 48px',
          width: '100%',
          height: '100%',
        },
      },
      // Header
      h(
        'div',
        {
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 40,
          },
        },
        h(
          'div',
          { style: { display: 'flex', alignItems: 'center', gap: 12 } },
          h(
            'div',
            {
              style: {
                width: 38,
                height: 38,
                borderRadius: 10,
                backgroundColor: 'rgba(6,214,160,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                fontWeight: 700,
                color: '#06d6a0',
              },
            },
            'M',
          ),
          h(
            'span',
            { style: { fontSize: 20, fontWeight: 600, color: '#64748b' } },
            'MAKO Blog',
          ),
        ),
        h(
          'div',
          {
            style: {
              fontSize: 13,
              fontWeight: 600,
              color: theme.accent,
              backgroundColor: `${theme.accent}18`,
              padding: '5px 16px',
              borderRadius: 20,
              border: `1px solid ${theme.accent}30`,
            },
          },
          theme.label,
        ),
      ),
      // Title
      h(
        'div',
        {
          style: {
            fontSize,
            fontWeight: 700,
            color: '#f8fafc',
            lineHeight: 1.25,
            letterSpacing: '-0.025em',
            maxWidth: 950,
            display: 'flex',
            flex: 1,
          },
        },
        title,
      ),
      // Tags
      h(
        'div',
        { style: { display: 'flex', gap: 10, marginBottom: 24 } },
        ...post.tags.slice(0, 4).map((tag) =>
          h(
            'span',
            {
              style: {
                fontSize: 14,
                color: '#94a3b8',
                backgroundColor: 'rgba(30,41,59,0.8)',
                padding: '5px 14px',
                borderRadius: 14,
              },
            },
            tag,
          ),
        ),
      ),
      // Footer
      h(
        'div',
        {
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(30,41,59,0.8)',
            paddingTop: 18,
          },
        },
        h(
          'div',
          { style: { display: 'flex', alignItems: 'center', gap: 8 } },
          h(
            'span',
            {
              style: { fontSize: 15, color: '#94a3b8', fontWeight: 500 },
            },
            post.author,
          ),
          h(
            'span',
            { style: { fontSize: 15, color: '#475569' } },
            '\u00B7',
          ),
          h(
            'span',
            { style: { fontSize: 15, color: '#64748b' } },
            formatDate(post.date),
          ),
          h(
            'span',
            { style: { fontSize: 15, color: '#475569' } },
            '\u00B7',
          ),
          h(
            'span',
            { style: { fontSize: 15, color: '#64748b' } },
            `${post.readingTime} min read`,
          ),
        ),
        h(
          'span',
          {
            style: {
              fontSize: 13,
              color: '#475569',
              fontFamily: 'Inter',
            },
          },
          'makospec.vercel.app',
        ),
      ),
    ),
  );
}

// ---------------------------------------------------------------------------
// Font loader — downloads Inter on first run, caches locally
// ---------------------------------------------------------------------------

async function loadFont(weight) {
  const filename = `inter-latin-${weight}-normal.woff`;
  const cachePath = path.join(FONT_DIR, filename);

  if (fs.existsSync(cachePath)) {
    return fs.readFileSync(cachePath);
  }

  const url = `https://cdn.jsdelivr.net/npm/@fontsource/inter/files/${filename}`;
  console.log(`  Downloading font: ${filename}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch font: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());

  fs.mkdirSync(FONT_DIR, { recursive: true });
  fs.writeFileSync(cachePath, buffer);
  return buffer;
}

// ---------------------------------------------------------------------------
// Blog reader
// ---------------------------------------------------------------------------

function readPosts() {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const folders = fs
    .readdirSync(BLOG_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  const posts = [];

  for (const folder of folders) {
    const configPath = path.join(BLOG_DIR, folder, 'config.yaml');
    if (!fs.existsSync(configPath)) continue;

    const config = yaml.load(fs.readFileSync(configPath, 'utf-8'));
    if (config.draft) continue;

    for (const locale of LOCALES) {
      const tryLocales =
        locale === DEFAULT_LOCALE ? [locale] : [locale, DEFAULT_LOCALE];
      let md = null;
      for (const loc of tryLocales) {
        const mdPath = path.join(BLOG_DIR, folder, `${loc}.md`);
        if (fs.existsSync(mdPath)) {
          const raw = fs.readFileSync(mdPath, 'utf-8');
          const parsed = matter(raw);
          md = {
            title: parsed.data.title || folder,
            content: parsed.content,
          };
          break;
        }
      }
      if (!md) continue;

      const slug = config.slugs?.[locale] || folder;

      posts.push({
        slug,
        locale,
        title: md.title,
        tags: config.tags || [],
        author: config.author || 'MAKO',
        date: config.date || '',
        readingTime: estimateReadingTime(md.content),
      });
    }
  }

  return posts;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('Generating blog covers...');

  const [fontRegular, fontBold] = await Promise.all([
    loadFont(400),
    loadFont(700),
  ]);

  const fonts = [
    { name: 'Inter', data: fontRegular, weight: 400 },
    { name: 'Inter', data: fontBold, weight: 700 },
  ];

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const posts = readPosts();
  let count = 0;

  for (const post of posts) {
    const theme = resolveTheme(post.tags);
    const element = renderCover(post, theme);

    const svg = await satori(element, { width: WIDTH, height: HEIGHT, fonts });
    const resvg = new Resvg(svg, {
      fitTo: { mode: 'width', value: WIDTH },
    });
    const png = resvg.render().asPng();

    const outPath = path.join(OUT_DIR, `${post.slug}.png`);
    fs.writeFileSync(outPath, png);
    count++;
  }

  console.log(`  Generated ${count} covers in public/covers/`);
}

main().catch((err) => {
  console.error('Cover generation failed:', err);
  process.exit(1);
});
