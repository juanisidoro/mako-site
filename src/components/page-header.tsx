import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle: string;
  breadcrumbs: Breadcrumb[];
}

export function PageHeader({ title, subtitle, breadcrumbs }: PageHeaderProps) {
  const t = useTranslations('breadcrumb');

  return (
    <div className="border-b border-zinc-800/50">
      <div className="mx-auto max-w-3xl px-6 pt-12 pb-10 sm:pt-16 sm:pb-12">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
          <Link href="/" className="transition hover:text-amber-400">
            {t('home')}
          </Link>
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3">
                <path fillRule="evenodd" d="M6.22 4.22a.75.75 0 011.06 0l3.25 3.25a.75.75 0 010 1.06l-3.25 3.25a.75.75 0 01-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 010-1.06z" clipRule="evenodd" />
              </svg>
              {crumb.href ? (
                <Link href={crumb.href as any} className="transition hover:text-amber-400">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-zinc-400">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>

        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 text-lg text-zinc-400">{subtitle}</p>
      </div>
    </div>
  );
}
