import { useTranslations } from 'next-intl';
import { FadeIn } from './fade-in';

export function ProtocolPreview() {
  const t = useTranslations('preview');

  return (
    <section className="relative border-t border-slate-800/50">
      <div className="mx-auto max-w-5xl px-6 py-24 sm:py-32">
        <FadeIn>
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {t('title')}
            </h2>
            <p className="mt-4 text-slate-400">{t('subtitle')}</p>
          </div>
        </FadeIn>

        <FadeIn delay={200}>
          <div className="mt-12 mx-auto max-w-3xl">
            {/* Editor window */}
            <div className="rounded-xl border border-slate-800 bg-[#0a0f1a] overflow-hidden shadow-2xl shadow-emerald-500/5">
              {/* Title bar */}
              <div className="flex items-center gap-2 border-b border-slate-800 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/70" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
                  <div className="h-3 w-3 rounded-full bg-green-500/70" />
                </div>
                <span className="ml-2 font-mono text-xs text-slate-500">product.mako.md</span>
              </div>

              {/* Code content */}
              <pre className="p-5 font-mono text-[13px] leading-7 text-slate-300 overflow-x-auto">
                <code>
                  <span className="text-slate-500">---</span>{'\n'}
                  <span className="text-emerald-400">mako</span><span className="text-slate-500">:</span> <span className="text-sky-400">&quot;1.0&quot;</span>{'\n'}
                  <span className="text-emerald-400">type</span><span className="text-slate-500">:</span> <span className="text-sky-400">product</span>{'\n'}
                  <span className="text-emerald-400">entity</span><span className="text-slate-500">:</span> <span className="text-sky-400">&quot;Nike Air Max 90&quot;</span>{'\n'}
                  <span className="text-emerald-400">tokens</span><span className="text-slate-500">:</span> <span className="text-orange-400">280</span>{'\n'}
                  <span className="text-emerald-400">language</span><span className="text-slate-500">:</span> <span className="text-sky-400">en</span>{'\n'}
                  {'\n'}
                  <span className="text-emerald-400">actions</span><span className="text-slate-500">:</span>{'\n'}
                  {'  '}<span className="text-slate-500">-</span> <span className="text-emerald-400">name</span><span className="text-slate-500">:</span> <span className="text-sky-400">add_to_cart</span>{'\n'}
                  {'    '}<span className="text-emerald-400">endpoint</span><span className="text-slate-500">:</span> <span className="text-sky-400">/api/cart/add</span>{'\n'}
                  {'\n'}
                  <span className="text-emerald-400">links</span><span className="text-slate-500">:</span>{'\n'}
                  {'  '}<span className="text-emerald-400">internal</span><span className="text-slate-500">:</span>{'\n'}
                  {'    '}<span className="text-slate-500">-</span> <span className="text-emerald-400">url</span><span className="text-slate-500">:</span> <span className="text-sky-400">/category/running</span>{'\n'}
                  {'      '}<span className="text-emerald-400">context</span><span className="text-slate-500">:</span> <span className="text-sky-400">&quot;Browse running shoes&quot;</span>{'\n'}
                  <span className="text-slate-500">---</span>{'\n'}
                  {'\n'}
                  <span className="text-fuchsia-400 font-semibold"># Nike Air Max 90</span>{'\n'}
                  {'\n'}
                  <span className="text-slate-300">Mid-range casual running shoe by Nike.</span>{'\n'}
                  {'\n'}
                  <span className="text-fuchsia-400 font-semibold">## Key Facts</span>{'\n'}
                  <span className="text-slate-500">-</span> <span className="text-slate-300">Price: 79.99 EUR (was 149.99, -47%)</span>{'\n'}
                  <span className="text-slate-500">-</span> <span className="text-slate-300">Rating: 4.3/5 (234 reviews)</span>{'\n'}
                  <span className="text-slate-500">-</span> <span className="text-slate-300">In stock, sizes EU 38-46</span>
                </code>
              </pre>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
