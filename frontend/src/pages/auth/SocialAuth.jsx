import { cn } from '../../lib/cn';
import { useState } from 'react';
import { AuthTransition } from './AuthTransition';

const GOOGLE_SVG = (
  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A11 11 0 0 0 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52Z"
    />
  </svg>
);

const LINKEDIN_SVG = (
  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="currentColor">
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.55V9h3.57v11.45Z" />
  </svg>
);

/**
 * SocialAuth — Google / LinkedIn OAuth buttons. These trigger the existing
 * full-page redirect flows (the backend owns the OAuth handshake), so they
 * do not call the API client directly.
 */
export function SocialAuth({ className }) {
  const [loading, setLoading] = useState(false);

  return (
    <>
      <AuthTransition phase={loading ? 'loading' : null} />
      <div className={cn('grid gap-3', className)}>
      <OAuthButton href="/auth/google" icon={GOOGLE_SVG} onStart={() => setLoading(true)}>
        Continue with Google
      </OAuthButton>
      <OAuthButton href="/auth/linkedin" icon={LINKEDIN_SVG} tone="linkedin" onStart={() => setLoading(true)}>
        Continue with LinkedIn
      </OAuthButton>
      </div>
    </>
  );
}

function OAuthButton({ href, icon, children, tone = 'default', onStart }) {
  return (
    <a
      href={href}
      onClick={(event) => {
        event.preventDefault();
        sessionStorage.setItem('recrutely-oauth-pending', '1');
        onStart?.();
        window.setTimeout(() => window.location.assign(href), 450);
      }}
      className={cn(
        'inline-flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-[var(--color-text)] transition-[background-color,border-color,color,transform] hover:border-white/20 hover:bg-white/10 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring-color)]',
        tone === 'linkedin'
          ? ''
          : ''
      )}
    >
      {icon}
      <span className="hidden sm:inline">{children}</span>
      <span className="sm:hidden">
        {tone === 'linkedin' ? 'LinkedIn' : 'Google'}
      </span>
    </a>
  );
}
