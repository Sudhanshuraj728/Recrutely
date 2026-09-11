import { Link } from 'react-router-dom';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { Card, PageHeader } from '../components/ui';

export default function Upgrade() {
  return <div className="container py-10 sm:py-14"><PageHeader eyebrow="CareerCraft Pro" title="Go deeper when you are ready." description="Premium unlocks the company intelligence and analysis depth you need for a focused search." /><Card className="mt-10 max-w-2xl border-[var(--color-primary)] p-8"><Sparkles className="h-7 w-7 text-[var(--color-primary)]" /><h2 className="mt-5 text-2xl font-semibold">Premium workspace</h2><ul className="mt-6 space-y-3 text-sm text-[var(--color-text-muted)]">{['Unlimited resume analyses', 'Full company details and insights', 'Advanced matching and filters', 'Priority support'].map((item) => <li key={item} className="flex gap-2"><Check className="h-4 w-4 text-[var(--color-primary)]" />{item}</li>)}</ul><Link to="/pricing" className="pill pill-gold mt-8">View pricing <ArrowRight className="h-4 w-4" /></Link></Card></div>;
}
