import { Link } from 'react-router-dom';
import { Logo } from '../../components/layout/Logo';

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'Resume analysis', to: '/resume' },
      { label: 'Job matching', to: '/jobs' },
      { label: 'Companies', to: '/companies' },
      { label: 'Templates', to: '/templates' },
    ],
  },
  {
    title: 'Career',
    links: [
      { label: 'Applications', to: '/applications' },
      { label: 'Networking', to: '/networking' },
      { label: 'Pricing', to: '/pricing' },
      { label: 'Settings', to: '/settings' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Dashboard', to: '/dashboard' },
      { label: 'Profile', to: '/profile' },
      { label: 'Sign in', to: '/login' },
      { label: 'Create account', to: '/signup' },
    ],
  },
];

/**
 * Footer — Saffron-inspired editorial footer: near-black canvas, mono
 * column labels, gold hover links, and a slim legal row.
 */
export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-black">
      <div className="container py-16 sm:py-20">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_2fr]">
          {/* Brand */}
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-sm leading-[var(--leading-body)] text-[var(--color-text-muted)]">
              Turn your resume into a career strategy. Built for job seekers
              who want to move with intent.
            </p>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-text-subtle)]">
                  {col.title}
                </p>
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        to={l.to}
                        className="text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ring-color)]"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-[var(--color-border)] pt-8 font-mono text-xs uppercase tracking-wider text-[var(--color-text-subtle)] sm:flex-row">
          <p>© {new Date().getFullYear()} Recrutely</p>
          <p>AI-powered career tools</p>
          <p>
            Made with <span className="text-[var(--color-primary)]">intent</span>
          </p>
        </div>
      </div>
    </footer>
  );
}