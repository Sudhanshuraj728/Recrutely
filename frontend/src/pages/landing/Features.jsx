import {
  FileText,
  Briefcase,
  FolderKanban,
  Building2,
  Share2,
  LayoutTemplate,
} from 'lucide-react';
import { Section } from './Section';
import { Stagger, StaggerChild } from './Reveal';

const FEATURES = [
  {
    icon: FileText,
    title: 'ATS-safe resumes',
    body: 'Templates built to parse cleanly through applicant tracking systems, with the layout you want.',
  },
  {
    icon: Briefcase,
    title: 'Live job matching',
    body: 'Roles ranked by how well they fit your profile, updated as the market moves.',
  },
  {
    icon: FolderKanban,
    title: 'Application pipeline',
    body: 'Track every application, from first click to offer, in one calendar view.',
  },
  {
    icon: Building2,
    title: 'Company research',
    body: 'Insight on culture, funding, and hiring momentum before you invest a minute.',
  },
  {
    icon: Share2,
    title: 'Network intelligence',
    body: 'Find the warmest path into every opening and the message to start it.',
  },
  {
    icon: LayoutTemplate,
    title: 'Professional templates',
    body: 'A library of clean, recruiter-approved designs for every stage of your search.',
  },
];

/**
 * Features — an editorial, numbered capability list (Saffron-style "big
 * numeral + em dash") instead of a generic card grid.
 */
export function Features() {
  return (
    <Section
      id="features"
      eyebrow="Everything in one place"
      title="A complete toolkit for the modern job search"
      description="No more juggling spreadsheets, tabs, and guesswork. Every part of your search lives together."
      className="border-t border-[var(--color-border)]"
    >
      <Stagger>
        <ol className="grid gap-x-16 gap-y-0 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <StaggerChild key={f.title} className="h-full">
              <Item {...f} i={i} />
            </StaggerChild>
          ))}
        </ol>
      </Stagger>
    </Section>
  );
}

function Item({ icon: Icon, title, body, i }) {
  return (
    <li className="group flex h-full flex-col border-b border-[var(--color-border)] py-8">
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm text-[var(--color-primary)]">
          {String(i + 1).padStart(2, '0')}—
        </span>
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border-strong)] text-[var(--color-primary)] transition-colors group-hover:border-[var(--color-primary)]">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <h3 className="mt-6 text-xl font-medium text-[var(--color-text)]">{title}</h3>
      <p className="mt-2 text-base leading-[var(--leading-body)] text-[var(--color-text-muted)]">
        {body}
      </p>
    </li>
  );
}