import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Logo } from '../../components/layout/Logo';
import { Button } from '../../components/ui';

const LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Templates', href: '#templates' },
  { label: 'Pricing', href: '#pricing' },
];

const BROWN = '#4b1b0e';

/**
 * LandingNavbar — Saffron-inspired fixed marketing navbar.
 * Logo left, a few small links center, one light pill CTA and a circular menu
 * button right, with a very thin warm-brown bottom border always visible.
 */
export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-[var(--z-header)] border-b transition-[background-color,box-shadow,border-color,backdrop-filter] duration-[var(--motion-base)]',
        'bg-black/45 backdrop-blur-xl'
      )}
      style={{
        borderColor: 'rgba(255,255,255,0.10)',
        boxShadow: scrolled ? '0 10px 30px rgba(0,0,0,0.22)' : 'none',
      }}
    >
      <div className="container">
        <div className="flex items-center justify-between py-4">
          <Logo />

          <nav aria-label="Primary" className="hidden items-center md:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-[var(--radius-pill)] px-4 py-2 text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-primary)]"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <Link
                to="/signup"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: '#fff',
                  color: '#0a0a0a',
                  borderRadius: '9999px',
                  padding: '0.55rem 1.35rem',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  lineHeight: 1,
                  textDecoration: 'none',
                  boxShadow: '0 5px 18px rgba(0,0,0,0.22)',
                  transition: 'background 0.18s, transform 0.18s, box-shadow 0.18s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#f9a826';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(249,168,38,0.28)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#fff';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 5px 18px rgba(0,0,0,0.22)';
                }}
              >
                Get started
                <ArrowRight style={{ width: '0.875rem', height: '0.875rem' }} />
              </Link>
            </div>
            <button
              type="button"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
              style={{ borderColor: BROWN }}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          'overflow-hidden bg-[var(--color-bg)]/95 transition-[max-height,opacity] duration-[var(--motion-base)]',
          open
            ? 'max-h-96 border-t opacity-100'
            : 'max-h-0 opacity-0'
        )}
        style={{ borderColor: BROWN }}
      >
        <nav
          aria-label="Primary mobile"
          className="container flex flex-col gap-1 py-3"
        >
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-[var(--radius-2)] px-3 py-2.5 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-primary)]"
            >
              {l.label}
            </a>
          ))}
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Button asChild variant="secondary" size="md">
              <Link to="/login" onClick={() => setOpen(false)}>
                Sign in
              </Link>
            </Button>
            <Button asChild size="md">
              <Link to="/signup" onClick={() => setOpen(false)}>
                Get started
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}