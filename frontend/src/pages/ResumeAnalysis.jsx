import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ArrowRight, FileSearch, Sparkles } from 'lucide-react';
import { Card, PageHeader } from '../components/ui';

export default function ResumeAnalysis() {
  const { id } = useParams();

  return <div className="container py-10 sm:py-14"><PageHeader eyebrow="Analysis" title="Resume insights" description={id ? `Reviewing analysis ${id}.` : 'Turn a resume upload into clear, targeted next steps.'} /><Card className="mt-10 max-w-2xl p-8"><FileSearch className="h-8 w-8 text-[var(--color-primary)]" /><h2 className="mt-5 text-xl font-semibold">Start with your latest resume</h2><p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">Upload a resume and select a target company to generate ATS-aware insights, keyword coverage, and practical edits.</p><Link to="/resume" className="pill pill-gold mt-6">Open resume workspace <Sparkles className="h-4 w-4" /><ArrowRight className="h-4 w-4" /></Link></Card></div>;
}
