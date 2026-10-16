import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { cn } from '../../lib/cn';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { Section } from './Section';
import { Reveal } from './Reveal';

const ITEMS = [
  {
    q: 'How does Recrutely analyze my resume?',
    a: 'Upload your resume as a PDF or paste it in. Recrutely runs an ATS-aware audit: a 0–100 clarity score, keyword coverage against the roles you want, and inline edits you can approve in one click.',
  },
  {
    q: 'Is my resume and data kept private?',
    a: 'Yes. Documents are used only to generate your analysis and match recommendations. Your data is encrypted in transit and at rest, and you can delete it at any time from Settings.',
  },
  {
    q: 'What does the free plan include?',
    a: 'The free plan includes 3 resume analyses per month, 2 templates, 5 job matches per week, and a basic network map — no credit card required.',
  },
  {
    q: 'How accurate is the job matching?',
    a: 'Matches are scored across skills, seniority, and culture to surface your best-fit roles first. Real-time match scores are shown on every role, so you know your odds before you apply.',
  },
  {
    q: 'Can I cancel my Pro subscription anytime?',
    a: 'Absolutely. Upgrade or cancel in one click from Settings. Pro gives you unlimited analyses, all templates, unlimited matching, and priority support — then billing stops when you cancel.',
  },
];

/**
 * FAQ — Saffron-style frequently-asked-questions accordion. Heading on the
 * left, expandable items on the right with a rotating plus indicator.
 */
export function FAQ() {
  return (
    <Section id="faq" className="bg-[var(--color-bg-secondary)]/40">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
        <Reveal>
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow">FAQ</p>
            <h2 className="mt-6 text-h2 leading-[1.02] text-[var(--color-text)]">
              Frequently
              <br />
              asked
              <br />
              questions
            </h2>
            <p className="mt-5 max-w-sm text-base leading-[var(--leading-body)] text-[var(--color-text-muted)]">
              Everything you need to know about analyzing resumes, matching
              roles, and going Pro.
            </p>
            <Link
              to="/pricing"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-hover)]"
            >
              See all FAQ
            </Link>
          </div>
        </Reveal>

        <div>
          {ITEMS.map((item, i) => (
            <Reveal key={item.q} delay={i * 0.05}>
              <AccordionItem {...item} initialOpen={i === 0} />
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

function AccordionItem({ q, a, initialOpen = false }) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(initialOpen);

  return (
    <div className="border-b border-[var(--color-border)]">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="group flex w-full items-center justify-between gap-6 py-6 text-left"
      >
        <h3
          className={cn(
            'text-xl font-medium transition-colors sm:text-2xl',
            open ? 'text-[var(--color-primary)]' : 'text-[var(--color-text)] group-hover:text-[var(--color-primary)]'
          )}
        >
          {q}
        </h3>
        <Plus
          aria-hidden="true"
          className={cn(
            'h-6 w-6 shrink-0 text-[var(--color-primary)] transition-transform duration-300',
            open && 'rotate-45'
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pb-7 text-base leading-[var(--leading-body)] text-[var(--color-text-muted)]">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}