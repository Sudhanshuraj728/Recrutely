import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect } from 'react';
import { Quote, ShieldCheck, Sparkles, Check } from 'lucide-react';
import { Logo } from '../../components/layout/Logo';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { EASE } from '../../components/motion/motion.config';
import { Noise } from '../../components/landing/Noise';

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
  const spotlightX = useSpring(useMotionValue(-180), { stiffness: 80, damping: 24, mass: 0.7 });
  const spotlightY = useSpring(useMotionValue(-180), { stiffness: 80, damping: 24, mass: 0.7 });

  useEffect(() => {
    if (reduce) return undefined;

    const onPointerMove = (event) => {
      spotlightX.set(event.clientX - 180);
      spotlightY.set(event.clientY - 180);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, [reduce, spotlightX, spotlightY]);

  return (
    <div className="relative grid min-h-dvh overflow-hidden bg-[var(--color-bg)] text-[var(--color-text)] lg:grid-cols-[1.05fr_0.95fr]">
      <Noise opacity={0.04} className="!absolute !inset-0 !z-0" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 opacity-70 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:72px_72px]" />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed z-[1] h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,rgba(249,168,38,0.08)_0%,rgba(249,168,38,0.035)_42%,transparent_72%)] blur-[100px]"
        style={{ left: spotlightX, top: spotlightY }}
      />
      <motion.div
        aria-hidden="true"
        className="auth-orb auth-orb-one pointer-events-none absolute -left-40 -top-40 z-0 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(184,117,35,0.10),transparent_68%)] blur-[120px]"
        animate={reduce ? undefined : { scale: [1, 1.08, 1], opacity: [0.55, 0.8, 0.55] }}
        transition={{ duration: 12, ease: 'easeInOut', repeat: Infinity }}
      />
      <motion.div
        aria-hidden="true"
        className="auth-orb auth-orb-two pointer-events-none absolute -bottom-48 -right-40 z-0 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(184,117,35,0.08),transparent_70%)] blur-[140px]"
        animate={reduce ? undefined : { scale: [1.04, 1, 1.04], opacity: [0.65, 0.45, 0.65] }}
        transition={{ duration: 16, ease: 'easeInOut', repeat: Infinity }}
      />
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden border-r border-[var(--color-border)] bg-[var(--color-bg-secondary)]/70 p-10 backdrop-blur-xl lg:flex xl:p-14">
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

        <div className="relative max-w-lg">
          <p className="mb-5 font-mono text-[0.68rem] uppercase tracking-[0.24em] text-[var(--color-primary)]">
            Resume intelligence / 01
          </p>
          <h2 className="font-display text-[clamp(2.5rem,4vw,4.5rem)] font-medium leading-[0.95] tracking-[-0.055em] text-[var(--color-text)]">
            Your resume is the start.{' '}
            <span className="bg-gradient-to-r from-[#F9A826] to-[#F59E0B] bg-clip-text text-transparent">
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
                className="rounded-xl bg-white/[0.015] p-4 backdrop-blur-md"
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

        <div className="relative mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-glass)] px-3 py-2 text-xs text-[var(--color-text-subtle)] backdrop-blur-md">
          <ShieldCheck className="h-4 w-4 text-[var(--color-success)]" />
          Your data stays private and encrypted.
        </div>
      </div>

      {/* Form panel */}
      <div className="relative flex items-center justify-center overflow-hidden px-4 py-8 sm:px-8 lg:px-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 top-1/2 z-0 hidden -translate-y-1/2 rotate-90 font-display text-[clamp(5rem,11vw,10rem)] font-semibold uppercase leading-none tracking-[-0.08em] text-transparent opacity-[0.045] lg:block"
          style={{ WebkitTextStroke: '1px rgba(255,255,255,0.75)' }}
        >
          Intelligence
        </div>
        <motion.div
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE.out }}
          className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.02] p-6 shadow-[var(--shadow-floating)] backdrop-blur-2xl sm:p-8"
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
