import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  CalendarDays,
  ExternalLink,
  MapPin,
  Search,
  WalletCards,
} from "lucide-react";
import { Link } from "react-router-dom";
import { companyService, jobService } from "../services";
import { Button, Card, Input, PageHeader, Skeleton } from "../components/ui";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [kind, setKind] = useState("All");
  const [query, setQuery] = useState("");
  useEffect(() => {
    async function load() {
      try {
        const companies = await companyService.getCompanies({ limit: 100 });
        const results = await Promise.all(
          (companies?.data || []).map(async (company) => {
            const response = await jobService.getJobsByCompanySlug(
              company.slug,
            );
            return (response.data || []).map((job) => ({
              ...job,
              company: response.company || company.name,
              companySlug: company.slug,
            }));
          }),
        );
        setJobs(results.flat());
      } catch (err) {
        setError(err.message || "Unable to load jobs");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);
  const isInternship = (job) => /intern/i.test(job.type || job.title || "");
  const visibleJobs = jobs.filter(
    (job) =>
      (kind === "All" ||
        (kind === "Internships"
          ? isInternship(job)
          : /full/i.test(job.type || ""))) &&
      `${job.title} ${job.company} ${job.location} ${(job.skills || []).join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const deadline = (value) =>
    value
      ? new Date(value).toLocaleDateString(undefined, {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "Check company site";
  const compensation = (job) =>
    isInternship(job)
      ? job.stipend || job.salary || "Stipend not listed"
      : job.salary || "Salary not listed";
  const deadlineTone = (value) => {
    if (!value) return "text-[var(--color-text-muted)]";
    const days = Math.ceil((new Date(value) - new Date()) / 86400000);
    return days <= 7
      ? "text-[var(--color-danger)]"
      : "text-[var(--color-text)]";
  };
  return (
    <div className="container py-10 sm:py-14">
      <PageHeader
        eyebrow="Opportunities"
        title="Find internships and full-time roles."
        description="Compare roles, compensation, skills, and application deadlines across CareerCraft companies."
      />
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-2xl font-semibold">{jobs.length}</p>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">Open opportunities</p>
        </Card>
        <Card className="p-4">
          <p className="text-2xl font-semibold">{jobs.filter(isInternship).length}</p>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">Internships with stipends</p>
        </Card>
        <Card className="p-4">
          <p className="text-2xl font-semibold">{new Set(jobs.map((job) => job.company)).size}</p>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">Hiring companies</p>
        </Card>
      </div>
      <div className="mt-8 flex flex-col gap-3 md:flex-row">
        <div className="relative max-w-xl flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-subtle)]" />
          <Input
            className="pl-10"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search role, company, or skill"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={kind === "All" ? "primary" : "outline"}
            onClick={() => setKind("All")}
          >
            All roles
          </Button>
          <Button
            variant={kind === "Internships" ? "primary" : "outline"}
            onClick={() => setKind("Internships")}
          >
            Internships
          </Button>
          <Button
            variant={kind === "Full-time" ? "primary" : "outline"}
            onClick={() => setKind("Full-time")}
          >
            Full-time
          </Button>
        </div>
      </div>
      {error && (
        <p role="alert" className="mt-5 text-sm text-[var(--color-danger)]">
          {error}
        </p>
      )}
      {loading ? (
        <div className="mt-8 space-y-3">
          {[1, 2, 3, 4].map((item) => (
            <Skeleton key={item} className="h-32" />
          ))}
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {visibleJobs.map((job, index) => (
            <Card
              key={`${job.title || job.role}-${job.company}-${index}`}
              className="p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">
                      {job.title || job.role || "Open role"}
                    </p>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs ${/intern/i.test(job.type || job.title || "") ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)]" : "bg-[var(--color-success-soft)] text-[var(--color-success)]"}`}
                    >
                      {job.type || "Full-time"}
                    </span>
                  </div>
                  <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-[var(--color-text-muted)]">
                    <BriefcaseBusiness className="h-3.5 w-3.5" />
                    {job.company}
                    <span>·</span>
                    <MapPin className="h-3.5 w-3.5" />
                    {job.location || "Multiple locations"}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-[var(--color-text-muted)]">
                    <span className="flex items-center gap-1">
                      <WalletCards className="h-3.5 w-3.5 text-[var(--color-primary)]" />
                      {compensation(job)}
                    </span>
                    <span className={`flex items-center gap-1 ${deadlineTone(job.applicationDeadline)}`}>
                      <CalendarDays className="h-3.5 w-3.5" />
                      Last date: {deadline(job.applicationDeadline)}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Link
                    to={`/resume?company=${encodeURIComponent(job.companySlug || "")}&role=${encodeURIComponent(job.title || "")}&description=${encodeURIComponent(`${job.description || ""} ${(job.requirements || []).join(", ")}`)}`}
                    className="pill pill-outline"
                  >
                    Check fit
                  </Link>
                  {job.applyUrl && (
                    <a
                      href={job.applyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="pill pill-gold"
                    >
                      Apply <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-[var(--color-text-muted)]">
                {job.description ||
                  "Review the role requirements and tailor your resume before applying."}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(job.skills || job.requirements || job.tags || [])
                  .slice(0, 6)
                  .map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-[var(--color-border)] px-2.5 py-1 text-xs text-[var(--color-text-muted)]"
                    >
                      {skill}
                    </span>
                  ))}
              </div>
            </Card>
          ))}
          {!visibleJobs.length && (
            <Card className="p-10 text-center">
              <BriefcaseBusiness className="mx-auto h-8 w-8 text-[var(--color-primary)]" />
              <h2 className="mt-4 text-lg font-semibold">No matching roles yet</h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--color-text-muted)]">
                Try another search or switch the role type. New listings should include a stipend or salary, deadline, work mode, skills, and application link.
              </p>
              <Link to="/companies" className="pill pill-outline mt-5">
                Explore companies
              </Link>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
