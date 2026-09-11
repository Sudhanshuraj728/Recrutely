import { Link } from 'react-router-dom';
import { Check, ArrowRight, FileText, CreditCard, BookOpen } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Section } from './Section';
import { Reveal, Stagger, StaggerChild } from './Reveal';

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    blurb: 'For getting your resume on solid ground.',
    features: [
      '3 resume analyses / month',
      '2 templates',
      '5 job matches / week',
      'Basic network map',
    ],
    cta: 'Start free',
    to: '/signup',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$12',
    period: '/month',
    blurb: 'Everything you need to move faster.',
    features: [
      'Unlimited resume analyses',
      'All templates + ATS export',
      'Unlimited job matching',
      'AI application pipeline',
      'Warm-intro network routing',
      'Priority support',
    ],
    cta: 'Try Pro free',
    to: '/upgrade',
    highlight: true,
  },
];

/**
 * Pricing — three-tier comparison with a cream-highlighted Pro plan, gold
 * pill CTAs, and a Saffron-style "Become an expert" closing band below.
 */
export function Pricing() {
  return (
    <Section
      id="pricing"
      eyebrow="Pricing"
      title="Start free. Upgrade when you’re ready."
      description="No contracts, no surprises. Cancel anytime."
      className="border-t border-[var(--color-border)]"
    >
      <Stagger>
        <div className="grid gap-6 lg:grid-cols-3">
          {PLANS.map((p) => (
            <StaggerChild key={p.name} className="h-full">
              <PlanCard {...p} />
            </StaggerChild>
          ))}
        </div>
      </Stagger>
    </Section>
  );
}

function PlanCard({ name, price, period, blurb, features, cta, to, highlight }) {
  return (
    <div
      className={cn(
        'relative flex h-full flex-col rounded-[var(--radius-4)] border p-8',
        highlight
          ? 'paper border-transparent shadow-[var(--shadow-floating)]'
          : 'border-[var(--color-border)] bg-[var(--color-bg-elevated)]'
      )}
    >
      {highlight && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--color-primary)] px-4 py-1 font-mono text-xs uppercase tracking-wider text-[var(--color-text-inverse)]">
          Most popular
        </span>
      )}
      <h3
        className={cn(
          'font-mono text-xs uppercase tracking-[0.18em]',
          highlight ? 'text-[var(--color-primary-active)]' : 'text-[var(--color-text-muted)]'
        )}
      >
        {name}
      </h3>
      <div className="mt-4 flex items-baseline gap-1">
        <span className={cn('text-4xl font-semibold', highlight ? 'text-[var(--color-cream-ink)]' : 'text-[var(--color-text)]')}>
          {price}
        </span>
        <span className={cn('font-mono text-sm', highlight ? 'text-black/50' : 'text-[var(--color-text-muted)]')}>
          {period}
        </span>
      </div>
      <p className={cn('mt-2 text-sm', highlight ? 'text-black/60' : 'text-[var(--color-text-muted)]')}>
        {blurb}
      </p>

      <ul className="mt-6 space-y-3">
        {features.map((f) => (
          <li
            key={f}
            className={cn(
              'flex items-start gap-3 text-sm',
              highlight ? 'text-black/70' : 'text-[var(--color-text-muted)]'
            )}
          >
            <Check className={cn('mt-0.5 h-4 w-4 shrink-0', highlight ? 'text-[var(--color-primary-active)]' : 'text-[var(--color-primary)]')} />
            {f}
          </li>
        ))}
      </ul>

      <div className="mt-8 pt-2">
        {highlight ? (
          <Link to={to} className="pill pill-gold w-full">
            {cta}
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <Link to={to} className="pill pill-outline w-full">
            {cta}
          </Link>
        )}
      </div>
    </div>
  );
}

const RESOURCES = [
  {
    icon: FileText,
    title: 'Browse Templates',
    body: 'Recruiter-approved, ATS-tested resume designs for every stage of your search.',
    cta: 'View templates',
    to: '/templates',
  },
  {
    icon: CreditCard,
    title: 'Compare Pricing',
    body: 'Free forever plan, or go Pro and unlock unlimited analyses and matching.',
    cta: 'See pricing',
    to: '/pricing',
  },
  {
    icon: BookOpen,
    title: 'Read the Resume Guide',
    body: 'Dive into CareerCraft through our guides, tips, and interview prep.',
    cta: 'Read the guide',
    to: '/resume',
  },
];

/**
 * BecomeExpert — the Saffron-style closing band: a bold heading, a gold CTA,
 * and three resource cards before the footer.
 */
export function BecomeExpert() {
  return (
    <Section className="border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)]/30">
      <div className="flex flex-col items-center text-center">
        <Reveal>
          <p className="eyebrow justify-center">Keep learning</p>
          <h2 className="mt-6 max-w-3xl text-h2 text-[var(--color-text)]">
            Become an expert with CareerCraft
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-[var(--leading-body)] text-[var(--color-text-muted)]">
            Dive into CareerCraft through our templates, pricing, guides, and
            interview prep — all in one place.
          </p>
          <div className="mt-10">
            <Link to="/signup" className="pill pill-gold pill-lg">
              Start free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </div>

      <Stagger className="mt-16">
        <div className="grid gap-6 md:grid-cols-3">
          {RESOURCES.map((r) => (
            <StaggerChild key={r.title} className="h-full">
              <Link
                to={r.to}
                className="group flex h-full flex-col rounded-[var(--radius-3)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-7 transition-colors hover:border-[var(--color-primary)]"
              >
                <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-border-strong)] text-[var(--color-primary)] transition-colors group-hover:border-[var(--color-primary)]">
                  <r.icon className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-medium text-[var(--color-text)]">{r.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-[var(--leading-body)] text-[var(--color-text-muted)]">
                  {r.body}
                </p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary)]">
                  {r.cta}
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </StaggerChild>
          ))}
        </div>
      </Stagger>
    </Section>
  );
}