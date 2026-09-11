import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BriefcaseBusiness, FileSearch, Sparkles, Users } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';
import { api, companyService, subscriptionService } from '../services';
import { Badge, Card, PageHeader, Progress } from '../components/ui';

export default function Dashboard() {
  const { user } = useAuthContext();
  const [data, setData] = useState({ companies: 0, database: 'checking', subscription: null });

  useEffect(() => {
    Promise.all([companyService.getCompanies({ limit: 1 }), api.health(), subscriptionService.getStatus()])
      .then(([companies, health, subscription]) => {
        setData({
          companies: companies?.pagination?.total || companies?.data?.length || 0,
          database: health?.database || 'connected',
          subscription: subscription?.data || subscription?.subscription || null,
        });
      })
      .catch(() => setData((current) => ({ ...current, database: 'unavailable' })));
  }, []);

  const plan = data.subscription?.plan || user?.subscriptionPlan || 'free';
  const used = data.subscription?.resumeAnalysesUsed || data.subscription?.analysesUsed || 0;
  const limit = data.subscription?.freeAnalysesLimit || data.subscription?.analysesLimit || 3;

  return (
    <div className="container py-10 sm:py-14">
      <PageHeader eyebrow="Workspace" title={`Good to see you, ${user?.name?.split(' ')[0] || 'there'}.`} description="Your career workspace, matching signals, and resume progress in one view." actions={<Link to="/resume" className="pill pill-gold">Analyze resume <ArrowRight className="h-4 w-4" /></Link>} />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric icon={FileSearch} label="Resume analyses" value={`${used}/${limit}`} detail="This month" />
        <Metric icon={BriefcaseBusiness} label="Companies indexed" value={data.companies || '—'} detail="Available to explore" />
        <Metric icon={Users} label="Network status" value={user?.linkedinId ? 'Linked' : 'Connect'} detail={user?.linkedinId ? 'LinkedIn connected' : 'Unlock networking'} />
        <Metric icon={Sparkles} label="Current plan" value={String(plan).toUpperCase()} detail={data.database === 'connected' ? 'Live workspace' : 'Database offline'} />
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4"><div><p className="eyebrow">Next best action</p><h2 className="mt-4 text-2xl font-semibold">Turn your resume into a stronger application.</h2><p className="mt-3 max-w-xl text-[var(--color-text-muted)]">Upload your latest resume, choose a target company, and get an ATS-aware analysis with practical edits.</p></div><Badge variant="success">Recommended</Badge></div>
          <div className="mt-6"><Progress value={limit ? Math.min(100, (used / limit) * 100) : 0} /><p className="mt-2 text-sm text-[var(--color-text-muted)]">{Math.max(0, limit - used)} free analyses remaining</p></div>
          <div className="mt-6 flex flex-wrap gap-3"><Link to="/resume" className="pill pill-gold">Upload resume</Link><Link to="/companies" className="pill pill-outline">Explore companies</Link></div>
        </Card>
        <Card className="p-6 sm:p-8"><p className="eyebrow">Quick access</p><div className="mt-5 space-y-3"><QuickLink to="/jobs" label="Browse matching roles" /><QuickLink to="/templates" label="Choose a resume template" /><QuickLink to="/networking" label="Review networking options" /><QuickLink to="/upgrade" label="See premium access" /></div></Card>
      </div>
    </div>
  );
}

function Metric({ icon: Icon, label, value, detail }) { return <Card className="p-5"><Icon className="h-5 w-5 text-[var(--color-primary)]" /><p className="mt-5 text-xs uppercase tracking-[0.16em] text-[var(--color-text-subtle)]">{label}</p><p className="mt-2 text-2xl font-semibold text-[var(--color-text)]">{value}</p><p className="mt-1 text-sm text-[var(--color-text-muted)]">{detail}</p></Card>; }
function QuickLink({ to, label }) { return <Link to={to} className="flex items-center justify-between border-b border-[var(--color-border)] py-3 text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-primary)]">{label}<ArrowRight className="h-4 w-4" /></Link>; }
