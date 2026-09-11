import { useEffect, useState } from 'react';
import { ArrowRight, Building2, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { companyService } from '../services';
import { Button, Card, Input, PageHeader, Skeleton } from '../components/ui';

export default function Companies() {
  const [query, setQuery] = useState('');
  const [companies, setCompanies] = useState([]);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { loadCompanies(); }, []);
  async function loadCompanies(search = '') { setLoading(true); setError(''); try { const response = search ? await companyService.searchCompanies(search) : await companyService.getCompanies({ limit: 100 }); setCompanies(response?.data || []); } catch (err) { setError(err.message || 'Unable to load companies'); } finally { setLoading(false); } }
  function submit(event) { event.preventDefault(); loadCompanies(query.trim()); }
  const categories = ['All', ...new Set(companies.map((company) => company.category || company.industry).filter(Boolean))];
  const visibleCompanies = category === 'All' ? companies : companies.filter((company) => (company.category || company.industry) === category);

  return <div className="container py-10 sm:py-14"><PageHeader eyebrow="Company intelligence" title="Research where you want to work." description="Browse companies by type, then compare signals, locations, and available roles before you apply." /><form onSubmit={submit} className="mt-8 flex max-w-2xl gap-3"><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search companies" aria-label="Search companies" /><Button type="submit"><Search className="h-4 w-4" />Search</Button></form><div className="mt-5 flex flex-wrap gap-2">{categories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${category === item ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]' : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-border-strong)]'}`}>{item}</button>)}</div>{error && <p role="alert" className="mt-5 text-sm text-[var(--color-danger)]">{error}</p>}{loading ? <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[1,2,3,4,5,6].map((item) => <Skeleton key={item} className="h-36" />)}</div> : <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{visibleCompanies.map((company) => <Card key={company.slug} as={Link} to={`/companies/${company.slug}`} interactive className="p-5"><div className="flex items-start justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-2)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"><Building2 className="h-5 w-5" /></span><ArrowRight className="h-4 w-4 text-[var(--color-text-subtle)]" /></div><h2 className="mt-5 font-semibold">{company.name}</h2><p className="mt-1 text-sm text-[var(--color-text-muted)]">{company.category || company.industry || 'Career opportunity'}{company.location ? ` · ${company.location}` : ''}</p></Card>)}{!visibleCompanies.length && <p className="col-span-full py-10 text-center text-[var(--color-text-muted)]">No companies found in this category.</p>}</div>}</div>;
}
