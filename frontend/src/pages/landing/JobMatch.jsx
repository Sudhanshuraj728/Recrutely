import { motion } from 'framer-motion';
import { Briefcase, MapPin, Filter, Zap } from 'lucide-react';
import { Reveal } from './Reveal';
import { Section } from './Section';

const JOBS = [
  { role: 'Senior Product Designer', org: 'Best-fit role', loc: 'Remote', match: 96, skills: 5 },
  { role: 'Lead UX Designer', org: 'Strong match', loc: 'Hybrid', match: 91, skills: 4 },
  { role: 'Product Design Manager', org: 'Potential match', loc: 'Remote', match: 84, skills: 4 },
];

/**
 * JobMatch — feature storytelling around smart matching. Right: numbered
 * narrative; left: the CareerCraft job-match rail rendered as a paper card.
 */
export function JobMatch() {
  return (
    <Section
      id="jobs"
      eyebrow="Smart matching"
      title="Only apply where you actually fit"
      description="CareerCraft ranks live roles by how well your profile matches — skills, seniority, and culture — so your time goes to the best-fit opportunities first."
      align="left"
    >
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <Reveal delay={0.1} className="order-1 lg:order-2">
          <div className="space-y-8">
            <FeaturePoint
              icon={MapPin}
              n="01"
              title="Live role matching"
              body="Continuous matches across seniority, location, and company stage."
            />
            <FeaturePoint
              icon={Filter}
              n="02"
              title="Drill into the signal"
              body="Every match breaks down which skills you hit and which to shore up."
            />
            <FeaturePoint
              icon={Zap}
              n="03"
              title="Apply with context"
              body="Go in with a tailored resume and a clear sense of your odds from the start."
            />
          </div>
        </Reveal>

        <Reveal className="order-2 lg:order-1">
          <MatchCard />
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

function MatchCard() {
  return (
    <div className="paper overflow-hidden rounded-[var(--radius-4)] shadow-[var(--shadow-floating)]">
      <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">
        <p className="text-sm font-semibold text-[var(--color-cream-ink)]">
          Recommended for you
        </p>
        <span className="rounded-full bg-[var(--color-cream-ink)] px-3 py-1 font-mono text-xs uppercase tracking-wider text-[var(--color-cream)]">
          Best match 96%
        </span>
      </div>
      <ul className="divide-y divide-black/10">
        {JOBS.map((job, i) => (
          <JobRow key={job.role} job={job} index={i} />
        ))}
      </ul>
      <div className="border-t border-black/10 px-6 py-4 text-center">
        <p className="font-mono text-xs uppercase tracking-wider text-black/45">
          Example match results · personalized after you upload your resume
        </p>
      </div>
    </div>
  );
}

function JobRow({ job, index }) {
  return (
    <li className="group cursor-pointer bg-[var(--color-cream)] transition-colors hover:bg-[var(--color-cream-muted)]">
      <div className="flex items-start justify-between gap-3 px-6 py-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[var(--color-cream-ink)] group-hover:text-[var(--color-primary-active)]">
            {job.role}
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 font-mono text-xs text-black/55">
            <Briefcase className="h-3 w-3" />
            {job.org} · {job.loc}
          </p>
          <div className="mt-3 h-1.5 w-full max-w-[12rem] overflow-hidden rounded-full bg-black/10">
            <motion.div
              className="h-full rounded-full bg-[linear-gradient(90deg,var(--color-primary-active),var(--color-primary))]"
              initial={{ width: 0 }}
              whileInView={{ width: `${job.match}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.15 * index, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>
        <span className="shrink-0 text-lg font-bold text-[var(--color-cream-ink)]">
          {job.match}
          <span className="text-xs font-medium text-black/45">%</span>
        </span>
      </div>
    </li>
  );
}