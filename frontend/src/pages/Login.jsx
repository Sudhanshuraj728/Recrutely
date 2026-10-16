import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { LogIn, Mail, Lock } from 'lucide-react';
import { Button, Field, Input, useToast } from '../components/ui';
import { authService } from '../services';
import { useAuthContext } from '../context/AuthContext';
import { AuthLayout } from './auth/AuthLayout';
import { PasswordInput } from './auth/PasswordInput';
import { SocialAuth } from './auth/SocialAuth';
import { Divider, Banner } from './auth/shared';
import { AuthTransition } from './auth/AuthTransition';
import { validateEmail, validatePassword } from './auth/validation';

const initialState = { email: '', password: '' };

/**
 * Login — email/password sign-in with the existing backend flow preserved.
 * Includes field validation, loading, API error banner, OAuth buttons, and
 * redirect to the dashboard on success. Honors ?login=success from OAuth.
 */
export default function Login() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { user, setUser, refreshUser } = useAuthContext();
  const { toast } = useToast();

  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successNotice, setSuccessNotice] = useState('');
  const [greetingName, setGreetingName] = useState('');
  const [oauthPhase, setOauthPhase] = useState(() => {
    const success = params.get('login') === 'success' || params.get('google') === 'success' || params.get('linkedin') === 'success';
    return success ? 'success' : (sessionStorage.getItem('recrutely-oauth-pending') ? 'loading' : null);
  });

  // Handle OAuth completion markers set by the backend redirects.
  useEffect(() => {
    const oauthSuccess = params.get('login') === 'success' || params.get('google') === 'success' || params.get('linkedin') === 'success';
    if (oauthSuccess) {
      sessionStorage.removeItem('recrutely-oauth-pending');
      setOauthPhase('success');
      setGreetingName(user?.name?.split(' ')[0] || '');
      setSuccessNotice('Signed in successfully. Welcome back!');
      refreshUser();
      const t = setTimeout(() => navigate('/dashboard', { replace: true }), 900);
      return () => clearTimeout(t);
    }
    if (params.get('error')) {
      const reason = params.get('error');
      const messages = {
        linkedin_not_configured: 'LinkedIn sign-in is not configured. Contact the administrator.',
        linkedin_denied: 'You cancelled the LinkedIn sign-in or it was blocked by LinkedIn.',
        linkedin_no_email: 'LinkedIn did not return an email address. Make sure your LinkedIn app has the "Sign In with LinkedIn using OpenID Connect" product enabled.',
        linkedin_failed: 'Could not connect to LinkedIn. Verify that LINKEDIN_CALLBACK_URL matches the redirect URI registered in your LinkedIn app settings.',
        login_failed: 'Sign-in failed. Please try again.',
        linkedin_error: 'LinkedIn connection hit an unexpected error. Check the server log for details.',
      };
      setApiError(messages[reason] || 'Social sign-in could not be completed. Please try again.');
    }
  }, [params, navigate, refreshUser]);

  const setField = (key) => (e) => {
    const value = e.target.value;
    setValues((v) => ({ ...v, [key]: value }));
    if (touched[key]) {
      const err =
        key === 'email'
          ? validateEmail(value)
          : validatePassword(value);
      setErrors((prev) => ({ ...prev, [key]: err }));
    }
  };

  const onBlur = (key) => () => {
    setTouched((t) => ({ ...t, [key]: true }));
    const value = values[key];
    const err =
      key === 'email'
        ? validateEmail(value)
        : validatePassword(value);
    setErrors((prev) => ({ ...prev, [key]: err }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const emailErr = validateEmail(values.email);
    const passErr = validatePassword(values.password);
    const nextErrors = { email: emailErr, password: passErr };
    setErrors(nextErrors);
    setTouched({ email: true, password: true });
    setApiError('');

    if (emailErr || passErr) return;

    setSubmitting(true);
    try {
      const data = await authService.login({
        email: values.email.trim(),
        password: values.password,
      });
      setUser(data?.user || data);
      setGreetingName(data?.user?.name?.split(' ')[0] || data?.name?.split(' ')[0] || values.email.split('@')[0]);
      setOauthPhase('success');
      setSuccessNotice('Signed in successfully. Taking you to your dashboard…');
      toast({ title: 'Welcome back', message: "You're signed in.", variant: 'success' });
      setTimeout(() => navigate('/dashboard', { replace: true }), 600);
    } catch (err) {
      setApiError(err?.message || 'Unable to sign in. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
    <AuthTransition phase={oauthPhase} name={greetingName} />
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in to Recrutely"
      description="Pick up right where you left off — your matches, analysis, and pipeline are waiting."
    >
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <SocialAuth className="mb-2" />

        <Divider label="or continue with email" />

        <Banner message={apiError} tone="error" onDismiss={() => setApiError('')} />
        <Banner message={successNotice} tone="success" />

        <Field label="Email" required error={touched.email ? errors.email : ''} htmlFor="login-email">
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-[var(--color-text-subtle)]" aria-hidden="true" />
            <Input
              id="login-email"
              name="email"
              type="email"
              size="lg"
              autoComplete="email"
              placeholder="you@example.com"
              value={values.email}
              onChange={setField('email')}
              onBlur={onBlur('email')}
              invalid={Boolean(touched.email && errors.email)}
              className="pl-10"
            />
          </div>
        </Field>

        <Field label="Password" required error={touched.password ? errors.password : ''} htmlFor="login-password">
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-[var(--color-text-subtle)]" aria-hidden="true" />
            <PasswordInput
              id="login-password"
              name="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={values.password}
              onChange={setField('password')}
              onBlur={onBlur('password')}
              invalid={Boolean(touched.password && errors.password)}
              className="pl-10"
            />
          </div>
        </Field>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <input
              id="login-remember"
              type="checkbox"
              className="h-4 w-4 rounded border-[var(--color-border-strong)] bg-[var(--color-bg-inset)] accent-[var(--color-primary)]"
            />
            <label htmlFor="login-remember" className="text-sm text-[var(--color-text-muted)]">
              Remember me
            </label>
          </div>
          <Link
            to="/login"
            className="text-sm font-medium text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ring-color)]"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" size="lg" className="w-full" loading={submitting}>
          {!submitting && <LogIn className="h-4 w-4" />}
          Sign in
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-[var(--color-text-muted)]">
        Don’t have an account?{' '}
        <Link
          to="/signup"
          className="font-semibold text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ring-color)]"
        >
          Create one free
        </Link>
      </p>
    </AuthLayout>
    </>
  );
}

