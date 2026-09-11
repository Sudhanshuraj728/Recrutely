/**
 * Client-side validation rules, mirroring the backend express-validator
 * rules so users get fast feedback before a round-trip. The server remains
 * the source of truth; these only improve the UX.
 */
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function validateEmail(value) {
  if (!value || !value.trim()) return 'Email is required';
  if (!EMAIL_RE.test(value.trim())) return 'Enter a valid email address';
  return '';
}

export function validatePassword(value, { min = 1 } = {}) {
  if (!value) return 'Password is required';
  if (value.length < min)
    return `Password must be at least ${min} characters`;
  return '';
}

export function validateSignupPassword(value) {
  if (!value) return 'Password is required';
  if (value.length < 8) return 'Password must be at least 8 characters';
  if (!/[a-z]/.test(value)) return 'Include a lowercase letter';
  if (!/[A-Z]/.test(value)) return 'Include an uppercase letter';
  if (!/\d/.test(value)) return 'Include a number';
  return '';
}

export function validateName(value) {
  if (!value || !value.trim()) return 'Name is required';
  if (value.trim().length < 2) return 'Name must be at least 2 characters';
  if (value.trim().length > 50) return 'Name must be 50 characters or less';
  return '';
}
