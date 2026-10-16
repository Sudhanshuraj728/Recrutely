const THEMES = [
  { n: '01', label: 'Resume Intelligence' },
  { n: '02', label: 'Job Matching' },
  { n: '03', label: 'Career Readiness' },
  { n: '04', label: 'Skill Gap Analysis' },
  { n: '05', label: 'Networking' },
  { n: '06', label: 'Resume Templates' },
];

/**
 * InfoStrip — the thin divider/information belt under the hero. A full-bleed
 * index of Recrutely's core themes separated by 1px hairline rules
 * (gap-px grid trick). Mono uppercase, small, editorial.
 */
export function InfoStrip() {
  return (
    <section aria-label="What Recrutely covers" className="bg-[var(--color-bg)]">
      <div className="grid grid-cols-2 gap-px overflow-hidden bg-[var(--color-border)] sm:grid-cols-3 lg:grid-cols-6">
        {THEMES.map((t) => (
          <div
            key={t.n}
            className="flex items-center justify-between gap-4 bg-[var(--color-bg)] px-4 py-6 sm:px-6"
          >
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-text-subtle)]">
              {t.label}
            </span>
            <span className="font-mono text-xs text-[var(--color-primary)]">
              {t.n}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}