import { useTranslations } from 'next-intl';
import type { BlogPost } from '@/lib/blog';

export function BlogPostHeader({ post }: { post: BlogPost }) {
  const t = useTranslations('blog');

  return (
    <header className="mb-10">
      {post.cover && (
        <div className="mb-8 overflow-hidden rounded-xl">
          <img
            src={post.cover}
            alt={post.title}
            className="aspect-[2.4/1] w-full object-cover"
          />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 mb-4">
        <time dateTime={post.date}>
          {t('published_on', {
            date: new Date(post.date).toLocaleDateString(post.locale, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
          })}
        </time>
        <span>&middot;</span>
        <span>{t('by_author', { author: post.author })}</span>
        <span>&middot;</span>
        <span>{t('min_read', { minutes: post.readingTime })}</span>
      </div>

      <h1 className="text-3xl font-bold text-white mb-4 sm:text-4xl">
        {post.title}
      </h1>

      <p className="text-lg text-slate-400">
        {post.description}
      </p>

      {post.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </header>
  );
}
