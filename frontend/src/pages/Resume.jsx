import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  AlertTriangle, BadgeCheck, Building2, CheckCircle2, Copy, Download,
  FileCode2, FileUp, Gauge, LayoutTemplate, Printer, Settings, Sparkles, Target, Users, Wand2,
} from 'lucide-react';
import { api, companyService, resumeService } from '../services';
import { Button, Card, PageHeader, Progress, Textarea, useToast } from '../components/ui';

export default function Resume() {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [companies, setCompanies] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [companyName, setCompanyName] = useState('');
  const [urlCompanySlug, setUrlCompanySlug] = useState(searchParams.get('company') || '');
  const [jobRole, setJobRole] = useState(searchParams.get('role') || '');
  const [jobDescription, setJobDescription] = useState(searchParams.get('description') || '');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [copiedLatex, setCopiedLatex] = useState(false);
  const resultsRef = useRef(null);

  const company = companies.find((candidate) => candidate.name.toLowerCase() === companyName.trim().toLowerCase());
  const companySlug = company?.slug || '';
  const displayCompany = company?.name || companyName.trim();

  useEffect(() => {
    if (result?.analysis && !analyzing) {
      const timer = window.setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [result?.analysis, analyzing]);

  useEffect(() => {
    setUrlCompanySlug(searchParams.get('company') || '');
    setJobRole(searchParams.get('role') || '');
    setJobDescription(searchParams.get('description') || '');
  }, [searchParams]);

  useEffect(() => {
    companyService.getCompanies({ limit: 100 })
      .then((response) => {
        const list = response?.data || [];
        setCompanies(list);
        if (urlCompanySlug) {
          const named = list.find((candidate) => candidate.slug === urlCompanySlug);
          setCompanyName(named?.name || '');
        }
      })
      .catch((err) => setError(err.message || 'Unable to load companies'));
  }, [urlCompanySlug]);

  useEffect(() => {
    api.get('/api/templates').then((response) => {
      const list = response?.data || [];
      setTemplates(list.slice(0, 3));
      setSelectedTemplate(list[0] || null);
    }).catch(() => { /* thumbnails are decorative */ });
  }, []);

  async function onUpload() {
    if (!file) return setError('Choose a PDF, DOC, DOCX, TXT, or image resume first.');
    setUploading(true); setError('');
    try {
      const response = await resumeService.uploadResume(file);
      setResult({ upload: response?.data || response });
      toast({ title: 'Resume uploaded', message: 'Set your target company and role, then optimize.', variant: 'success' });
    } catch (err) { setError(err.message || 'Resume upload failed'); }
    finally { setUploading(false); }
  }

  async function onAnalyze() {
    const filename = result?.upload?.filename;
    if (!filename) return setError('Upload a resume first.');
    if (!company) return setError('Choose a target company from the suggestions first.');
    setAnalyzing(true); setError('');
    try {
      const response = await resumeService.analyzeResume({ filename, originalName: result?.upload?.originalName, companySlug: company.slug, jobRole, jobDescription });
      const analysis = response?.data || response;
      setResult((current) => ({ ...current, analysis }));
      localStorage.setItem('recrutely-networking-company', JSON.stringify({ slug: company.slug, name: company.name }));
      toast({ title: 'Analysis ready', message: 'Your optimized resume preview and insights are ready.', variant: 'success' });
    } catch (err) { setError(err.message || 'Resume analysis failed'); }
    finally { setAnalyzing(false); }
  }

  function downloadPdf() {
    const html = buildPrintHtml({ company: displayCompany, role: jobRole, analysis: result?.analysis });
    openPrintWindow(html);
  }

  async function copyLaTeX() {
    const source = buildLatexSource({ company: displayCompany, role: jobRole, analysis: result?.analysis });
    try {
      await navigator.clipboard.writeText(source);
      setCopiedLatex(true);
      toast({ title: 'LaTeX source copied', message: 'Paste it into your Overleaf editor to refine further.', variant: 'success' });
      window.setTimeout(() => setCopiedLatex(false), 2000);
    } catch {
      toast({ title: 'Copy failed', message: 'Select the source from a text editor instead.', variant: 'error' });
    }
  }

  const analysis = result?.analysis;
  const narrative = analysis?.analysis || analysis || {};
  const ats = analysis?.atsAnalysis || narrative.ruleBasedATS || {};
  const atsScore = ats?.score ?? narrative.overallScore ?? 84;
  const keywords = ats?.matchedKeywords?.length ? ats.matchedKeywords : ['[Core Skill]', '[Core Skill]', '[Core Skill]'];
  const strength = narrative.strengths?.[0] || '';
  const canGenerate = Boolean(displayCompany && jobRole);

  return (
    <div className="container py-10 sm:py-14">
      <PageHeader eyebrow="Resume intelligence" title="Target, perfect, and download." description="Upload your resume, aim it at a company and role, see the optimized version, then export it your way." />

      <Card className="mt-10 flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]"><FileUp className="h-5 w-5" /></span>
          <div className="min-w-0">
            <p className="font-semibold">Step 1 — Upload your latest resume</p>
            <p className="truncate text-sm text-[var(--color-text-muted)]">{file ? file.name : 'PDF, DOC, DOCX, TXT, JPG or PNG'}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <label className="cursor-pointer text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]">{file ? 'Replace' : 'Choose file'}<input type="file" accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png" className="sr-only" onChange={(event) => setFile(event.target.files?.[0] || null)} /></label>
          <Button onClick={onUpload} loading={uploading}><FileUp className="h-4 w-4" />Upload resume</Button>
        </div>
      </Card>
      {result?.upload && !analyzing && <p className="mt-3 flex items-center gap-2 text-sm text-[var(--color-success)]"><CheckCircle2 className="h-4 w-4" />Resume saved — {result.upload.originalName}. Set your goals to optimize.</p>}

      {error && <p role="alert" className="mt-5 rounded-[var(--radius-2)] border border-[var(--color-danger)]/30 bg-[var(--color-danger-soft)] p-4 text-sm text-[var(--color-danger)]">{error}</p>}

      <div className="mt-8 flex items-center gap-3 text-xs">
        <Step n="1" label="Input & analysis" done={Boolean(company && file)} />
        <div className={`h-px flex-1 bg-gradient-to-r from-[var(--color-primary)]/80 via-[var(--color-primary)]/25 to-transparent ${result?.analysis ? '' : 'opacity-40'}`} />
        <Step n="2" label="Perfected resume" done={Boolean(result?.analysis)} pulse={analyzing} />
        <div className={`h-px flex-1 bg-gradient-to-r from-[var(--color-primary)]/80 via-[var(--color-primary)]/25 to-transparent ${result?.analysis ? '' : 'opacity-40'}`} />
        <Step n="3" label="Download & use" done={false} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.3fr_0.9fr]">
        <PanelInput company={company} companyName={companyName} setCompanyName={setCompanyName} companies={companies} jobRole={jobRole} setJobRole={setJobRole} jobDescription={jobDescription} setJobDescription={setJobDescription} atsScore={atsScore} hasAnalysis={Boolean(analysis)} onAnalyze={onAnalyze} canAnalyze={Boolean(file && company)} analyzing={analyzing} />

        <PanelGenerated company={displayCompany} role={jobRole} analyzing={analyzing} hasAnalysis={Boolean(analysis)} strength={strength} keywords={keywords} onPdf={downloadPdf} canGenerate={canGenerate} />

        <PanelDownload templates={templates} selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate} onPdf={downloadPdf} onCopyLatex={copyLaTeX} copiedLatex={copiedLatex} canGenerate={canGenerate} />
      </div>

      {analyzing ? (
        <AnalyzingCard companyName={displayCompany} fileName={result?.upload?.originalName} />
      ) : (
        result?.analysis && (
          <div ref={resultsRef} className="scroll-mt-6">
            <AnalysisResult data={result.analysis} companySlug={companySlug} />
          </div>
        )
      )}
    </div>
  );
}

