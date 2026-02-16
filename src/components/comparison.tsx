import { useTranslations } from 'next-intl';
import { FadeIn } from './fade-in';

const itemKeys = ['llms_txt', 'schema_org', 'webmcp', 'cloudflare_md'] as const;

export function Comparison() {
  const t = useTranslations('comparison');

  return (
    <section className="relative border-t border-slate-800/50">
      <div className="mx-auto max-w-5xl px-6 py-24 sm:py-32">
        <FadeIn>
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {t('title')}
            </h2>
            <p className="mt-4 text-slate-400 max-w-2xl mx-auto">{t('subtitle')}</p>
          </div>
        </FadeIn>

        {/* Desktop table */}
        <FadeIn delay={200}>
          <div className="mt-12 hidden lg:block">
            <div className="rounded-xl border border-slate-800 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/60">
                    <th className="px-6 py-4 text-left font-semibold text-slate-300">{t('header_standard')}</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-300">{t('header_focus')}</th>
                    <th className="px-6 py-4 text-left font-semibold text-emerald-400">{t('header_complement')}</th>
                  </tr>
                </thead>
                <tbody>
                  {itemKeys.map((key, i) => (
                    <tr key={key} className={`border-b border-slate-800/50 ${i % 2 === 0 ? 'bg-slate-900/20' : ''}`}>
                      <td className="px-6 py-4 font-medium text-white whitespace-nowrap">
                        {t(`items.${key}.name`)}
                      </td>
                      <td className="px-6 py-4 text-slate-400 leading-relaxed">
                        {t(`items.${key}.focus`)}
                      </td>
                      <td className="px-6 py-4 text-emerald-400/90 leading-relaxed">
                        {t(`items.${key}.complement`)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </FadeIn>

        {/* Mobile cards */}
        <div className="mt-12 space-y-4 lg:hidden">
          {itemKeys.map((key, i) => (
            <FadeIn key={key} delay={i * 100}>
              <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-5">
                <h3 className="font-semibold text-white">{t(`items.${key}.name`)}</h3>
                <p className="mt-2 text-sm text-slate-400">{t(`items.${key}.focus`)}</p>
                <div className="mt-3 border-t border-slate-800/50 pt-3">
                  <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">{t('header_complement')}</span>
                  <p className="mt-1 text-sm text-emerald-400/90">{t(`items.${key}.complement`)}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
