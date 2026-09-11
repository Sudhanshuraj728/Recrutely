import { motion } from 'framer-motion';
import { LayoutTemplate } from 'lucide-react';
import { Section } from './Section';
import { Stagger, StaggerChild } from './Reveal';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const TEMPLATES = [
  { name: 'Apex', style: 'Modern · Two-column', tags: ['Minimal', 'ATS'] },
  { name: 'Meridian', style: 'Classic · Single-column', tags: ['Formal', 'ATS'] },
  { name: 'Vector', style: 'Creative · Accent', tags: ['Design', 'Visual'] },
];

/**
 * TemplatesShowcase — preview each template as a small cream "paper" resume
 * card. Cards lift gently on hover to feel like selectable product cards.
 */
export function TemplatesShowcase() {
  return (
    <Section
      id="templates"
      eyebrow="Templates"
      title="Built to be read, designed to land"
      description="Every template is recruiter-approved and ATS-tested. Pick one, fill it with your analysis, and export in a click."
    >
      <Stagger>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATES.map((t) => (
            <StaggerChild key={t.name}>
              <TemplateCard {...t} />
            </StaggerChild>
          ))}
        </div>
      </Stagger>
    </Section>
  );
}

function TemplateCard({ name, style, tags }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      whileHover={reduce ? undefined : { y: -6 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      className="group cursor-pointer overflow-hidden rounded-[var(--radius-3)] border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] transition-colors hover:border-[var(--color-primary)]"
    >
      <div className="relative aspect-[3/4] overflow-hidden p-4">
        <div className="paper h-full rounded-[var(--radius-2)] p-6 shadow-[var(--shadow-subtle)]">
          {name === 'Apex' ? (
            <MockTwoColumn />
          ) : name === 'Meridian' ? (
            <MockSingleColumn />
          ) : (
            <MockAccent />
          )}
        </div>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[var(--color-bg)]/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-text-inverse)]">
            <LayoutTemplate className="h-4 w-4" />
            Use {name}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-[var(--color-border)] px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-[var(--color-text)]">{name}</p>
          <p className="font-mono text-xs text-[var(--color-text-muted)]">{style}</p>
        </div>
        <div className="flex gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[var(--color-border)] px-2 py-0.5 font-mono text-[0.625rem] uppercase tracking-wider text-[var(--color-text-muted)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

const LINE = 'bg-[rgba(36,16,5,0.5)]';
const LINE_LIGHT = 'bg-[rgba(36,16,5,0.16)]';
const HEAD = 'bg-[var(--color-cream-ink)]';

function MockTwoColumn() {
  return (
    <div className="flex h-full gap-4">
      <div className="w-10 shrink-0 space-y-2">
        <div className="h-14 rounded bg-[linear-gradient(135deg,var(--color-primary),var(--color-primary-active))]" />
        <div className={`h-2 rounded ${LINE}`} />
        <div className={`h-2 rounded ${LINE}`} />
        <div className={`h-2 rounded ${LINE}`} />
      </div>
      <div className="flex-1 space-y-2">
        <div className={`h-4 w-3/4 rounded ${HEAD}`} />
        <div className={`h-2 rounded ${LINE_LIGHT}`} />
        <div className={`h-2 rounded ${LINE}`} />
        <div className={`h-2 rounded ${LINE_LIGHT}`} />
        <div className="pt-2">
          <div className="mb-1 h-2 w-16 rounded bg-[rgba(255,188,9,0.45)]" />
          <div className={`h-2 rounded ${LINE_LIGHT}`} />
          <div className={`h-2 rounded ${LINE_LIGHT}`} />
        </div>
      </div>
    </div>
  );
}

function MockSingleColumn() {
  return (
    <div className="flex h-full flex-col gap-3">
      <div className={`h-5 w-1/2 rounded ${HEAD}`} />
      <div className={`h-2 w-2/5 rounded ${LINE_LIGHT}`} />
      <div className="mt-2 space-y-2">
        <div className="mb-1 h-2 w-20 rounded bg-[rgba(255,188,9,0.45)]" />
        <div className={`h-2 rounded ${LINE}`} />
        <div className={`h-2 rounded ${LINE_LIGHT}`} />
        <div className={`h-2 rounded ${LINE}`} />
      </div>
      <div className="mt-2 space-y-2">
        <div className="mb-1 h-2 w-20 rounded bg-[rgba(255,188,9,0.45)]" />
        <div className={`h-2 rounded ${LINE}`} />
        <div className={`h-2 rounded ${LINE_LIGHT}`} />
      </div>
    </div>
  );
}

function MockAccent() {
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-[linear-gradient(135deg,var(--color-secondary),var(--color-primary))]" />
        <div className={`h-4 w-1/2 rounded ${HEAD}`} />
      </div>
      <div className="space-y-2">
        <div className="mb-1 h-2 w-24 rounded bg-[rgba(202,86,237,0.35)]" />
        <div className={`h-2 rounded ${LINE}`} />
        <div className={`h-2 rounded ${LINE_LIGHT}`} />
      </div>
      <div className="space-y-2">
        <div className="mb-1 h-2 w-24 rounded bg-[rgba(202,86,237,0.35)]" />
        <div className={`h-2 rounded ${LINE}`} />
        <div className={`h-2 rounded ${LINE_LIGHT}`} />
        <div className={`h-2 rounded ${LINE_LIGHT}`} />
      </div>
    </div>
  );
}