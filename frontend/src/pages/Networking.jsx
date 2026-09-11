import { useEffect, useState } from 'react';
import { Linkedin, Users } from 'lucide-react';
import { linkedinService } from '../services';
import { Button, Card, PageHeader } from '../components/ui';

export default function Networking() {
  const [status, setStatus] = useState(null);
  useEffect(() => { linkedinService.getStatus().then((response) => setStatus(response?.data || response)).catch(() => setStatus({ connected: false })); }, []);
  const connected = Boolean(status?.connected || status?.isConnected || status?.linkedinConnected);
  return <div className="container py-10 sm:py-14"><PageHeader eyebrow="Networking" title="Build warmer paths into your next role." description="Connect LinkedIn to discover relevant people and company-specific networking opportunities." /><Card className="mt-8 max-w-2xl p-7"><div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-2)] bg-[#0a66c2]/15 text-[#70b7ff]"><Linkedin className="h-6 w-6" /></div><h2 className="mt-5 text-xl font-semibold">{connected ? 'LinkedIn is connected' : 'Connect LinkedIn'}</h2><p className="mt-2 text-sm text-[var(--color-text-muted)]">{connected ? 'You can now use company employee insights from your workspace.' : 'Use the secure LinkedIn flow to connect your profile.'}</p><Button className="mt-6" onClick={() => { window.location.href = connected ? '/api/linkedin/status' : '/auth/linkedin'; }}>{connected ? <><Users className="h-4 w-4" />View connection</> : <><Linkedin className="h-4 w-4" />Connect LinkedIn</>}</Button></Card></div>;
}
