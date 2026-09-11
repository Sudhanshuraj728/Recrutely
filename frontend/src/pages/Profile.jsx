import { Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { Avatar, Card, PageHeader } from '../components/ui';

export default function Profile() {
  const { user } = useAuthContext();
  return <div className="container py-10 sm:py-14"><PageHeader eyebrow="Account" title="Your profile" description="The identity CareerCraft uses for your workspace and recommendations." /><Card className="mt-8 flex max-w-2xl items-center gap-5 p-6"><Avatar name={user?.name || 'User'} src={user?.avatar} size="lg" /><div><h2 className="text-xl font-semibold">{user?.name || 'CareerCraft user'}</h2><p className="mt-1 text-sm text-[var(--color-text-muted)]">{user?.email || 'No email available'}</p><p className="mt-3 text-xs uppercase tracking-[0.16em] text-[var(--color-primary)]">{user?.subscriptionPlan || 'free'} plan</p></div></Card><Link to="/settings" className="pill pill-outline mt-6">Manage settings</Link></div>;
}
