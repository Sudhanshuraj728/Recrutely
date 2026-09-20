import { Upload, Sparkles, Briefcase, ArrowRight } from 'lucide-react';
import { Section } from './Section';
import { Stagger, StaggerChild } from './Reveal';

const STEPS = [
  {
    icon: Upload,
    title: 'Upload your resume',
    body: 'Drop in your current resume as a PDF or paste it in. No setup, no manual forms.',
  },
  {
    icon: Sparkles,
    title: 'Get your analysis',
    body: 'CareerCraft scores it, finds gaps, and rewrites weak bullets in seconds.',
  },
  {
    icon: Briefcase,
    title: 'Match & apply',
    body: 'See the roles you fit best, tailor your resume in one click, and track every application.',
  },
];

/**
 * HowItWorks — simple three-step narrative. Numbered for clarity.
 */
export function HowItWorks() {
  return (
    <Section
      id="how-it-works"
      eyebrow="How it works"
      title="From resume to your next move in three steps"
      description="A guided path that keeps you moving, without the busywork."
      className="border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)]/40"
    >
      <Stagger>
        <div className="grid gap-5 md:grid-cols-3">
          {STEPS.map((s) => (
            <StaggerChild key={s.title}>
              <div className="relative h-full rounded-[var(--radius-3)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-7">
                <span className="absolute right-5 top-5 text-[var(--color-primary-soft)] [&_svg]:h-10 [&_svg]:w-10">
                  <s.icon aria-hidden="true" strokeWidth={1.5} />
                </span>
                <span className="mb-6 inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-2)] bg-[var(--color-primary-sink)] text-[var(--color-primary)]">
                  <s.icon className="h-5 w-5" />
                </span>
                <h3 className="relative text-lg font-semibold text-[var(--color-text)]">
                  {s.title}
                </h3>
                <p className="relative mt-2 text-sm leading-[var(--leading-body)] text-[var(--color-text-muted)]">
                  {s.body}
                </p>
              </div>
            </StaggerChild>
          ))}
        </div>
      </Stagger>

      <div className="mt-10 flex flex-col items-center gap-2 text-center">
        <a
          href="/signup"
          className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ring-color)]"
        >
          Start now
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </Section>
  );
}
