import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Quote, ShieldCheck, Sparkles, Check } from 'lucide-react';
import { Logo } from '../../components/layout/Logo';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { EASE } from '../../components/motion/motion.config';

const TESTIMONIALS = [
  {
    quote:
      'CareerCraft rewrote my resume and I landed two interviews in the first week. The match scores actually mean something.',
    name: 'Priya Sharma',
    role: 'Product Manager · B2B SaaS',
  },
  {
    quote:
      'The analysis found weak bullets I had no idea were holding me back. Cleanest tool I’ve used for a job search.',
    name: 'Marcus Reed',
    role: 'Senior Software Engineer',
  },
];

/**
 * AuthLayout — premium split-screen frame for login/signup.
 * Left: brand panel with positioning statement + social proof (desktop only).
 * Right: the form card with animated entrance.
 * Content (form) is provided as children by each page.
 */
export function AuthLayout({ title, eyebrow, description, children }) {
  const reduce = useReducedMotion();

  return (
    <div className="grid min-h-dvh bg-[var(--color-bg)] text-[var(--color-text)] lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden border-r border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-10 lg:flex">
        {/* Ambient gradient */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(70% 55% at 20% 0%, var(--color-primary-sink), transparent 65%)',
          }}
        />

        <div className="relative">
          <Link
            to="/"
            className="inline-flex focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ring-color)]"
          >
            <Logo />
          </Link>
        </div>

        <div className="relative max-w-md">
          <h2 className="text-h2 text-[var(--color-text)]">
            Your resume is the start.{' '}
            <span className="bg-[linear-gradient(120deg,var(--color-primary),var(--color-secondary))] bg-clip-text text-transparent">
              The strategy takes it from there.
            </span>
          </h2>
          <p className="mt-4 text-body text-[var(--color-text-muted)]">
            Analysis, job matching, and networking — in the only tool built to
            move you toward an offer.
          </p>

          <ul className="mt-8 space-y-3">
            {[
              'AI-powered resume scores that matter',
              'Live matches to real, open roles',
              'Warm-intro networking, built in',
            ].map((item, i) => (
              <motion.li
                key={item}
                initial={reduce ? false : { opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: reduce ? 0 : 0.4 + i * 0.12, duration: 0.4, ease: EASE.out }}
                className="flex items-center gap-3 text-sm text-[var(--color-text-muted)]"
              >
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                  <Check className="h-3 w-3" />
                </span>
                {item}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Social proof */}
        <div className="relative">
          <div className="flex flex-col gap-4">
            {TESTIMONIALS.map((t, i) => (
              <motion.figure
                key={t.name}
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduce ? 0 : 0.55 + i * 0.15, duration: 0.5, ease: EASE.out }}
                className="rounded-[var(--radius-3)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/60 p-4"
              >
                <Quote className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
                <blockquote className="mt-2 text-sm leading-[var(--leading-body)] text-[var(--color-text-muted)]">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-3 text-xs font-semibold text-[var(--color-text)]">
                  {t.name} <span className="font-normal text-[var(--color-text-subtle)]">· {t.role}</span>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>

        <div className="relative mt-6 inline-flex items-center gap-2 text-xs text-[var(--color-text-subtle)]">
          <ShieldCheck className="h-4 w-4 text-[var(--color-success)]" />
          Your data stays private and encrypted.
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-4 py-10 sm:px-8">
        <motion.div
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE.out }}
          className="w-full max-w-md"
        >
          {/* Mobile brand mark */}
          <div className="mb-8 lg:hidden">
            <Link
              to="/"
              className="inline-flex focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ring-color)]"
            >
              <Logo />
            </Link>
          </div>

          <header className="mb-8">
            <p className="mb-3 inline-flex items-center gap-1.5 text-label text-[var(--color-primary)]">
              <Sparkles className="h-3.5 w-3.5" />
              {eyebrow}
            </p>
            <h1 className="text-h1 text-[var(--color-text)]">{title}</h1>
            {description && (
              <p className="mt-3 text-body text-[var(--color-text-muted)]">{description}</p>
            )}
          </header>

          {children}
        </motion.div>
      </div>
    </div>
  );
}