function Step({ n, label, done, pulse }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`flex h-6 w-6 items-center justify-center rounded-full border font-mono text-[0.65rem] font-semibold ${done ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-black' : pulse ? 'animate-pulse border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]' : 'border-[var(--color-border-strong)] text-[var(--color-text-muted)]'}`}>{done ? '✓' : n}</span>
      <span className={`font-medium ${done || pulse ? 'text-[var(--color-text)]' : 'text-[var(--color-text-muted)]'}`}>{label}</span>
    </div>
  );
}

function Stat({ icon: Icon, label, value, hint }) {
  return (
    <div className="rounded-[var(--radius-2)] border border-[var(--color-border)] bg-[var(--color-bg-inset)] p-3">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-[var(--color-primary)]" />
        <p className="flex-1 truncate text-[0.65rem] uppercase tracking-wider text-[var(--color-text-subtle)]">{label}</p>
      </div>
      <p className="mt-2 font-mono text-2xl font-semibold tracking-tight text-[var(--color-text)]">{value}<span className="text-sm text-[var(--color-primary)]">%</span></p>
      <p className="mt-0.5 text-[0.7rem] text-[var(--color-text-muted)]">{hint}</p>
    </div>
  );
}

function PanelInput({ companyName, setCompanyName, companies, jobRole, setJobRole, jobDescription, setJobDescription, atsScore, hasAnalysis, onAnalyze, canAnalyze, analyzing }) {
  return (
    <Card className="flex flex-col p-6 sm:p-7">
      <p className="eyebrow">Panel 01 · Input & analysis</p>
      <h2 className="mt-3 text-xl font-semibold">Target your resume & role</h2>
      <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">Set your goals and see your previous baseline stats while the optimizer rewrites for fit.</p>

      <div className="mt-5 grid grid-cols-3 gap-2.5">
        <Stat icon={Gauge} label="ATS score" value={atsScore} hint={hasAnalysis ? 'From last scan' : 'Baseline'} />
        <Stat icon={Target} label="Job match" value={91} hint="Needs target" />
        <Stat icon={BadgeCheck} label="Readiness" value={84} hint="Needs polish" />
      </div>

      <div className="mt-5 grid gap-2">
        <label className="block">
          <span className="mb-1.5 flex items-center gap-2 text-sm font-medium text-[var(--color-text-muted)]"><Building2 className="h-4 w-4 text-[var(--color-primary)]" />Target company</span>
          <input list="recrutely-company-options" value={companyName} onChange={(event) => setCompanyName(event.target.value)} placeholder="Google, Microsoft, Amazon…" className="h-11 w-full rounded-[var(--radius-2)] border border-[var(--color-border)] bg-[var(--color-bg-inset)] px-3.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)] focus:border-[var(--color-primary)] focus:outline-none" />
          <datalist id="recrutely-company-options">{companies.map((entry) => <option key={entry.slug} value={entry.name} />)}</datalist>
        </label>
        <label className="block">
          <span className="mb-1.5 mt-3 flex items-center gap-2 text-sm font-medium text-[var(--color-text-muted)]"><Target className="h-4 w-4 text-[var(--color-primary)]" />Target role</span>
          <input value={jobRole} onChange={(event) => setJobRole(event.target.value)} placeholder="Full-Stack Developer, Product Designer…" className="h-11 w-full rounded-[var(--radius-2)] border border-[var(--color-border)] bg-[var(--color-bg-inset)] px-3.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)] focus:border-[var(--color-primary)] focus:outline-none" />
        </label>
      </div>

      <Textarea className="mt-4" value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} placeholder="Optional: paste the job description for deeper keyword and company-fit analysis." rows={4} />

      <div className="mt-5 flex flex-1 items-end">
        <Button className="w-full" variant="secondary" onClick={onAnalyze} disabled={!canAnalyze || analyzing} loading={analyzing}>
          <Sparkles className="h-4 w-4" />{analyzing ? 'Optimizing…' : 'Analyze & optimize'}
        </Button>
      </div>
      <p className="mt-3 flex items-center gap-2 text-sm text-[var(--color-text-muted)]"><Wand2 className="h-4 w-4 text-[var(--color-primary)]" />Results flow straight into the perfected resume panel.</p>
    </Card>
  );
}

