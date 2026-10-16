import { cn } from '../../lib/cn';
import {
  Brain,
  Target,
  BadgeCheck,
  Gauge,
  Users,
  LayoutTemplate,
  Sparkles,
  Building2,
} from 'lucide-react';

const FEATURES = [
  { name: 'Resume Intelligence', Icon: Brain, iconClass: 'text-[var(--color-warning)]' },
  { name: 'Job Matching', Icon: Target, iconClass: 'text-[var(--color-secondary)]' },
  { name: 'Career Readiness', Icon: BadgeCheck, iconClass: 'text-[var(--color-success)]' },
  { name: 'Skill Gap Analysis', Icon: Gauge, iconClass: 'text-[var(--color-info)]' },
  { name: 'Networking Insights', Icon: Users, iconClass: 'text-[var(--color-danger)]' },
  { name: 'Resume Templates', Icon: LayoutTemplate, iconClass: 'text-[var(--color-warning)]' },
  { name: 'AI Resume Analysis', Icon: Sparkles, iconClass: 'text-[var(--color-info)]' },
  { name: 'Company Intelligence', Icon: Building2, iconClass: 'text-[var(--color-success)]' },
];

/**
 * Marquee — an infinite scrolling row of Recrutely capabilities.
 * Pure CSS translate3d animation (GPU-composited, zero JS per frame),
 * so it stays perfectly smooth. Pauses on hover.
 */
export function Marquee({ className }) {
  const doubled = [...FEATURES, ...FEATURES];

  return (
    <section
      aria-label="Recrutely features"
      className={cn(
        'w-full overflow-hidden border-y border-white/10 bg-[#050505] py-8',
        className
      )}
    >
      <div className="flex w-max marquee-track marquee-animate" role="list">
        {doubled.map(({ name, Icon, iconClass }, i) => (
<div
            role="listitem"
            key={`${name}-${i}`}
            className="flex shrink-0 items-center gap-3 px-10"
          >
            <Icon aria-hidden="true" className={cn('h-4 w-4', iconClass)} strokeWidth={2.2} />
            <span className="whitespace-nowrap font-display text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-text)]">
        {name}
      </span>
          </div>
        ))}
      </div>
    </section>
  );
}