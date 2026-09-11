import { useEffect, useMemo, useState } from 'react';
import { BriefcaseBusiness, CalendarDays, CheckCircle2, ClipboardList, FilePlus2, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { applicationService } from '../services';
import { Button, Card, Input, PageHeader, Select, Textarea } from '../components/ui';

const emptyForm = {
  company: '', role: '', location: '', workMode: 'Not specified', employmentType: 'Full-time',
  compensation: '', status: 'Saved', appliedAt: '', applicationDeadline: '', followUpAt: '',
  source: '', jobUrl: '', nextAction: '', notes: '',
};

const statuses = ['Saved', 'Applied', 'Screening', 'Interview', 'Offer', 'Rejected', 'Withdrawn'];
const dateLabel = (value) => value ? new Date(value).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : 'Not set';

function toForm(application) {
  return Object.fromEntries(Object.keys(emptyForm).map((key) => [key, application?.[key] ? key.endsWith('At') || key === 'applicationDeadline' ? new Date(application[key]).toISOString().slice(0, 10) : application[key] : emptyForm[key]]));
}

export default function Applications() {
  const { isAuthenticated } = useAuthContext();
  const [applications, setApplications] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) { setLoading(false); return; }
    applicationService.list().then((response) => setApplications(response.data || [])).catch((err) => setError(err.message || 'Unable to load applications')).finally(() => setLoading(false));
  }, [isAuthenticated]);

  const visibleApplications = useMemo(() => applications.filter((application) => {
    const matchesFilter = filter === 'All' || application.status === filter;
    const text = `${application.company} ${application.role} ${application.location || ''} ${application.status}`.toLowerCase();
    return matchesFilter && text.includes(query.toLowerCase());
  }), [applications, filter, query]);
  const stats = useMemo(() => ({
    total: applications.length,
    companies: new Set(applications.map((item) => item.company.toLowerCase())).size,
    active: applications.filter((item) => ['Applied', 'Screening', 'Interview'].includes(item.status)).length,
    interviews: applications.filter((item) => item.status === 'Interview').length,
    offers: applications.filter((item) => item.status === 'Offer').length,
  }), [applications]);
  const updateForm = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const resetForm = () => { setForm(emptyForm); setEditingId(null); };
  const submit = async (event) => {
    event.preventDefault(); setSaving(true); setError('');
    try {
      const response = editingId ? await applicationService.update(editingId, form) : await applicationService.create(form);
      setApplications((current) => editingId ? current.map((item) => item._id === editingId ? response.data : item) : [response.data, ...current]);
      resetForm();
    } catch (err) { setError(err.message || 'Unable to save application'); } finally { setSaving(false); }
  };
  const changeStatus = async (application, status) => {
    try { const response = await applicationService.update(application._id, { status, ...(status === 'Applied' && !application.appliedAt ? { appliedAt: new Date().toISOString() } : {}) }); setApplications((current) => current.map((item) => item._id === application._id ? response.data : item)); } catch (err) { setError(err.message || 'Unable to update status'); }
  };
  const remove = async (application) => {
    if (!window.confirm(`Remove the ${application.role} application at ${application.company}?`)) return;
    try { await applicationService.remove(application._id); setApplications((current) => current.filter((item) => item._id !== application._id)); } catch (err) { setError(err.message || 'Unable to remove application'); }
  };

  if (!isAuthenticated) return <div className="container py-10 sm:py-14"><PageHeader eyebrow="Pipeline" title="Applications" description="Track every application and your next best action." /><Card className="mt-10 max-w-2xl p-10 text-center"><FilePlus2 className="mx-auto h-9 w-9 text-[var(--color-primary)]" /><h2 className="mt-5 text-xl font-semibold">Sign in to track your applications.</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--color-text-muted)]">Your pipeline is private to your account, so sign in to save companies, statuses, deadlines, and follow-ups.</p><Link to="/login" className="pill pill-gold mt-6">Sign in</Link></Card></div>;

  return <div className="container py-10 sm:py-14"><PageHeader eyebrow="Pipeline" title="Applications" description="Track every application, status, deadline, and next step in one private workspace." />
    <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5"><Card className="p-4"><ClipboardList className="h-5 w-5 text-[var(--color-primary)]" /><p className="mt-3 text-2xl font-semibold">{stats.total}</p><p className="text-sm text-[var(--color-text-muted)]">Total applications</p></Card><Card className="p-4"><BriefcaseBusiness className="h-5 w-5 text-[var(--color-primary)]" /><p className="mt-3 text-2xl font-semibold">{stats.companies}</p><p className="text-sm text-[var(--color-text-muted)]">Companies applied to</p></Card><Card className="p-4"><CheckCircle2 className="h-5 w-5 text-[var(--color-success)]" /><p className="mt-3 text-2xl font-semibold">{stats.active}</p><p className="text-sm text-[var(--color-text-muted)]">Active applications</p></Card><Card className="p-4"><CalendarDays className="h-5 w-5 text-[var(--color-primary)]" /><p className="mt-3 text-2xl font-semibold">{stats.interviews}</p><p className="text-sm text-[var(--color-text-muted)]">Interviews</p></Card><Card className="p-4"><BriefcaseBusiness className="h-5 w-5 text-[var(--color-primary)]" /><p className="mt-3 text-2xl font-semibold">{stats.offers}</p><p className="text-sm text-[var(--color-text-muted)]">Offers</p></Card></div>
    {error && <p role="alert" className="mt-5 text-sm text-[var(--color-danger)]">{error}</p>}
    <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section><div className="flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-subtle)]" /><Input className="pl-10" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search company or role" /></div><Select className="sm:w-48" value={filter} onChange={(event) => setFilter(event.target.value)}><option value="All">All statuses</option>{statuses.map((status) => <option key={status}>{status}</option>)}</Select></div>
        {loading ? <Card className="mt-4 p-8">Loading your applications...</Card> : visibleApplications.length === 0 ? <Card className="mt-4 p-10 text-center"><FilePlus2 className="mx-auto h-8 w-8 text-[var(--color-primary)]" /><h2 className="mt-4 text-lg font-semibold">Your pipeline is ready</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--color-text-muted)]">Add an application to track status, interview progress, follow-ups, and notes.</p><Button className="mt-5" onClick={() => document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' })}><Plus className="h-4 w-4" />Add application</Button></Card> : <div className="mt-4 space-y-3">{visibleApplications.map((application) => <Card key={application._id} className="p-5"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex flex-wrap items-center gap-2"><h2 className="font-semibold">{application.role}</h2><span className="rounded-full bg-[var(--color-primary-soft)] px-2.5 py-1 text-xs text-[var(--color-primary)]">{application.status}</span></div><p className="mt-1 text-sm text-[var(--color-text-muted)]">{application.company}{application.location ? ` · ${application.location}` : ''}</p><div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[var(--color-text-muted)]"><span>{application.employmentType || 'Full-time'}</span>{application.compensation && <span>{application.compensation}</span>}{application.appliedAt && <span>Applied {dateLabel(application.appliedAt)}</span>}{application.followUpAt && <span className="text-[var(--color-primary)]">Follow up {dateLabel(application.followUpAt)}</span>}</div></div><div className="flex gap-2"><Button size="icon" variant="ghost" aria-label={`Edit ${application.role}`} onClick={() => { setEditingId(application._id); setForm(toForm(application)); }}><Pencil className="h-4 w-4" /></Button><Button size="icon" variant="ghost" aria-label={`Remove ${application.role}`} onClick={() => remove(application)}><Trash2 className="h-4 w-4 text-[var(--color-danger)]" /></Button></div></div><div className="mt-4 flex flex-col gap-3 border-t border-[var(--color-border)] pt-4 sm:flex-row sm:items-center sm:justify-between"><Select className="sm:w-48" value={application.status} onChange={(event) => changeStatus(application, event.target.value)} aria-label={`Status for ${application.role}`}>{statuses.map((status) => <option key={status}>{status}</option>)}</Select><div className="flex flex-wrap gap-3 text-xs text-[var(--color-text-muted)]">{application.applicationDeadline && <span>Deadline {dateLabel(application.applicationDeadline)}</span>}{application.nextAction && <span>Next: {application.nextAction}</span>}{application.source && <span>Via {application.source}</span>}</div></div></Card>)}</div>}
      </section>
      <Card id="application-form" className="h-fit p-6"><div className="flex items-center justify-between"><h2 className="text-lg font-semibold">{editingId ? 'Edit application' : 'Add application'}</h2>{editingId && <Button size="icon" variant="ghost" aria-label="Cancel editing" onClick={resetForm}><X className="h-4 w-4" /></Button>}</div><form className="mt-5 space-y-4" onSubmit={submit}><Input name="company" value={form.company} onChange={updateForm} placeholder="Company name" required /><Input name="role" value={form.role} onChange={updateForm} placeholder="Role or position" required /><div className="grid gap-3 sm:grid-cols-2"><Select name="status" value={form.status} onChange={updateForm}>{statuses.map((status) => <option key={status}>{status}</option>)}</Select><Select name="employmentType" value={form.employmentType} onChange={updateForm}><option>Full-time</option><option>Internship</option><option>Part-time</option><option>Contract</option><option>Other</option></Select></div><div className="grid gap-3 sm:grid-cols-2"><Input name="location" value={form.location} onChange={updateForm} placeholder="Location" /><Select name="workMode" value={form.workMode} onChange={updateForm}><option>Not specified</option><option>Remote</option><option>Hybrid</option><option>On-site</option></Select></div><Input name="compensation" value={form.compensation} onChange={updateForm} placeholder="Salary or stipend" /><div className="grid gap-3 sm:grid-cols-2"><label className="text-xs text-[var(--color-text-muted)]">Applied date<Input type="date" name="appliedAt" value={form.appliedAt} onChange={updateForm} className="mt-1" /></label><label className="text-xs text-[var(--color-text-muted)]">Application deadline<Input type="date" name="applicationDeadline" value={form.applicationDeadline} onChange={updateForm} className="mt-1" /></label></div><label className="block text-xs text-[var(--color-text-muted)]">Follow-up date<Input type="date" name="followUpAt" value={form.followUpAt} onChange={updateForm} className="mt-1" /></label><Input name="source" value={form.source} onChange={updateForm} placeholder="Source (LinkedIn, company site...)" /><Input type="url" name="jobUrl" value={form.jobUrl} onChange={updateForm} placeholder="Job link" /><Input name="nextAction" value={form.nextAction} onChange={updateForm} placeholder="Next action" /><Textarea name="notes" value={form.notes} onChange={updateForm} placeholder="Notes, interview details, contacts..." rows={3} /><div className="flex gap-2"><Button type="submit" loading={saving}><Plus className="h-4 w-4" />{editingId ? 'Save changes' : 'Add application'}</Button>{editingId && <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>}</div></form></Card>
    </div>
  </div>;
}
