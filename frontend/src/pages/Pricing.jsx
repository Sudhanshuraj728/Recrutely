import { useEffect, useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { subscriptionService } from '../services';
import { Card, PageHeader } from '../components/ui';

export default function Pricing() {
  const [pricing, setPricing] = useState(null);
  useEffect(() => { subscriptionService.getPricing().then((response) => setPricing(response?.data || null)); }, []);
  const plans = pricing ? [pricing.free, pricing.premium] : [];
  return <div className="container py-10 sm:py-14"><PageHeader eyebrow="Premium access" title="Choose the pace that fits your search." description="Start with the free plan and upgrade when you need deeper company intelligence and more analysis." /><div className="mt-10 grid gap-5 md:grid-cols-2">{plans.map((plan, index) => <Card key={plan.name} className={index === 1 ? 'border-[var(--color-primary)] p-7' : 'p-7'}><Sparkles className="h-6 w-6 text-[var(--color-primary)]" /><p className="mt-5 text-xs uppercase tracking-[0.16em] text-[var(--color-text-subtle)]">{plan.name}</p><p className="mt-2 text-4xl font-semibold">{plan.currency} {plan.price}<span className="text-sm font-normal text-[var(--color-text-muted)]">{plan.period ? ` / ${plan.period}` : ''}</span></p><ul className="mt-6 space-y-3">{plan.features?.map((feature) => <li key={feature} className="flex gap-2 text-sm text-[var(--color-text-muted)]"><Check className="h-4 w-4 shrink-0 text-[var(--color-primary)]" />{feature}</li>)}</ul>{index === 1 && <Link to="/upgrade" className="pill pill-gold mt-7 w-full">Upgrade to Premium</Link>}</Card>)}</div></div>;
}