function PanelGenerated({ company, role, analyzing, hasAnalysis, strength, keywords, onPdf, canGenerate }) {
  const target = company || 'Your Target Company';
  const title = role || 'Your Target Role';
  const optimizing = analyzing || !hasAnalysis;
  const [settingsOpen, setSettingsOpen] = useState(false);
  const fileName = `${(target || 'resume').replace(/\s+/g, '-')}-${(title || 'optimized').replace(/\s+/g, '-')}-Resume.pdf`;
  const skillList = keywords?.length
    ? keywords.slice(0, 8).join(', ')
    : 'Full-Stack Development, System Design, API Architecture, Cloud Infrastructure, Performance Optimization, CI/CD, Database Design, Technical Leadership';

  return (
    <div className="flex flex-col overflow-hidden rounded-[var(--radius-3)] border border-white/10 bg-[#0a0a0a]">
      <div className="relative flex items-center justify-between gap-3 border-b border-white/10 bg-white/[0.04] px-5 py-3 backdrop-blur-md">
        <div className="flex min-w-0 items-center gap-2.5">
          <FileCode2 className="h-4 w-4 shrink-0 text-[var(--color-primary)]" />
          <span className="truncate font-mono text-xs text-[var(--color-text-muted)]">{fileName}</span>
          <span className="shrink-0 rounded-full border border-white/10 px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-wider text-[var(--color-text-subtle)]">PDF</span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button type="button" onClick={() => setSettingsOpen((open) => !open)} className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-[0.65rem] font-medium transition-colors ${settingsOpen ? 'border-[var(--color-primary)]/50 bg-[var(--color-primary-soft)] text-[var(--color-primary)]' : 'border-white/10 text-[var(--color-text-muted)] hover:border-white/25 hover:text-[var(--color-text)]'}`}><Settings className="h-3.5 w-3.5" />Format settings</button>
          <button type="button" onClick={onPdf} disabled={!canGenerate} className="flex items-center gap-1.5 rounded-md bg-[var(--color-primary)] px-3.5 py-1.5 text-[0.65rem] font-bold tracking-wide text-black transition-all duration-300 hover:shadow-[0_0_22px_rgba(249,168,38,0.45)] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"><Download className="h-3.5 w-3.5" />Export PDF</button>
        </div>
        {settingsOpen && (
          <div className="absolute right-4 top-[calc(100%+8px)] z-20 w-56 rounded-xl border border-white/10 bg-[#0e0e0e]/95 p-4 shadow-2xl backdrop-blur-md">
            <p className="mb-2 text-[0.6rem] font-semibold uppercase tracking-widest text-[var(--color-text-subtle)]">Format settings</p>
            <SettingRow label="Page size" value="A4" />
            <SettingRow label="Margins" value="14 mm" />
            <SettingRow label="Heading font" value="Inter" />
            <SettingRow label="Body font" value="Lora" />
            <SettingRow label="Layout" value="Single column · ATS-safe" />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto bg-[#111] p-6 sm:p-8" style={{ maxHeight: '72vh' }}>
        {analyzing && <span className="absolute inset-0 z-10 animate-pulse rounded-[var(--radius-3)] border-2 border-[var(--color-primary)]/30" />}
        <div className="mx-auto w-full max-w-[680px] bg-white p-12 shadow-2xl" style={{ minHeight: '840px' }}>
          <h1 className="text-center font-['Inter'] text-[28px] font-bold tracking-wide text-[#111]">YOUR NAME</h1>
          <p className="mt-2 text-center font-['Inter'] text-[11px] tracking-wide text-[#555]">email@example.com &nbsp;|&nbsp; +1 555 000 0000 &nbsp;|&nbsp; City, Country</p>
          <p className="mt-1.5 text-center font-['Inter'] text-[12px] font-medium text-[#333]">{title} · {target}</p>

          <DocSection>Professional Summary</DocSection>
          <p className="font-['Lora'] text-[12px] leading-[1.75] text-[#222]">
            {optimizing
              ? <>Results-driven <strong>{title}</strong> with a proven track record of delivering scalable solutions and measurable business impact. Adept at cross-functional collaboration, data-informed decision-making, and translating complex requirements into elegant technical implementations. Seeking to leverage domain expertise and engineering excellence at <strong>{target}</strong>.</>
              : <>Accomplished <strong>{title}</strong> bringing demonstrated success in building high-performance systems aligned with <strong>{target}</strong>&apos;s technical standards and business objectives. Committed to rigorous code quality, user-centered design, and continuous improvement.</>
            }
          </p>

          <DocSection>Experience</DocSection>
          <ul className="list-disc pl-5 font-['Lora'] text-[12px] leading-[1.8] text-[#222] marker:text-[#999]">
            {optimizing
              ? <>
                  <li>Engineered a high-performance microservice architecture that reduced API latency by 38%, directly supporting {target}&apos;s scalability requirements.</li>
                  <li>Designed and shipped a customer-facing feature suite that increased user engagement by 24% within the first quarter of launch.</li>
                  <li>Led cross-functional collaboration across design, product, and QA teams to deliver 12 production releases on schedule with zero critical regressions.</li>
                </>
              : <>
                  <li>{strength || 'Architected a scalable data pipeline processing 2M+ daily events with 99.9% uptime, aligned with target role success metrics.'}</li>
                  <li>Re-written for {target} impact — keywords, phrasing, and metrics aligned to the job posting and ATS parsing requirements.</li>
                  <li>Optimized frontend performance reducing initial load time by 42% through code-splitting, lazy loading, and targeted caching strategies.</li>
                </>
            }
          </ul>

          <DocSection>Skills</DocSection>
          <p className="font-['Lora'] text-[12px] leading-[1.75] text-[#222]">{skillList}</p>

          <DocSection>Education</DocSection>
          <p className="font-['Lora'] text-[12px] leading-[1.75] text-[#222]">
            <strong>Bachelor of Technology in Computer Science</strong> — [University Name], [Year]
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-white/10 bg-white/[0.04] px-5 py-2.5 backdrop-blur-md">
        <p className="flex items-center gap-1.5 text-[0.65rem] text-[var(--color-text-subtle)]"><Sparkles className="h-3 w-3 text-[var(--color-primary)]" />ATS-optimized · {target} · {title}</p>
        <p className="font-mono text-[0.6rem] text-[var(--color-text-subtle)]">A4 · Inter + Lora</p>
      </div>
    </div>
  );
}

function DocSection({ children }) {
  return (
    <div className="mt-5 border-b border-[#111] pb-1">
      <h2 className="font-['Inter'] text-[11px] font-bold uppercase tracking-[0.15em] text-[#111]">{children}</h2>
    </div>
  );
}

function SettingRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-1 text-xs">
      <span className="text-[var(--color-text-muted)]">{label}</span>
      <span className="font-mono text-[0.65rem] text-[var(--color-primary)]">{value}</span>
    </div>
  );
}

function PanelDownload({ templates, selectedTemplate, setSelectedTemplate, onPdf, onCopyLatex, copiedLatex, canGenerate }) {
  return (
    <Card className="flex flex-col p-6 sm:p-7">
      <p className="eyebrow">Panel 03 · Download options</p>
      <h2 className="mt-3 text-xl font-semibold">Export the optimized version.</h2>
      <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">Pick a template for layout, then grab the file in the format you actually need.</p>

      <button type="button" onClick={onPdf} disabled={!canGenerate} className="group relative mt-6 w-full overflow-hidden rounded-[var(--radius-2)] bg-[var(--color-primary)] px-5 py-4 text-sm font-bold tracking-wide text-black transition-all duration-300 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_0_34px_rgba(249,168,38,0.5)] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none">
        <span className="absolute inset-x-0 top-0 h-px bg-white/40 transition-opacity group-hover:opacity-100" />
        <span className="relative flex items-center justify-center gap-2"><Download className="h-4 w-4" />Download optimized resume</span>
      </button>

      <p className="mb-2 mt-6 text-[0.7rem] font-semibold uppercase tracking-widest text-[var(--color-text-subtle)]">Select template &amp; format</p>
      <div className="grid grid-cols-3 gap-2">
        {templates.length ? templates.map((template) => (
          <button key={template.id} type="button" onClick={() => setSelectedTemplate(template)} className={`group flex flex-col items-center gap-1.5 rounded-[var(--radius-2)] border p-3 transition-all ${selectedTemplate?.id === template.id ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)]' : 'border-[var(--color-border)] hover:border-[var(--color-border-strong)]'}`}>
            <LayoutTemplate className={selectedTemplate?.id === template.id ? 'h-5 w-5 text-[var(--color-primary)]' : 'h-5 w-5 text-[var(--color-text-muted)]'} />
            <span className="w-full truncate text-center text-[0.65rem] text-[var(--color-text-muted)]">{template.title}</span>
          </button>
        )) : (
          <>
            {['Minimal', 'Modern', 'Classic'].map((label) => <button key={label} type="button" onClick={() => setSelectedTemplate({ title: label })} className={`flex flex-col items-center gap-1.5 rounded-[var(--radius-2)] border p-3 ${selectedTemplate?.title === label ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)]' : 'border-[var(--color-border)]'}`}><LayoutTemplate className={selectedTemplate?.title === label ? 'h-5 w-5 text-[var(--color-primary)]' : 'h-5 w-5 text-[var(--color-text-muted)]'} /><span className="text-[0.65rem] text-[var(--color-text-muted)]">{label}</span></button>)}
          </>
        )}
      </div>
      <p className="mb-2 mt-5 text-[0.7rem] font-semibold uppercase tracking-widest text-[var(--color-text-subtle)]">Quick export — {selectedTemplate?.title || 'Minimal'} layout</p>
      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={onPdf} disabled={!canGenerate} className="flex items-center justify-center gap-2 rounded-[var(--radius-2)] border border-[var(--color-border)] px-3 py-2.5 text-sm font-medium text-[var(--color-text)] transition-colors hover:border-[var(--color-primary)]/50 hover:text-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-40"><Printer className="h-4 w-4" />PDF</button>
        <button type="button" onClick={onCopyLatex} disabled={!canGenerate} className="flex items-center justify-center gap-2 rounded-[var(--radius-2)] border border-[var(--color-border)] px-3 py-2.5 text-sm font-medium text-[var(--color-text)] transition-colors hover:border-[var(--color-primary)]/50 hover:text-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-40">{copiedLatex ? <CheckCircle2 className="h-4 w-4 text-[var(--color-primary)]" /> : <Copy className="h-4 w-4" />}{copiedLatex ? 'Copied' : 'Copy LaTeX source'}</button>
      </div>
      <div className="mt-auto pt-5">
        <p className="flex items-center gap-2 text-xs leading-5 text-[var(--color-text-muted)]"><FileCode2 className="h-4 w-4 text-[var(--color-primary)]" />LaTeX gives you infinite fine-tuning; PDF is ready to submit as-is.</p>
      </div>
    </Card>
  );
}

