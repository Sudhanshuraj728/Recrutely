import { useEffect, useState } from 'react';
import { ShieldCheck, Users, Building2 } from 'lucide-react';
import { adminService } from '../services';
import { Card, PageHeader } from '../components/ui';

export default function Admin() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { Promise.all([adminService.getUsers(), adminService.getCompanies()]).then(([users, companies]) => setData({ users: users?.data?.length || 0, companies: companies?.data?.length || 0 })).catch((err) => setError(err.message || 'Admin access required')); }, []);
  return <div className="container py-10 sm:py-14"><PageHeader eyebrow="Admin" title="Admin Console" description="Operational visibility for CareerCraft administrators." />{error ? <Card className="mt-8 p-6 text-[var(--color-danger)]">{error}</Card> : <div className="mt-8 grid gap-4 sm:grid-cols-2"><Card className="p-6"><Users className="h-5 w-5 text-[var(--color-primary)]" /><p className="mt-4 text-sm text-[var(--color-text-muted)]">Users</p><p className="mt-1 text-3xl font-semibold">{data?.users ?? '…'}</p></Card><Card className="p-6"><Building2 className="h-5 w-5 text-[var(--color-primary)]" /><p className="mt-4 text-sm text-[var(--color-text-muted)]">Companies</p><p className="mt-1 text-3xl font-semibold">{data?.companies ?? '…'}</p></Card><Card className="p-6 sm:col-span-2"><ShieldCheck className="h-5 w-5 text-[var(--color-primary)]" /><p className="mt-3 text-sm text-[var(--color-text-muted)]">Admin endpoints are protected by the backend access-control layer.</p></Card></div>}</div>;
}
