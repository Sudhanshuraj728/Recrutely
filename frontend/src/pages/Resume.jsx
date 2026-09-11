import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, FileUp, LoaderCircle, Sparkles } from 'lucide-react';
import { companyService, resumeService } from '../services';
import { Button, Card, PageHeader, Progress, Select, Textarea, useToast } from '../components/ui';

export default function Resume() {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [companies, setCompanies] = useState([]);
  const [companySlug, setCompanySlug] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setCompanySlug(searchParams.get('company') || '');
    setJobRole(searchParams.get('role') || '');
    setJobDescription(searchParams.get('description') || '');
  }, [searchParams]);

  useEffect(() => {
    companyService.getCompanies({ limit: 100 })
      .then((response) => setCompanies(response?.data || []))
      .catch((err) => setError(err.message || 'Unable to load companies'));
  }, []);

  async function onUpload() {
    if (!file) return setError('Choose a PDF, DOC, DOCX, TXT, or image resume first.');
    setUploading(true); setError('');
    try {
      const response = await resumeService.uploadResume(file);
      setResult({ upload: response?.data || response });
      toast({ title: 'Resume uploaded', message: 'Choose a company to start analysis.', variant: 'success' });
    } catch (err) { setError(err.message || 'Resume upload failed'); }
    finally { setUploading(false); }
  }

  async function onAnalyze() {
    const filename = result?.upload?.filename;
    if (!filename || !companySlug) return setError('Upload a resume and choose a target company first.');
    setAnalyzing(true); setError('');
    try { const response = await resumeService.analyzeResume({ filename, originalName: result?.upload?.originalName, companySlug, jobRole, jobDescription }); setResult((current) => ({ ...current, analysis: response?.data || response })); toast({ title: 'Analysis ready', message: 'Your resume insights are ready below.', variant: 'success' }); }
    catch (err) { setError(err.message || 'Resume analysis failed'); }
    finally { setAnalyzing(false); }
  }

  return (
    <div className="container py-10 sm:py-14">
      <PageHeader eyebrow="Resume intelligence" title="Make your resume easier to hire." description="Upload your resume, choose a target company, and get practical AI-powered analysis." />
      <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-6 sm:p-8">
          <div className="flex h-48 flex-col items-center justify-center rounded-[var(--radius-2)] border border-dashed border-[var(--color-border-strong)] bg-[var(--color-bg-inset)] text-center">
            <FileUp className="h-8 w-8 text-[var(--color-primary)]" />
            <p className="mt-3 font-medium">Upload your latest resume</p>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">PDF, DOC, DOCX, TXT, JPG, or PNG</p>
            <label className="mt-5 cursor-pointer text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]">{file ? file.name : 'Choose file'}<input type="file" accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png" className="sr-only" onChange={(event) => setFile(event.target.files?.[0] || null)} /></label>
          </div>
          <Button className="mt-5 w-full" onClick={onUpload} loading={uploading}><FileUp className="h-4 w-4" />Upload resume</Button>
          {result?.upload && <div className="mt-5 rounded-[var(--radius-2)] border border-[var(--color-border)] p-4 text-sm"><p className="font-medium">{result.upload.originalName}</p><p className="mt-1 text-[var(--color-text-muted)]">Upload complete. Select a target company to analyze.</p></div>}
        </Card>
        <Card className="p-6 sm:p-8"><p className="eyebrow">Targeted analysis</p><h2 className="mt-4 text-2xl font-semibold">Tune your resume for a real company.</h2><p className="mt-3 text-[var(--color-text-muted)]">Add the target post when you have it. The rule-based ATS score and Gemini review will use it separately.</p><Select className="mt-6" value={companySlug} onChange={(event) => setCompanySlug(event.target.value)} aria-label="Choose target company"><option value="">Choose a company</option>{companies.map((company) => <option key={company.slug} value={company.slug}>{company.name}</option>)}</Select><input className="mt-3 h-11 w-full rounded-[var(--radius-2)] border border-[var(--color-border)] bg-[var(--color-bg-inset)] px-3.5 text-sm text-[var(--color-text)]" value={jobRole} onChange={(event) => setJobRole(event.target.value)} placeholder="Target job title (optional)" /><Textarea className="mt-3" value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} placeholder="Paste the job description for deeper keyword and company-fit analysis (optional)" rows={5} /><Button className="mt-4 w-full" variant="secondary" onClick={onAnalyze} disabled={!result?.upload || !companySlug} loading={analyzing}><Sparkles className="h-4 w-4" />Analyze resume</Button>{analyzing && <LoaderCircle className="mx-auto mt-5 h-5 w-5 animate-spin text-[var(--color-primary)]" />}</Card>
      </div>
      {error && <p role="alert" className="mt-5 rounded-[var(--radius-2)] border border-[var(--color-danger)]/30 bg-[var(--color-danger-soft)] p-4 text-sm text-[var(--color-danger)]">{error}</p>}
      {result?.analysis && <AnalysisResult data={result.analysis} />}
    </div>
  );
}