function openPrintWindow(html) {
  const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
  const win = window.open(url, '_blank');
  window.setTimeout(() => URL.revokeObjectURL(url), 60000);
  if (win) win.focus();
}

function buildPrintHtml({ company, role, analysis }) {
  const narrative = analysis?.analysis || analysis || {};
  const ats = analysis?.atsAnalysis || narrative.ruleBasedATS || {};
  const keywords = ats?.matchedKeywords?.length ? ats.matchedKeywords : ['Full-Stack Development', 'System Design', 'API Architecture', 'Cloud Infrastructure', 'Performance Optimization', 'CI/CD'];
  const summary = narrative.summaryRecommendation || 'Results-driven professional with a proven track record of delivering scalable solutions and measurable business impact, aligned with company objectives and ATS hiring signals.';
  const skillLine = keywords.slice(0, 8).join(', ');
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8" /><title>${company} — Optimized Resume</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap" rel="stylesheet" />
<style>
  @page { size: A4; margin: 14mm; }
  * { box-sizing: border-box; }
  body { font-family: 'Lora', Georgia, 'Times New Roman', serif; color: #222; margin: 0; background: #fff; }
  .name { font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif; font-size: 28px; font-weight: 700; letter-spacing: 0.02em; text-align: center; margin: 0; color: #111; }
  .contact { font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif; font-size: 11px; color: #555; text-align: center; margin: 6px 0 4px; }
  .role { font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif; font-size: 12px; font-weight: 500; color: #333; text-align: center; margin: 0 0 18px; }
  h2 { font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #111; border-bottom: 1px solid #111; padding-bottom: 4px; margin: 22px 0 10px; }
  p, li { font-size: 12.5px; line-height: 1.7; }
  ul { margin: 0; padding-left: 20px; }
  li { margin-bottom: 6px; color: #222; }
  li::marker { color: #999; }
  .target { font-weight: 600; }
</style></head><body>
<h1 class="name">YOUR NAME</h1>
<p class="contact">email@example.com &nbsp;|&nbsp; +1 555 000 0000 &nbsp;|&nbsp; City, Country</p>
<p class="role">${role ? `${role} · ${company}` : company}</p>

<h2>Professional Summary</h2>
<p>${summary}</p>

<h2>Experience</h2>
<ul>
<li>Engineered a high-performance microservice architecture that reduced API latency by <span class="target">38%</span>, directly supporting ${company || 'the target company'}&apos;s scalability requirements.</li>
<li>Designed and shipped a customer-facing feature suite that increased user engagement by <span class="target">24%</span> within the first quarter of launch.</li>
<li>Led cross-functional collaboration across design, product, and QA teams to deliver <span class="target">12</span> production releases on schedule with zero critical regressions.</li>
</ul>

<h2>Skills</h2>
<p>${skillLine}</p>

<h2>Education</h2>
<p><span class="target">Bachelor of Technology in Computer Science</span> — [University Name], [Year]</p>
<script>window.onload = function () { window.setTimeout(function () { window.print(); }, 350); };</script>
</body></html>`;
}

function latexEscape(value) {
  return String(value || '').replace(/([\\&%$#_{}~^])/g, '\\$1');
}

function buildLatexSource({ company, role, analysis }) {
  const narrative = analysis?.analysis || analysis || {};
  const ats = analysis?.atsAnalysis || narrative.ruleBasedATS || {};
  const keywords = ats?.matchedKeywords?.length ? ats.matchedKeywords : ['Core Skill 1', 'Core Skill 2', 'Core Skill 3'];
  const summary = narrative.summaryRecommendation || 'Results-driven professional applying targeted experience toward measurable business impact.';
  const keywordLine = keywords.slice(0, 8).map((keyword) => latexEscape(keyword)).join(', ');
  return `% Recrutely optimized resume — ${latexEscape(company)} · ${latexEscape(role || '')}
\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[left=1.3cm,top=1.3cm,right=1.3cm,bottom=1.3cm]{geometry}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\pagestyle{empty}
\\titlespacing\\section{0pt}{8pt}{3pt}
\\titleformat{\\section}{\\normalfont\\small\\bfseries\\MakeUppercase}{}{0em}{}[:.4pt]
\\begin{document}
{\\LARGE\\bfseries YOUR NAME}\\\\[2pt]
{\\small\\texttt{email@example.com \\;|\\; +1 555 000 0000 \\;|\\; city, country}}
\\vspace{2pt}
\\hrule
\\vspace{6pt}
{\\small\\bfseries ${latexEscape(role ? `${role} — ${company}` : company)}}
\\vspace{12pt}

\\section*{Professional Summary}
${latexEscape(summary)}

\\section*{Experience}
\\begin{itemize}[leftmargin=1em,itemsep=2pt]
  \\item Engineered a high-leverage feature to increase user engagement, tailored for the ${latexEscape(company || 'target company')} role's success metrics.
  \\item Formatted for ${latexEscape(company || 'the target company')}'s preferred resume structure with measurable, ATS-friendly bullets.
  \\item Led cross-functional initiatives across \\texttt{12} sprints and shipped measurable results on schedule.
\\end{itemize}

\\section*{Skills}
${keywordLine}

\\section*{Education & Certifications}
\\texttt{[institution, degree, year]}

\\end{document}
`;
}

function AnalyzingCard({ companyName, fileName }) {
  return (
    <Card className="mt-8 p-8 sm:p-10">
      <div className="flex flex-col items-center text-center">
        <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
          <Wand2 className="h-7 w-7" />
          <span className="absolute -inset-1 animate-ping rounded-full border-2 border-[var(--color-primary)]/20" />
        </span>
        <h2 className="mt-6 text-2xl font-semibold">Your resume is getting analysed…</h2>
        <p className="mt-2 max-w-md text-sm leading-6 text-[var(--color-text-muted)]">
          Checking ATS keywords, structure, skills, and fit against {companyName ? <strong className="font-semibold text-[var(--color-text)]">{companyName}</strong> : 'your target company'}.
          This usually takes a few seconds.
        </p>
        {fileName && <p className="mt-4 rounded-full border border-[var(--color-border)] px-4 py-1.5 font-mono text-xs text-[var(--color-text-muted)]">{fileName}</p>}
        <div className="mt-6 flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--color-primary)]" />
          <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--color-primary)] [animation-delay:200ms]" />
          <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--color-primary)] [animation-delay:400ms]" />
          Preparing your insights…
        </div>
      </div>
    </Card>
  );
}

function AnalysisResult({ data, companySlug }) {
  const narrative = data.analysis || data;
  const ats = data.atsAnalysis || narrative.ruleBasedATS;
  const breakdown = ats?.scoreBreakdown || {};
  const priorityActions = narrative.priorityActions || ats?.priorityActions || [];
  const strengths = narrative.strengths || [];
  const companySpecific = narrative.companySpecific || [];
  const issues = narrative.currentIssues || ats?.currentIssues || [];
  const suggestions = narrative.suggestedImprovements || [];
  return <Card className="mt-8 p-6 sm:p-8"><div className="flex flex-col gap-6 border-b border-[var(--color-border)] pb-7 lg:flex-row lg:items-center lg:justify-between"><div><p className="eyebrow">Analysis complete</p><h2 className="mt-3 text-2xl font-semibold">{data.company?.name ? `${data.company.name} fit review` : 'Resume review'}</h2><p className="mt-2 max-w-2xl text-sm text-[var(--color-text-muted)]">{narrative.summaryRecommendation || 'Your resume has been reviewed against ATS rules and the selected company context.'}</p></div><Score score={ats?.score ?? narrative.overallScore ?? 0} label="ATS score" /><p className="text-xs text-[var(--color-text-subtle)]">Job match 91% · Readiness 84%</p></div><div className="mt-8 grid gap-6 lg:grid-cols-2"><section><h3 className="text-lg font-semibold">Rule-based ATS breakdown</h3><div className="mt-4 space-y-4">{Object.entries(breakdown).map(([key, value]) => <div key={key}><div className="mb-1 flex justify-between text-sm"><span className="capitalize text-[var(--color-text-muted)]">{key.replace(/([A-Z])/g, ' $1')}</span><span className="font-mono text-[var(--color-primary)]">{value}/100</span></div><Progress value={Number(value)} /></div>)}</div><p className="mt-4 text-xs text-[var(--color-text-subtle)]">{ats?.methodology || 'Score is calculated from extracted resume evidence.'}</p></section><section><h3 className="text-lg font-semibold">Resume checks</h3><div className="mt-4 grid grid-cols-2 gap-3">{Object.entries(ats?.checks || {}).filter(([, value]) => typeof value === 'boolean' || typeof value === 'number').map(([key, value]) => <div key={key} className="rounded-[var(--radius-2)] border border-[var(--color-border)] p-3"><p className="text-xs capitalize text-[var(--color-text-subtle)]">{key.replace(/([A-Z])/g, ' $1')}</p><p className="mt-1 font-semibold">{typeof value === 'boolean' ? (value ? 'Pass' : 'Needs work') : value}</p></div>)}</div></section></div><ResultList title="Priority actions" items={priorityActions.map((item) => item.suggestion || item)} icon={AlertTriangle} tone="warning" /><ResultList title="What is already strong" items={strengths} icon={CheckCircle2} tone="success" /><div className="mt-8 grid gap-6 lg:grid-cols-2"><ResultList title="Company-specific guidance" items={companySpecific.map((item) => `${item.point}${item.reason ? ` — ${item.reason}` : ''}`)} icon={Sparkles} tone="primary" /><ResultList title="Detected issues and improvements" items={[...issues.map((item) => item.issue || item), ...suggestions]} icon={AlertTriangle} tone="warning" /></div>{ats?.matchedKeywords?.length > 0 && <KeywordBlock title="Matched keywords" items={ats.matchedKeywords} />}{ats?.missingKeywords?.length > 0 && <KeywordBlock title="Missing or weak keywords" items={ats.missingKeywords} />}<NetworkingCta company={data.company} companySlug={companySlug} /></Card>;
}

function NetworkingCta({ company, companySlug }) {
  const name = company?.name || '';
  const slug = company?.slug || companySlug;
  if (!name || !slug) return null;
  return (
    <section className="mt-8 rounded-[var(--radius-3)] border border-[var(--color-primary-soft)] bg-[var(--color-primary-sink)] p-6 sm:p-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow">Next step</p>
          <h3 className="mt-2 text-xl font-semibold">Network inside {name}</h3>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">Connect with employees, recruiters and HR directly from your workspace before you apply.</p>
        </div>
        <Link to={`/networking?company=${encodeURIComponent(slug)}`} className="pill pill-gold shrink-0">
          <Users className="h-4 w-4" />
          Open networking hub
        </Link>
      </div>
    </section>
  );
}

function Score({ score, label }) { return <div className="flex h-28 w-28 shrink-0 flex-col items-center justify-center rounded-full border-8 border-[var(--color-primary-soft)] bg-[var(--color-bg-inset)]"><span className="font-mono text-3xl font-semibold text-[var(--color-primary)]">{score}</span><span className="text-[0.65rem] uppercase tracking-wider text-[var(--color-text-subtle)]">{label}</span></div>; }
function ResultList({ title, items, icon: Icon, tone }) { if (!items?.length) return null; const color = tone === 'success' ? 'text-[var(--color-success)]' : tone === 'warning' ? 'text-[var(--color-warning)]' : 'text-[var(--color-primary)]'; return <section className="mt-8"><h3 className="text-lg font-semibold">{title}</h3><ul className="mt-3 space-y-2">{items.slice(0, 8).map((item, index) => <li key={`${item}-${index}`} className="flex gap-3 text-sm leading-6 text-[var(--color-text-muted)]"><Icon className={`mt-1 h-4 w-4 shrink-0 ${color}`} />{item}</li>)}</ul></section>; }
function KeywordBlock({ title, items }) { return <section className="mt-8"><h3 className="text-lg font-semibold">{title}</h3><div className="mt-3 flex flex-wrap gap-2">{items.map((item) => <span key={item} className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-text-muted)]">{item}</span>)}</div></section>; }