import { useParams } from 'react-router-dom';
import { ArrowLeft, BriefcaseBusiness, FileSearch } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, PageHeader } from '../components/ui';

export default function JobDetails() {
  const { id } = useParams();

  return <div className="container py-10 sm:py-14"><Link to="/jobs" className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"><ArrowLeft className="h-4 w-4" />Back to jobs</Link><PageHeader eyebrow="Opportunity" title="Role details" description={id ? `Role reference: ${id}` : 'Review a role and prepare your application.'} /><Card className="mt-8 max-w-2xl p-7"><BriefcaseBusiness className="h-7 w-7 text-[var(--color-primary)]" /><h2 className="mt-5 text-xl font-semibold">Prepare before you apply.</h2><p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">Use your resume analysis to tailor your experience and compare the role against your strongest skills.</p><Link to="/resume" className="pill pill-outline mt-6"><FileSearch className="h-4 w-4" />Analyze resume</Link></Card></div>;
}
