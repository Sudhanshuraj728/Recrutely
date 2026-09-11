import { useState } from 'react';
import { LogOut, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { Button, Card, PageHeader, useToast } from '../components/ui';

export default function Settings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { logout } = useAuthContext();
  const [loggingOut, setLoggingOut] = useState(false);
  async function handleLogout() {
    setLoggingOut(true);
    try { await logout(); navigate('/', { replace: true }); }
    catch (error) { toast({ title: 'Unable to sign out', message: error.message, variant: 'error' }); setLoggingOut(false); }
  }
  return <div className="container py-10 sm:py-14"><PageHeader eyebrow="Preferences" title="Settings" description="Manage your session and account preferences." /><Card className="mt-8 max-w-2xl p-6"><div className="flex items-start gap-4"><ShieldCheck className="h-5 w-5 text-[var(--color-primary)]" /><div><h2 className="font-semibold">Account security</h2><p className="mt-1 text-sm text-[var(--color-text-muted)]">Your session uses a secure cookie and stays connected to the CareerCraft backend.</p></div></div><Button variant="outline" className="mt-6" onClick={handleLogout} loading={loggingOut}><LogOut className="h-4 w-4" />Sign out</Button></Card></div>;
}
