import { CheckCircle2, AlertCircle, Lightbulb, FileText } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Reveal } from './Reveal';
import { Section } from './Section';

const WINS = [
  'Strong action verbs and quantified results',
  'Targeted keywords for your role',
  'Clear, scannable section structure',
];

const GAPS = [
  'Add metrics to 3 project bullets',
  'Missing keyword: “stakeholder management”',
  'Roles should use past tense consistently',
];

/**
 * ResumeAnalysis — feature storytelling for resume scoring. Left: narrative
 * text with numbered points; right: the actual Recrutely analysis result
 * rendered as a warm "paper" card.
 */
export function ResumeAnalysis() {
  return (
    <Section
      eyebrow="Resume intelligence"
      title="See every blind spot before a recruiter does"
      description="An instant, ATS-aware audit of your resume: a clarity score, keyword coverage, and targeted edits you can apply in one click."
      align="left"
      className="bg-[var(--color-bg-secondary)]/40"
    >
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <Reveal className="order-2 lg:order-1">
          <div className="space-y-8">
            <FeaturePoint
              icon={FileText}
              n="01"
              title="One-click clarity score"
              body="A 0–100 score that maps exactly where your resume stands against the roles you want."
            />
            <FeaturePoint
              icon={CheckCircle2}
              n="02"
              title="Keyword coverage"
              body="We detect the terms recruiters and ATS filters scan for, and tell you what’s missing."
            />
            <FeaturePoint
              icon={Lightbulb}
              n="03"
              title="Edits you can apply"
              body="Suggested rewrites for weak bullets, delivered inline so you can approve them instantly."
            />
          </div>
        </Reveal>

        <Reveal delay={0.1} className="order-1 lg:order-2">
          <AnalysisCard />
        </Reveal>
      </div>
    </Section>
  );
}

function FeaturePoint({ icon: Icon, n, title, body }) {
  return (
    <div className="flex gap-5">
      <div className="flex shrink-0 flex-col items-center">
        <span className="font-mono text-xs text-[var(--color-primary)]">{n}</span>
        <span aria-hidden="true" className="mt-2 h-px w-8 bg-[var(--color-border-strong)]" />
        <span className="mt-2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-primary)]/30 text-[var(--color-primary)]">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <div>
        <h3 className="text-lg font-medium text-[var(--color-text)]">{title}</h3>
        <p className="mt-1.5 text-base leading-[var(--leading-body)] text-[var(--color-text-muted)]">
          {body}
        </p>
      </div>
    </div>
  );
}

function AnalysisCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111111] text-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-cream-ink)] text-[var(--color-cream)]">
            <FileText className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold">Product Manager</p>
            <p className="font-mono text-xs text-gray-400">resume.pdf · 2 pages</p>
          </div>
        </div>
        <span className="text-3xl font-semibold text-[var(--color-primary-active)]">78</span>
      </div>

      <div className="space-y-6 px-6 py-6">
        <div>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-gray-400">
            What’s working
          </p>
          <ul className="space-y-2.5">
            {WINS.map((w, i) => (
              <ScoreRow key={i} tone="success" text={w} />
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-gray-400">
            Quick wins to unlock
          </p>
          <ul className="space-y-2.5">
            {GAPS.map((g, i) => (
              <ScoreRow key={i} tone="warn" text={g} />
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] py-4 pl-4">
          <span aria-hidden="true" className="h-full w-1 self-stretch rounded-full bg-[var(--color-primary-active)]" />
          <p className="text-sm text-gray-300">
            Apply these focused fixes to make your resume clearer, stronger, and easier to scan.
          </p>
        </div>
      </div>
    </div>
  );
}

function ScoreRow({ tone, text }) {
  const Icon = tone === 'success' ? CheckCircle2 : AlertCircle;
  return (
    <li className="flex items-center gap-3 text-sm">
      <Icon
        className={cn(
          'h-4 w-4 shrink-0',
          tone === 'success' ? 'text-[var(--color-success)]' : 'text-[var(--color-warning)]'
        )}
      />
      <span className="text-gray-200">{text}</span>
    </li>
  );
}