function AnalysisResult({ data }) {
  const narrative = data.analysis || data;
  const ats = data.atsAnalysis || narrative.ruleBasedATS;
  const breakdown = ats?.scoreBreakdown || {};
  const priorityActions = narrative.priorityActions || ats?.priorityActions || [];
  const strengths = narrative.strengths || [];
  const companySpecific = narrative.companySpecific || [];
  const issues = narrative.currentIssues || ats?.currentIssues || [];
  const suggestions = narrative.suggestedImprovements || [];
  return <Card className="mt-8 p-6 sm:p-8"><div className="flex flex-col gap-6 border-b border-[var(--color-border)] pb-7 lg:flex-row lg:items-center lg:justify-between"><div><p className="eyebrow">Analysis complete</p><h2 className="mt-3 text-2xl font-semibold">{data.company?.name ? `${data.company.name} fit review` : 'Resume review'}</h2><p className="mt-2 max-w-2xl text-sm text-[var(--color-text-muted)]">{narrative.summaryRecommendation || 'Your resume has been reviewed against ATS rules and the selected company context.'}</p></div><Score score={ats?.score ?? narrative.overallScore ?? 0} label="ATS score" /></div><div className="mt-8 grid gap-6 lg:grid-cols-2"><section><h3 className="text-lg font-semibold">Rule-based ATS breakdown</h3><div className="mt-4 space-y-4">{Object.entries(breakdown).map(([key, value]) => <div key={key}><div className="mb-1 flex justify-between text-sm"><span className="capitalize text-[var(--color-text-muted)]">{key.replace(/([A-Z])/g, ' $1')}</span><span className="font-mono text-[var(--color-primary)]">{value}/100</span></div><Progress value={Number(value)} /></div>)}</div><p className="mt-4 text-xs text-[var(--color-text-subtle)]">{ats?.methodology || 'Score is calculated from extracted resume evidence.'}</p></section><section><h3 className="text-lg font-semibold">Resume checks</h3><div className="mt-4 grid grid-cols-2 gap-3">{Object.entries(ats?.checks || {}).filter(([, value]) => typeof value === 'boolean' || typeof value === 'number').map(([key, value]) => <div key={key} className="rounded-[var(--radius-2)] border border-[var(--color-border)] p-3"><p className="text-xs capitalize text-[var(--color-text-subtle)]">{key.replace(/([A-Z])/g, ' $1')}</p><p className="mt-1 font-semibold">{typeof value === 'boolean' ? (value ? 'Pass' : 'Needs work') : value}</p></div>)}</div></section></div><ResultList title="Priority actions" items={priorityActions.map((item) => item.suggestion || item)} icon={AlertTriangle} tone="warning" /><ResultList title="What is already strong" items={strengths} icon={CheckCircle2} tone="success" /><div className="mt-8 grid gap-6 lg:grid-cols-2"><ResultList title="Company-specific guidance" items={companySpecific.map((item) => `${item.point}${item.reason ? ` — ${item.reason}` : ''}`)} icon={Sparkles} tone="primary" /><ResultList title="Detected issues and improvements" items={[...issues.map((item) => item.issue || item), ...suggestions]} icon={AlertTriangle} tone="warning" /></div>{ats?.matchedKeywords?.length > 0 && <KeywordBlock title="Matched keywords" items={ats.matchedKeywords} />}{ats?.missingKeywords?.length > 0 && <KeywordBlock title="Missing or weak keywords" items={ats.missingKeywords} />}</Card>;
}

function Score({ score, label }) { return <div className="flex h-28 w-28 shrink-0 flex-col items-center justify-center rounded-full border-8 border-[var(--color-primary-soft)] bg-[var(--color-bg-inset)]"><span className="font-mono text-3xl font-semibold text-[var(--color-primary)]">{score}</span><span className="text-[0.65rem] uppercase tracking-wider text-[var(--color-text-subtle)]">{label}</span></div>; }
function ResultList({ title, items, icon: Icon, tone }) { if (!items?.length) return null; const color = tone === 'success' ? 'text-[var(--color-success)]' : tone === 'warning' ? 'text-[var(--color-warning)]' : 'text-[var(--color-primary)]'; return <section className="mt-8"><h3 className="text-lg font-semibold">{title}</h3><ul className="mt-3 space-y-2">{items.slice(0, 8).map((item, index) => <li key={`${item}-${index}`} className="flex gap-3 text-sm leading-6 text-[var(--color-text-muted)]"><Icon className={`mt-1 h-4 w-4 shrink-0 ${color}`} />{item}</li>)}</ul></section>; }
function KeywordBlock({ title, items }) { return <section className="mt-8"><h3 className="text-lg font-semibold">{title}</h3><div className="mt-3 flex flex-wrap gap-2">{items.map((item) => <span key={item} className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-text-muted)]">{item}</span>)}</div></section>; }
