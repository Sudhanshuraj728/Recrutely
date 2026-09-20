import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, UserRound, UserPlus } from 'lucide-react';
import { Button, Field, Input, useToast } from '../components/ui';
import { authService } from '../services';
import { useAuthContext } from '../context/AuthContext';
import { AuthLayout } from './auth/AuthLayout';
import { PasswordInput } from './auth/PasswordInput';
import { SocialAuth } from './auth/SocialAuth';
import { Divider, Banner, PasswordStrength } from './auth/shared';
import { AuthTransition } from './auth/AuthTransition';
import {
  validateName,
  validateEmail,
  validateSignupPassword,
} from './auth/validation';

const initialState = { name: '', email: '', password: '', confirm: '' };

/**
 * Signup — create account with the existing backend flow preserved.
 * Client-side validation mirrors the server (name 2–50, valid email,
 * password ≥8 with upper/lower/digit), loading + error/success states,
 * and a password strength meter. Registration auto-logs you in.
 */
export default function Signup() {
  const navigate = useNavigate();
  const { setUser } = useAuthContext();
  const { toast } = useToast();

  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [terms, setTerms] = useState(false);
  const [termsTouched, setTermsTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successNotice, setSuccessNotice] = useState('');
  const [successPhase, setSuccessPhase] = useState(false);

  const validators = {
    name: validateName,
    email: validateEmail,
    password: validateSignupPassword,
    confirm: (v) => {
      if (!v) return 'Please confirm your password';
      return v !== values.password ? 'Passwords do not match' : '';
    },
  };

  const setField = (key) => (e) => {
    const value = e.target.value;
    setValues((v) => ({ ...v, [key]: value }));
    if (touched[key]) {
      setErrors((prev) => ({ ...prev, [key]: validators[key](value) }));
    }
  };

  const onBlur = (key) => () => {
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors((prev) => ({ ...prev, [key]: validators[key](values[key]) }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = {
      name: validators.name(values.name),
      email: validators.email(values.email),
      password: validators.password(values.password),
      confirm: validators.confirm(values.confirm),
    };
    setErrors(nextErrors);
    setTouched({ name: true, email: true, password: true, confirm: true });
    setTermsTouched(true);
    setApiError('');

    if (Object.values(nextErrors).some(Boolean) || !terms) {
      if (!terms) toast({ title: 'Terms required', message: 'Please accept the Terms of Service to continue.', variant: 'warning' });
      return;
    }

    setSubmitting(true);
    try {
      const data = await authService.register({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
      });
      setUser(data?.user || data);
      setSuccessPhase(true);
      setSuccessNotice('Account created. Welcome to CareerCraft!');
      toast({
        title: 'Account created',
        message: 'Welcome aboard. Setting up your workspace…',
        variant: 'success',
      });
      setTimeout(() => navigate('/dashboard', { replace: true }), 900);
    } catch (err) {
      setApiError(err?.message || 'Unable to create your account. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
    <AuthTransition phase={successPhase ? 'success' : null} name={values.name.trim().split(' ')[0]} />
    <AuthLayout
      eyebrow="Get started"
      title="Create your free account"
      description="Start with a free resume analysis and see your first matches today."
    >
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <SocialAuth className="mb-2" />

        <Divider label="or sign up with email" />

        <Banner message={apiError} tone="error" onDismiss={() => setApiError('')} />
        <Banner message={successNotice} tone="success" />

        <Field label="Full name" required error={touched.name ? errors.name : ''} htmlFor="signup-name">
          <div className="relative">
            <UserRound className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-[var(--color-text-subtle)]" aria-hidden="true" />
            <Input
              id="signup-name"
              name="name"
              type="text"
              size="lg"
              autoComplete="name"
              placeholder="Jane Doe"
              value={values.name}
              onChange={setField('name')}
              onBlur={onBlur('name')}
              invalid={Boolean(touched.name && errors.name)}
              className="pl-10"
            />
          </div>
        </Field>

        <Field label="Email" required error={touched.email ? errors.email : ''} htmlFor="signup-email">
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-[var(--color-text-subtle)]" aria-hidden="true" />
            <Input
              id="signup-email"
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

        <Field label="Password" required error={touched.password ? errors.password : ''} htmlFor="signup-password">
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-[var(--color-text-subtle)]" aria-hidden="true" />
            <PasswordInput
              id="signup-password"
              name="password"
              autoComplete="new-password"
              placeholder="8+ characters, with upper, lower & number"
              value={values.password}
              onChange={setField('password')}
              onBlur={onBlur('password')}
              invalid={Boolean(touched.password && errors.password)}
              className="pl-10"
            />
          </div>
          <PasswordStrength value={values.password} />
        </Field>

        <Field label="Confirm password" required error={touched.confirm ? errors.confirm : ''} htmlFor="signup-confirm">
          <PasswordInput
            id="signup-confirm"
            name="confirm"
            autoComplete="new-password"
            placeholder="Re-enter your password"
            value={values.confirm}
            onChange={setField('confirm')}
            onBlur={onBlur('confirm')}
            invalid={Boolean(touched.confirm && errors.confirm)}
          />
        </Field>

        <div className="flex items-start gap-2.5 pt-1">
          <input
            id="signup-terms"
            type="checkbox"
            checked={terms}
            onChange={(e) => setTerms(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-[var(--color-border-strong)] bg-[var(--color-bg-inset)] accent-[var(--color-primary)]"
            aria-invalid={termsTouched && !terms}
          />
          <label htmlFor="signup-terms" className="text-sm leading-snug text-[var(--color-text-muted)]">
            I agree to the{' '}
            <a href="/terms" className="font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]">
              Privacy Policy
            </a>
            .
          </label>
        </div>

        <Button type="submit" size="lg" className="w-full" loading={submitting}>
          {!submitting && <UserPlus className="h-4 w-4" />}
          Create account
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-[var(--color-text-muted)]">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-semibold text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--ring-color)]"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
    </>
  );
}
