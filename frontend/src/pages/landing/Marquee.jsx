import { cn } from '../../lib/cn';

const FEATURES = [
  'Resume Intelligence',
  'Job Matching',
  'Career Readiness',
  'Skill Gap Analysis',
  'Networking Insights',
  'Resume Templates',
  'AI Resume Analysis',
  'Company Intelligence',
];

const ICONS = [
  ['▲', 'text-[var(--color-warning)]'],
  ['◆', 'text-[var(--color-secondary)]'],
  ['●', 'text-[var(--color-success)]'],
  ['■', 'text-[var(--color-info)]'],
  ['✦', 'text-[var(--color-danger)]'],
  ['●', 'text-[var(--color-warning)]'],
  ['■', 'text-[var(--color-info)]'],
  ['◆', 'text-[var(--color-success)]'],
  ['✦', 'text-[var(--color-danger)]'],
  ['▲', 'text-[var(--color-secondary)]'],
];

/**
 * Marquee — an infinite scrolling row of CareerCraft capabilities,
 * mirroring the Saffron information belt. Pure CSS animation, pauses on hover.
 */
export function Marquee({ className }) {
  const row = FEATURES.map((name, i) => ({ name, icon: ICONS[i % ICONS.length] }));
  const doubled = [...row, ...row];

  return (
    <section
      aria-label="CareerCraft features"
      className={cn(
        'overflow-hidden border-y border-[var(--color-border)] bg-[var(--color-bg-secondary)]/40 py-10',
        className
      )}
    >
      <div className="flex w-max marquee-track">
        {doubled.map((c, i) => (
          <div
            key={`${c.name}-${i}`}
            className="flex shrink-0 items-center gap-3 px-10"
          >
            <span aria-hidden="true" className={cn('text-xs', c.icon[1])}>
              {c.icon[0]}
            </span>
            <span className="whitespace-nowrap font-mono text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-text)]">
              {c.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}