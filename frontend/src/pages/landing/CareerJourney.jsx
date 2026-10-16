import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { Reveal } from './Reveal';

const STEPS = [
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
    mark: 'Offer',
    title: 'Track it to the offer',
    body: 'Pipeline, warm intros, and momentum — one place to steer the whole search.',
  },
];

const TOPS = ['top-[10vh]', 'top-[14vh]', 'top-[18vh]', 'top-[22vh]'];

/**
 * CareerJourney — a "card stack" storytelling deck. Each step is a
 * glassmorphic card pinned with sticky positioning at increasing offsets,
 * so the deck piles up like cards being dealt. Pure CSS sticky — no JS
 * scroll work, so it stays buttery smooth. Each card carries a different
 * animated bento graphic that matches its step.
 */
export function CareerJourney() {
  return (
    <section
      id="journey"
      className="relative isolate border-t border-[var(--color-border)] bg-[#050505]"
    >
      {/* Premium ambient backdrop — strictly behind the cards (z-index -10).
          The orb is sticky so it stays locked to the viewport center while the
          deck scrolls. overflow-hidden lives ONLY here on this decorative
          sibling — never on the deck's ancestors — so position:sticky on the
          cards keeps working. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Fine technical dot grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        />
        {/* Ambient Saffron spotlight locked to viewport center */}
        <div className="sticky top-1/2 mx-auto h-[800px] w-[800px] -translate-y-1/2 rounded-full bg-[#F9A826] opacity-[0.04] blur-[150px]" />
        {/* Vignette — edges fade to pure black, glow stays central */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_38%,rgba(0,0,0,0.68)_100%)]" />
      </div>

      <div className="relative z-10">
        <div className="container pt-24 lg:pt-32">
          <Reveal>
            <div className="max-w-3xl">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#F9A826]">
                The workflow
              </p>
              <h2 className="mt-6 text-[clamp(2.4rem,5.5vw,4.5rem)] leading-[1.02] tracking-tighter text-white [font-weight:var(--weight-display)]">
                Four moves, from resume to offer.
              </h2>
              <p className="mt-6 max-w-xl text-base leading-[var(--leading-body)] text-gray-400">
                Each step stacks on the last — upload, analyze, match, and steer
                the whole search to a single place.
              </p>
            </div>
          </Reveal>
        </div>

        {/* The deck — minimal-height tall wrapper gives the stack its scroll room.
            Cards are DIRECT children (no intermediate wrappers) so each card's
            sticky containing block is this tall deck, letting them pile up. */}
        <div className="mx-auto mt-16 max-w-6xl min-h-[300vh] space-y-8 px-6 pb-[35vh] pt-[8vh] sm:px-12">
          {STEPS.map((s, i) => (
            <WorkflowCard key={s.n} step={s} i={i} className={TOPS[i]} />
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkflowCard({ step, i, className }) {
  const { n, mark, title, body } = step;

  return (
    <div
      className={cn(
        'sticky rounded-3xl border border-white/10 border-t-[rgba(249,168,38,0.3)] bg-[#0A0A0A] p-8 shadow-2xl shadow-black/60 backdrop-blur-xl sm:p-12',
        className
      )}
    >
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -left-4 -top-14 -z-10 select-none font-display text-[9rem] leading-none text-white/[0.03] [font-weight:var(--weight-display)] sm:-top-16"
          >
            {n}
          </span>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#F9A826]">
            {n} / {mark}
          </p>
          <h3 className="mt-7 max-w-lg text-[clamp(2.1rem,4vw,3.5rem)] leading-[1.04] tracking-tighter text-white [font-weight:var(--weight-display)]">
            {title}
          </h3>
          <p className="mt-6 max-w-md text-base leading-[var(--leading-body)] text-gray-400">
            {body}
          </p>
        </div>

        <div className="relative">
          <BentoGraphic i={i} />
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Shared dark glassmorphic shell — all four graphics use this       */
/* ---------------------------------------------------------------- */

function BentoShell({ label, children, footer }) {
  return (
    <div className="relative rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-xl sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
        </div>
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-gray-500">
          {label}
        </span>
      </div>
      {children}
      {footer && <div className="mt-5">{footer}</div>}
    </div>
  );
}

function SageFooter({ children }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-gray-500">
        Recrutely
      </span>
      {children}
    </div>
  );
}

function Pill({ children, active = true }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[0.58rem] uppercase tracking-[0.12em]',
        active
          ? 'border-[#F9A826]/30 bg-[#F9A826]/10 text-[#F9A826]'
          : 'border-white/10 bg-white/5 text-gray-500'
      )}
    >
      {children}
    </span>
  );
}

function BentoGraphic({ i }) {
  if (i === 0) return <ScannerBento />;
  if (i === 1) return <RingBento />;
  if (i === 2) return <NodesBento />;
  return <PipelineBento />;
}

/* ---------------------------------------------------------------- */
/* Card 01 — Upload: glowing resume wireframe + moving scan line     */
/* ---------------------------------------------------------------- */

function ScannerBento() {
  const reduce = useReducedMotion();

  return (
    <BentoShell
      label="Resume preview"
      footer={
        <SageFooter>
          <Pill>
            {!reduce && <span className="h-1 w-1 animate-pulse rounded-full bg-[#F9A826]" />}
            Scanning
          </Pill>
        </SageFooter>
      }
    >
      <div className="relative mx-auto flex min-h-[15rem] max-w-[16rem] items-center justify-center">
        <div className="relative w-full overflow-hidden rounded-xl bg-[#f5f3ee]/95 px-5 py-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="flex items-start justify-between">
            <div>
              <div className="h-2 w-20 rounded-full bg-[#17191c]/80" />
              <div className="mt-2 h-1.5 w-14 rounded-full bg-[#17191c]/20" />
            </div>
            <div className="h-7 w-7 rounded-full bg-[#e4e1d8]" />
          </div>
          <div className="mt-4 h-px bg-[#17191c]/10" />
          <div className="mt-4 space-y-2">
            <div className="h-1.5 w-12 rounded-full bg-[#b87523]/70" />
            <div className="h-1.5 w-full rounded-full bg-[#17191c]/10" />
            <div className="h-1.5 w-4/5 rounded-full bg-[#17191c]/10" />
            <div className="h-1.5 w-2/3 rounded-full bg-[#17191c]/10" />
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-1.5 w-14 rounded-full bg-[#b87523]/70" />
            <div className="h-1.5 w-full rounded-full bg-[#17191c]/10" />
            <div className="h-1.5 w-3/4 rounded-full bg-[#17191c]/10" />
          </div>

          {reduce ? (
            <div aria-hidden="true" className="absolute inset-x-2 top-[60%]">
              <div className="h-8 rounded-md bg-gradient-to-b from-transparent via-[#F9A826]/15 to-transparent" />
              <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-[#F9A826] to-transparent shadow-[0_0_20px_rgba(249,168,38,0.8)]" />
            </div>
          ) : (
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-2"
              animate={{ top: ['6%', '88%'] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="h-8 rounded-md bg-gradient-to-b from-transparent via-[#F9A826]/15 to-transparent" />
              <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-[#F9A826] to-transparent shadow-[0_0_20px_rgba(249,168,38,0.9)]" />
            </motion.div>
          )}
        </div>
      </div>
    </BentoShell>
  );
}

/* ---------------------------------------------------------------- */
/* Card 02 — Analyze: ATS ring filling to 92%                        */
/* ---------------------------------------------------------------- */

function RingBento() {
  const reduce = useReducedMotion();
  const C = 2 * Math.PI * 54;

  return (
    <BentoShell
      label="ATS analysis"
      footer={
        <SageFooter>
          <div className="flex gap-2">
            <Pill active={false}>Clarity 92</Pill>
            <Pill active={false}>Keywords 84</Pill>
          </div>
        </SageFooter>
      }
    >
      <div className="relative mx-auto flex min-h-[15rem] max-w-[16rem] items-center justify-center">
        <div className="pointer-events-none absolute h-44 w-44 rounded-full bg-[#F9A826]/10 blur-2xl" />
        <div className="relative">
          <svg viewBox="0 0 120 120" className="h-44 w-44 -rotate-90">
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="7"
            />
            <motion.circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="#F9A826"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={C}
              style={{ filter: 'drop-shadow(0 0 8px rgba(249,168,38,0.6))' }}
              initial={reduce ? { strokeDashoffset: C * 0.08 } : { strokeDashoffset: C }}
              animate={reduce ? undefined : { strokeDashoffset: [C, C * 0.08] }}
              transition={{ duration: 2.6, repeat: reduce ? 0 : Infinity, ease: 'easeInOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-3xl font-semibold text-white">92%</span>
          </div>
        </div>
      </div>
    </BentoShell>
  );
}

/* ---------------------------------------------------------------- */
/* Card 03 — Match: node connections + traveling match pulses        */
/* ---------------------------------------------------------------- */

const NODE_LINKS = [
  { x: 38, y: 46 },
  { x: 162, y: 46 },
  { x: 100, y: 132 },
];

function NodesBento() {
  const reduce = useReducedMotion();

  return (
    <BentoShell
      label="Live matching"
      footer={
        <SageFooter>
          <Pill active={false}>3 live matches</Pill>
        </SageFooter>
      }
    >
      <div className="relative mx-auto flex min-h-[15rem] max-w-[16rem] items-center justify-center">
        <svg viewBox="0 0 200 172" className="w-full">
          {NODE_LINKS.map((p, i) => (
            <line
              key={`l${i}`}
              x1="100"
              y1="86"
              x2={p.x}
              y2={p.y}
              stroke="rgba(255,255,255,0.14)"
              strokeWidth="1.2"
            />
          ))}
          {NODE_LINKS.map((p, i) => (
            <circle
              key={`n${i}`}
              cx={p.x}
              cy={p.y}
              r="15"
              fill="rgba(255,255,255,0.03)"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="1"
            />
          ))}
          <circle
            cx="100"
            cy="86"
            r="20"
            fill="rgba(249,168,38,0.08)"
            stroke="#F9A826"
            strokeWidth="1.5"
            style={{ filter: 'drop-shadow(0 0 12px rgba(249,168,38,0.5))' }}
          />
          <circle cx="100" cy="86" r="6" fill="#F9A826" />
          {!reduce &&
            NODE_LINKS.map((p, i) => (
              <motion.circle
                key={`t${i}`}
                r="3.5"
                fill="#F9A826"
                style={{ filter: 'drop-shadow(0 0 6px rgba(249,168,38,0.9))' }}
                animate={{ cx: [100, p.x], cy: [86, p.y] }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  repeatDelay: 1.6 - i * 0.3,
                  delay: i * 0.6,
                  ease: 'easeInOut',
                }}
              />
            ))}
        </svg>
      </div>
    </BentoShell>
  );
}

/* ---------------------------------------------------------------- */
/* Card 04 — Offer: pipeline tracker, dot lands on Offer + glow      */
/* ---------------------------------------------------------------- */

const STAGES = [
  { x: 24, label: 'Apply' },
  { x: 132, label: 'Interview' },
  { x: 240, label: 'Offer' },
];
const TRAVEL = 2.6;
const REST = 0.8;
const CYCLE = TRAVEL + REST;

function PipelineBento() {
  const reduce = useReducedMotion();
  const offerX = STAGES[2].x;

  return (
    <BentoShell
      label="Pipeline tracker"
      footer={
        <SageFooter>
          <Pill>Offer received</Pill>
        </SageFooter>
      }
    >
      <div className="relative mx-auto flex min-h-[15rem] max-w-[17rem] items-center justify-center">
        <svg viewBox="0 0 264 118" className="w-full">
          <line
            x1="24"
            y1="52"
            x2="240"
            y2="52"
            stroke="rgba(255,255,255,0.10)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <motion.line
            x1="24"
            y1="52"
            x2="240"
            y2="52"
            stroke="#F9A826"
            strokeWidth="2"
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 0 6px rgba(249,168,38,0.8))' }}
            pathLength={1}
            initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
            animate={reduce ? undefined : { pathLength: 1 }}
            transition={{ duration: TRAVEL, repeat: reduce ? 0 : Infinity, repeatDelay: REST, ease: 'easeInOut' }}
          />
          {STAGES.map((s, i) => (
            <circle
              key={`s${i}`}
              cx={s.x}
              cy="52"
              r={i === 2 ? 6 : 5}
              fill="#0A0A0A"
              stroke={i === 2 ? '#F9A826' : 'rgba(255,255,255,0.25)'}
              strokeWidth="1.5"
            />
          ))}
          <motion.circle
            cx={offerX}
            cy="52"
            fill="none"
            stroke="#F9A826"
            strokeWidth="1.5"
            initial={{ r: 5, opacity: 0.7 }}
            animate={reduce ? undefined : { r: [5, 22], opacity: [0.7, 0] }}
            transition={{
              duration: 1.4,
              repeat: reduce ? 0 : Infinity,
              repeatDelay: CYCLE - 1.4,
              delay: reduce ? 0 : TRAVEL,
              ease: 'easeOut',
            }}
          />
          {!reduce && (
            <motion.circle
              r="4"
              fill="#F9A826"
              style={{ filter: 'drop-shadow(0 0 6px rgba(249,168,38,0.95))' }}
              animate={{ cx: [24, offerX], cy: [52, 52] }}
              transition={{ duration: TRAVEL, repeat: Infinity, repeatDelay: REST, ease: 'easeInOut' }}
            />
          )}
          {STAGES.map((s, i) => (
            <text
              key={`l${i}`}
              x={s.x}
              y="78"
              textAnchor="middle"
              fontSize="10"
              fontFamily="var(--font-mono)"
              letterSpacing="0.12em"
              className={i === 2 ? 'fill-[#F9A826]' : 'fill-gray-500'}
            >
              {s.label}
            </text>
          ))}
        </svg>
      </div>
    </BentoShell>
  );
}