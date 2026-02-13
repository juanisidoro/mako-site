const colorMap: Record<string, string> = {
  product: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  article: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  docs: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
  landing: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  listing: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  profile: 'bg-pink-500/15 text-pink-400 border-pink-500/30',
  event: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  recipe: 'bg-lime-500/15 text-lime-400 border-lime-500/30',
  faq: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  custom: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
};

export function ContentTypeBadge({ contentType }: { contentType: string }) {
  const colors = colorMap[contentType] ?? colorMap.custom;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${colors}`}
    >
      {contentType}
    </span>
  );
}
