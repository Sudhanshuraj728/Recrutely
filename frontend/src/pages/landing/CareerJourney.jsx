import { motion, useMotionValueEvent, useSpring, useTransform } from 'framer-motion';
import { useState } from 'react';
import { cn } from '../../lib/cn';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { Reveal } from './Reveal';
import { StageTrack } from './Stage';

const SCENES = [
  {
    n: '01',
    mark: 'Upload',
    title: 'Drop in your resume',
    body: 'A PDF or a paste. No forms, no setup — the analysis starts the moment it lands.',
  },
  {
    n: '02',
    mark: 'Analyze',
    title: 'Every line, scored',
    body: 'An ATS-aware audit: a clarity score, keyword coverage, and the exact bullets holding you back.',
  },
  {
    n: '03',
    mark: 'Match',
    title: 'The roles that actually fit',
    body: 'Live roles ranked by skills, seniority, and culture — so your time goes to the best-fit openings.',
  },
  {
    n: '04',
    mark: 'Advance',
    title: 'Track it to the offer',
    body: 'Pipeline, warm intros, and momentum — one place to steer the whole search.',
  },
];

/**
 * CareerJourney — the pinned-viewport storytelling stage. Content stays in
 * the viewport while scenes swap on scroll. Falls back to a static stacked
 * editorial list under prefers-reduced-motion.
 */
export function CareerJourney() {
  const reduce = useReducedMotion();

  if (reduce) {
    return <StaticJourney />;
  }

  return (
    <section id="journey" className="hairline-b border-t border-[var(--color-border)] bg-[#000]">
      <StageTrack height="300vh">
        {(progress) => (
          <>
            <SceneRail progress={progress} />
            {SCENES.map((s, i) => (
              <JourneyScene key={s.n} scene={s} i={i} progress={progress} />
            ))}
          </>
        )}
      </StageTrack>
    </section>
  );
}

function JourneyScene({ scene, i, progress }) {
  const count = SCENES.length;
  const step = 1 / count;
  const enter = i * step;
  const mid = enter + step * 0.6;
  const exit = (i + 1) * step;
  const tail = exit + step * 0.1;
  const rise = enter + step * 0.3;

  const opacity = useTransform(progress, [enter, mid, exit, tail], [0, 1, 1, 0]);
  const y = useTransform(progress, [enter, rise], [64, 0]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 flex flex-col justify-end pb-28 lg:justify-center lg:pb-0"
    >
      <div className="hairline-t">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-12">
            <p className="pt-8 font-mono text-sm text-[var(--color-primary)] lg:col-span-2 lg:pt-10">
              {scene.n}
            </p>
            <div className="pt-8 lg:col-span-7 lg:pt-10 lg:pb-20">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
                {scene.mark}
              </p>
              <h3 className="mt-6 max-w-2xl text-[clamp(2.1rem,5.5vw,4.5rem)] leading-[1.02] tracking-tight text-[var(--color-text)] [font-weight:var(--weight-display)]">
                {scene.title}
              </h3>
              <p className="mt-7 max-w-md text-base leading-[var(--leading-body)] text-[var(--color-text-muted)]">
                {scene.body}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Giant off-stage index numeral */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-4 bottom-6 hidden select-none font-display text-[32vw] leading-[0.7] [font-weight:var(--weight-display)] text-[var(--color-primary-sink)] lg:block"
      >
        {scene.n}
      </span>
    </motion.div>
  );
}

function SceneRail({ progress }) {
  const count = SCENES.length;
  const scaleX = useSpring(progress, { stiffness: 120, damping: 30 });
  const [index, setIndex] = useState(0);

  useMotionValueEvent(progress, 'change', (v) => {
    const next = Math.min(count - 1, Math.max(0, Math.floor(v * count)));
    setIndex((cur) => (cur === next ? cur : next));
  });

  return (
    <div className="absolute inset-x-0 top-0 z-10">
      <div className="hairline-b">
        <div className="container flex items-center gap-6 py-6">
          <p className="font-mono text-xs tracking-[0.22em] text-[var(--color-text-muted)]">
            <span className="text-[var(--color-primary)]">
              {String(index + 1).padStart(2, '0')}
            </span>{' '}
            / {String(count).padStart(2, '0')}
          </p>
          <div className="relative h-px flex-1 bg-[var(--color-border)]">
            <motion.span
              style={{ scaleX }}
              className="absolute inset-0 origin-left bg-[var(--color-primary)]"
            />
          </div>
          <p className="hidden font-mono text-xs uppercase tracking-[0.22em] text-[var(--color-text-subtle)] sm:block">
            The workflow
          </p>
        </div>
      </div>
    </div>
  );
}

function StaticJourney() {
  return (
    <div className="container py-24 lg:py-36">
      <Reveal>
        <p className="eyebrow">The CareerCraft workflow</p>
      </Reveal>
      <div className="mt-16">
        {SCENES.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.05}>
            <div
              className={cn(
                'grid gap-6 py-12 lg:grid-cols-12',
                i > 0 && 'hairline-t'
              )}
            >
              <p className="font-mono text-sm text-[var(--color-primary)] lg:col-span-2">
                {s.n}
              </p>
              <div className="lg:col-span-6">
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-[var(--color-text-subtle)]">
                  {s.mark}
                </p>
                <h3 className="mt-4 text-3xl font-normal leading-[1.05] tracking-tight text-[var(--color-text)] sm:text-4xl">
                  {s.title}
                </h3>
                <p className="mt-4 max-w-md text-base leading-[var(--leading-body)] text-[var(--color-text-muted)]">
                  {s.body}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}