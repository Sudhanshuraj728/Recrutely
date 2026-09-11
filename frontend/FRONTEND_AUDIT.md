# CareerCraft Legacy Frontend Audit

This audit maps the existing non-React frontend behavior to preserve API compatibility during migration.

## Existing Frontend Surface
- Primary page: `../index.html` with behavior in `../index.js` and styles in `../style.css`
- Admin page: `../admin.html` with inline script-driven data views
- Resume template pages: `../templates/*.html`

## Pages And Sections
- Landing/home: hero, features, templates preview, upload section, contact section
- Search and company details: top search box and company detail modal
- Auth: sign-in/sign-up modals with Google and LinkedIn entry points
- Resume analysis: upload modal and analysis modal
- Subscription: free vs premium modal and payment dialog flow
- Admin: users, companies, contacts, report, export, logs, health

## Core Frontend API Integrations
- Auth:
  - `GET /api/auth/user`
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `POST /api/auth/logout`
  - `POST /api/auth/unlink-linkedin`
  - OAuth links: `/auth/google`, `/auth/linkedin`
- Subscription:
  - `GET /api/subscription/status`
  - `POST /api/subscription/initiate-upgrade`
  - `POST /api/subscription/confirm-upgrade`
- Resume:
  - `POST /api/resumes/upload`
  - `POST /api/resumes/analyze`
- Companies and jobs:
  - `GET /api/companies/search?q=...`
  - `GET /api/companies/:slug`
- LinkedIn networking:
  - `GET /api/linkedin/company-employees/:companyName`
- Contact:
  - `POST /api/contact`
- Admin:
  - `GET /api/admin/users`
  - `GET /api/admin/companies`
  - `GET /api/admin/contacts`
  - `GET /api/admin/report`
  - `GET /api/admin/export?type=...`
  - `GET /api/admin/logs`
  - `GET /api/admin/health`

## Existing State Patterns
- Auth states: logged out vs logged in (`currentUser`), LinkedIn-linked state
- Subscription state: free vs premium, remaining usage indicator
- Upload states: selection, upload, analysis progress, success/error
- Search states: debounce, suggestion dropdown, no-result handling
- Modal states: sign in/up, upload, analysis, company, subscription, payment

## Migration Rule For This Phase
- Keep backend API contracts untouched
- Keep legacy frontend files available while React routes are scaffolded
- Move behavior into reusable React services/hooks incrementally
