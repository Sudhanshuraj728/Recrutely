import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Reveal } from './Reveal';

/**
 * CtaBand — the full-bleed closing call to action before the footer.
 * Editorial: a giant statement on the left, a hairline-ruled action column
 * on the right. Recrutely content, Saffron composition.
 */
export function CtaBand() {
  return (
    <section className="flex min-h-[100dvh] items-center overflow-hidden border-t border-[var(--color-border)] bg-[#000]">
      <div className="container py-32 lg:py-44">
        <div className="grid items-end gap-14 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Reveal>
              <p className="eyebrow">Start today</p>
              <h2 className="mt-8 max-w-4xl text-[clamp(2.75rem,8vw,7rem)] leading-[var(--leading-display-xl)] tracking-tight text-[var(--color-text)] [font-weight:var(--weight-display)]">
                Turn your resume into a{' '}
                <span className="text-[var(--color-primary)]">career strategy.</span>
              </h2>
            </Reveal>
          </div>

          <div className="lg:col-span-4">
            <Reveal delay={0.1}>
              <div className="border-l border-[var(--color-border)] pl-8 lg:pl-10">
                <p className="max-w-sm text-base leading-[var(--leading-body)] text-[var(--color-text-muted)]">
                  Free forever plan, or go Pro for unlimited analyses,
                  all templates, and unlimited matching.
                </p>
                <div className="mt-10 flex flex-col items-start gap-4">
                  <Link to="/signup" className="pill pill-gold pill-lg">
                    Start free
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link to="/resume" className="pill pill-outline">
                    Analyze my resume
                  </Link>
                </div>
                <p className="mt-10 font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-text-subtle)]">
                  No credit card required · Cancel anytime
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}