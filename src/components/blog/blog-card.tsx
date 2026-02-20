import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import type { BlogMeta } from '@/lib/blog';
import { buildCoverUrl } from '@/lib/blog/cover-url';

export function BlogCard({ post }: { post: BlogMeta }) {
  const t = useTranslations('blog');
  const coverSrc = buildCoverUrl(post);

  return (
    <article className="group rounded-xl border border-slate-800/50 bg-slate-900/30 p-6 transition hover:border-emerald-500/30 hover:bg-slate-900/50">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="mb-4 overflow-hidden rounded-lg">
          <img
            src={coverSrc}
            alt={post.title}
            className="aspect-[1200/630] w-full object-cover transition group-hover:scale-[1.02]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-3">
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString(post.locale, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          <span>&middot;</span>
          <span>{t('min_read', { minutes: post.readingTime })}</span>
        </div>

        <h2 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
          {post.title}
        </h2>

        <p className="text-sm text-slate-400 line-clamp-2 mb-4">
          {post.description}
        </p>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-slate-800/60 px-2.5 py-0.5 text-xs text-slate-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </Link>
    </article>
  );
}
