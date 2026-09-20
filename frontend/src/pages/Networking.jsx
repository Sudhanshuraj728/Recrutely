import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  BadgeCheck,
  Building2,
  ExternalLink,
  GraduationCap,
  Linkedin,
  Search,
  Sparkles,
  UserPlus,
  Users,
} from 'lucide-react';
import { companyService, linkedinService } from '../services';
import { Badge, Button, Card, PageHeader, Select, Skeleton, useToast } from '../components/ui';

const STORAGE_KEY = 'careercraft-networking-company';

function linkedinPeopleSearch(query) {
  return `https://www.linkedin.com/search/results/people/?origin=GLOBAL_SEARCH_HEADER&keywords=${encodeURIComponent(query)}`;
}

export default function Networking() {
  const [params] = useSearchParams();
  const { toast } = useToast();
  const [companies, setCompanies] = useState([]);
  const [companySlug, setCompanySlug] = useState('');
  const [status, setStatus] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [loadError, setLoadError] = useState('');

  const connected = Boolean(status?.connected);

  useEffect(() => {
    companyService.getCompanies({ limit: 100 })
      .then((response) => setCompanies(response?.data || []))
      .catch(() => {});
    linkedinService.getStatus()
      .then((response) => setStatus(response?.data || response))
      .catch(() => setStatus({ connected: false }));
  }, []);

  // Default the selected company to the one used in the latest resume analysis.
  useEffect(() => {
    const fromQuery = params.get('company');
    if (fromQuery) {
      setCompanySlug(fromQuery);
      return;
    }
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (stored?.slug) setCompanySlug(stored.slug);
    } catch {
      /* ignore */
    }
  }, [params]);

  useEffect(() => {
    if (params.get('linkedin') === 'success') {
      linkedinService.getStatus()
        .then((response) => setStatus(response?.data || response))
        .catch(() => {});
      toast({
        title: 'LinkedIn connected',
        message: 'You can now directly connect with employees, recruiters and HR professionals.',
        variant: 'success',
      });
      const next = new URLSearchParams(params);
      next.delete('linkedin');
      const qs = next.toString();
      window.history.replaceState({}, '', qs ? `${window.location.pathname}?${qs}` : window.location.pathname);
    }
  }, [params, toast]);

  const selectedCompany = useMemo(
    () => companies.find((company) => company.slug === companySlug) || null,
    [companies, companySlug]
  );

  useEffect(() => {
    if (!companySlug || !selectedCompany?.name) return;
    setLoadingInsights(true);
    setLoadError('');
    linkedinService.getCompanyEmployees(selectedCompany.name)
      .then((response) => setInsights(response?.data || response))
      .catch((err) => setLoadError(err.message || 'Unable to load networking insights'))
      .finally(() => setLoadingInsights(false));
  }, [companySlug, selectedCompany?.name]);

  function selectCompany(slug) {
    setCompanySlug(slug);
    setInsights(null);
    const company = companies.find((item) => item.slug === slug);
    if (company) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ slug, name: company.name }));
    }
  }

  return (
    <div className="container py-10 sm:py-14">
      <PageHeader
        eyebrow="Relationship intelligence"
        title="Network like an insider."
        description="Turn your LinkedIn connection and resume analysis into direct paths to employees, recruiters and HR — for the companies you actually want to join."
      />

      {!connected && (
        <Card className="mt-8 max-w-3xl p-7 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-2)] bg-[#0a66c2]/15 text-[#70b7ff]">
                <Linkedin className="h-6 w-6" />
              </span>
              <div>
                <h2 className="text-xl font-semibold">Connect LinkedIn to unlock outreach</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                  Once connected you can reach employees, recruiters and HR at any company, and jump straight to their company
                  page — all from one place.
                </p>
              </div>
            </div>
            <Button
              className="shrink-0"
              onClick={() => {
                window.location.href = `/auth/linkedin?redirect=${encodeURIComponent(
                  `${window.location.pathname}${companySlug ? `?company=${encodeURIComponent(companySlug)}` : ''}`
                )}`;
              }}
            >
              <Linkedin className="h-4 w-4" />
              Connect LinkedIn
            </Button>
          </div>
        </Card>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="p-6 sm:p-7">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-[var(--color-primary)]" />
              <h2 className="font-semibold">Target company</h2>
            </div>
            {connected && (
              <Badge variant="success" dot>
                LinkedIn connected
              </Badge>
            )}
          </div>
          <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">
            Pick the company from your resume analysis — or any company you are targeting — to see who to reach.
          </p>
          <Select className="mt-5" value={companySlug} onChange={(event) => selectCompany(event.target.value)} aria-label="Choose target company">
            <option value="">Choose a company</option>
            {companies.map((company) => (
              <option key={company.slug} value={company.slug}>
                {company.name}
              </option>
            ))}
          </Select>

          {selectedCompany && (
            <div className="mt-6 space-y-3">
              <OutreachLink
                icon={Users}
                label="Connect with employees"
                description={`Browse people currently working at ${selectedCompany.name}`}
                href={linkedinPeopleSearch(selectedCompany.name)}
              />
              <OutreachLink
                icon={UserPlus}
                label="Find recruiters & HR"
                description={`Search recruiters and talent acquisition at ${selectedCompany.name}`}
                href={linkedinPeopleSearch(`${selectedCompany.name} recruiter`)}
              />
              <OutreachLink
                icon={Building2}
                label="Company page"
                description={`Research ${selectedCompany.name} inside the workspace`}
                href={`/companies/${selectedCompany.slug}`}
                internal
              />
            </div>
          )}
        </Card>

        <Card className="p-6 sm:p-7">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-2)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-semibold">{selectedCompany ? `Insights into ${selectedCompany.name}` : 'Networking insights'}</h2>
              <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">
                {connected
                  ? 'Curated outreach routes plus any connections and alumni we can surface from your LinkedIn.'
                  : 'Select a company above to preview guided outreach options.'}
              </p>
            </div>
          </div>

          {!connected && !selectedCompany && (
            <p className="mt-6 rounded-[var(--radius-2)] border border-dashed border-[var(--color-border-strong)] p-4 text-sm text-[var(--color-text-muted)]">
              Connect LinkedIn and pick a company to start reaching out.
            </p>
          )}

          {selectedCompany && (
            <div className="mt-5">
              {loadingInsights ? (
                <div className="space-y-3">
                  <Skeleton className="h-16" />
                  <Skeleton className="h-16" />
                  <Skeleton className="h-16" />
                </div>
              ) : loadError ? (
                <p role="alert" className="rounded-[var(--radius-2)] border border-[var(--color-danger)]/30 bg-[var(--color-danger-soft)] p-4 text-sm text-[var(--color-danger)]">
                  {loadError}
                </p>
              ) : insights ? (
                <div className="space-y-6">
                  {insights.profiles?.length > 0 && <ProfilesList profiles={insights.profiles} companyName={selectedCompany.name} />}
                  {insights.suggestions?.tips?.length > 0 && (
                    <TipsList tips={insights.suggestions.tips} connected={connected} />
                  )}
                  {(!insights.profiles?.length || !insights.suggestions?.tips?.length) && (
                    <p className="text-sm text-[var(--color-text-muted)]">
                      Linkedin’s people listings need extra approval, so we have prepared direct outreach routes for you instead.
                    </p>
                  )}
                </div>
              ) : null}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function OutreachLink({ icon: Icon, label, description, href, internal = false }) {
  const content = (
    <>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-2)] bg-[var(--color-bg-elevated)] text-[var(--color-primary)]">
        <Icon className="h-4 w-4" />
      </span>
      <span className="flex-1">
        <span className="flex items-center gap-1.5 font-medium">
          {label}
          {!internal && <ExternalLink className="h-3.5 w-3.5 text-[var(--color-text-subtle)]" />}
        </span>
        <span className="mt-0.5 block text-sm text-[var(--color-text-muted)]">{description}</span>
      </span>
    </>
  );
  const className =
    'flex items-center gap-3 rounded-[var(--radius-2)] border border-[var(--color-border)] p-3 transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-sink)]';
  return internal ? (
    <Link to={href} className={className}>
      {content}
    </Link>
  ) : (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      {content}
    </a>
  );
}

function ProfilesList({ profiles, companyName }) {
  return (
    <section>
      <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-text-subtle)]">
        <Users className="h-4 w-4" />
        People at {companyName}
      </h3>
      <div className="mt-3 grid gap-3">
        {profiles.map((profile, index) => (
          <a
            key={`${profile.profileUrl}-${index}`}
            href={profile.profileUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-[var(--radius-2)] border border-[var(--color-border)] p-4 transition-colors hover:border-[var(--color-primary)]"
          >
            {profile.pictureUrl ? (
              <img src={profile.pictureUrl} alt="" className="h-11 w-11 rounded-full object-cover" />
            ) : (
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)]">
                {profile.name?.charAt(0) || '?'}
              </span>
            )}
            <span className="flex-1">
              <span className="flex items-center gap-2 font-medium">
                {profile.name}
                {profile.connectionDegree === '1' && (
                  <Badge variant="primary" size="sm" dot>
                    1st
                  </Badge>
                )}
              </span>
              {profile.currentPosition && (
                <span className="mt-0.5 block text-sm text-[var(--color-text-muted)]">{profile.currentPosition}</span>
              )}
              {profile.headline && <span className="mt-0.5 block text-xs text-[var(--color-text-subtle)]">{profile.headline}</span>}
            </span>
            <ExternalLink className="h-4 w-4 text-[var(--color-text-subtle)]" />
          </a>
        ))}
      </div>
    </section>
  );
}

function TipsList({ tips, connected }) {
  const iconFor = (emoji) => {
    if (!connected) return Sparkles;
    if (/recruit/i.test(emoji) || /mail/i.test(emoji)) return BadgeCheck;
    if (/🎓/.test(emoji)) return GraduationCap;
    if (/🔍/.test(emoji)) return Search;
    return Users;
  };
  return (
    <section>
      <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-text-subtle)]">Guided outreach</h3>
      <div className="mt-3 grid gap-3">
        {tips.map((tip, index) => {
          const Icon = iconFor(tip.icon);
          return (
            <a
              key={`${tip.title}-${index}`}
              href={tip.action}
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-3 rounded-[var(--radius-2)] border border-[var(--color-border)] p-4 transition-colors hover:border-[var(--color-primary)]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-2)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                <Icon className="h-4 w-4" />
              </span>
              <span className="flex-1">
                <span className="font-medium">{tip.title}</span>
                <span className="mt-0.5 block text-sm leading-6 text-[var(--color-text-muted)]">{tip.description}</span>
                <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-primary)]">
                  Open on LinkedIn
                  <ExternalLink className="h-3.5 w-3.5" />
                </span>
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}