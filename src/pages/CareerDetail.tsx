import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Bookmark, BookmarkCheck, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { careerPathsV2, getCareerBySlug, getCertById } from "@/data/platform";
import { isSaved, toggleSaved, useSavedListener } from "@/lib/savedItems";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function CareerDetail() {
  const { slug = "" } = useParams();
  const career = getCareerBySlug(slug);
  const [, force] = useState(0);
  useEffect(() => useSavedListener(() => force((n) => n + 1)), []);

  if (!career) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-2">Career path not found</h1>
        <Link to="/careers" className="text-primary underline">Back to all careers</Link>
      </div>
    );
  }

  const saved = isSaved("careers", career.slug);

  return (
    <>
      <Helmet>
        <title>{career.name} — Career Roadmap</title>
        <meta name="description" content={career.tagline} />
      </Helmet>
      <article>
        <header className="gradient-hero text-primary-foreground py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <Link to="/careers" className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-4 text-sm">
              <ArrowLeft className="w-4 h-4" /> All career paths
            </Link>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="text-5xl mb-3">{career.icon}</div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{career.name}</h1>
                <p className="text-primary-foreground/90 max-w-2xl">{career.tagline}</p>
              </div>
              <Button
                variant="secondary"
                onClick={() => {
                  const now = toggleSaved("careers", career.slug);
                  toast.success(now ? "Saved to your dashboard" : "Removed from your dashboard");
                }}
              >
                {saved ? <BookmarkCheck className="w-4 h-4 mr-2" /> : <Bookmark className="w-4 h-4 mr-2" />}
                {saved ? "Saved" : "Save"}
              </Button>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
          {/* Overview */}
          <Section title="Career Overview">
            <div className="grid md:grid-cols-2 gap-6">
              <Card><CardContent className="p-5"><h3 className="font-semibold mb-2">What it is</h3><p className="text-sm text-muted-foreground">{career.overview.what}</p></CardContent></Card>
              <Card><CardContent className="p-5"><h3 className="font-semibold mb-2">Why it matters</h3><p className="text-sm text-muted-foreground">{career.overview.why}</p></CardContent></Card>
              <Card><CardContent className="p-5"><h3 className="font-semibold mb-2">Demand level</h3><p className="text-sm text-muted-foreground capitalize">{career.overview.demand.replace("-", " ")}</p></CardContent></Card>
              <Card><CardContent className="p-5"><h3 className="font-semibold mb-2">Career growth</h3><p className="text-sm text-muted-foreground">{career.overview.growth}</p></CardContent></Card>
            </div>
          </Section>

          {/* Job titles */}
          <Section title="Typical Job Titles">
            <div className="grid sm:grid-cols-3 gap-4">
              <TitleColumn label="Entry-level" items={career.jobTitles.entry} tone="muted" />
              <TitleColumn label="Mid-level" items={career.jobTitles.mid} tone="accent" />
              <TitleColumn label="Senior" items={career.jobTitles.senior} tone="primary" />
            </div>
          </Section>

          {/* Skills */}
          <Section title="Skills Needed">
            <div className="space-y-4">
              <SkillTier level="Beginner" data={career.skills.beginner} />
              <SkillTier level="Intermediate" data={career.skills.intermediate} />
              <SkillTier level="Advanced" data={career.skills.advanced} />
            </div>
          </Section>

          {/* Tools */}
          <Section title="Technical Tools">
            <div className="flex flex-wrap gap-2">
              {career.tools.map((t) => (
                <span key={t} className="px-3 py-1.5 rounded-full bg-muted text-sm">{t}</span>
              ))}
            </div>
          </Section>

          {/* Certifications */}
          <Section title="Certifications">
            <div className="grid gap-5 md:grid-cols-3">
              <CertColumn label="Beginner" ids={career.certifications.beginner} />
              <CertColumn label="Intermediate" ids={career.certifications.intermediate} />
              <CertColumn label="Advanced" ids={career.certifications.advanced} />
            </div>
          </Section>

          {/* Projects */}
          <Section title="Portfolio Projects">
            <div className="grid md:grid-cols-3 gap-4">
              {career.projects.map((p) => (
                <Card key={p.title}><CardContent className="p-5"><h3 className="font-semibold mb-1">{p.title}</h3><p className="text-sm text-muted-foreground">{p.description}</p></CardContent></Card>
              ))}
            </div>
          </Section>

          {/* 90-day roadmap */}
          <Section title="90-Day Learning Roadmap">
            <div className="space-y-4">
              <Phase label="Days 1–30" items={career.roadmap.days1to30} />
              <Phase label="Days 31–60" items={career.roadmap.days31to60} />
              <Phase label="Days 61–90" items={career.roadmap.days61to90} />
            </div>
          </Section>

          {/* Related */}
          {career.related.length > 0 && (
            <Section title="Related Career Paths">
              <div className="grid sm:grid-cols-3 gap-4">
                {career.related.map((s) => {
                  const c = careerPathsV2.find((x) => x.slug === s);
                  if (!c) return null;
                  return (
                    <Link key={s} to={`/careers/${s}`}>
                      <Card className="h-full hover:shadow-card-hover transition-shadow">
                        <CardContent className="p-5">
                          <div className="text-2xl mb-1">{c.icon}</div>
                          <div className="font-semibold">{c.name}</div>
                          <p className="text-xs text-muted-foreground mt-1">{c.tagline}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </Section>
          )}
        </div>
      </article>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {children}
    </section>
  );
}

function TitleColumn({ label, items, tone }: { label: string; items: string[]; tone: "muted" | "accent" | "primary" }) {
  const toneClass = tone === "primary" ? "bg-primary/10 text-primary" : tone === "accent" ? "bg-accent/10 text-accent" : "bg-muted text-foreground";
  return (
    <Card><CardContent className="p-5">
      <div className={cn("inline-block text-xs font-semibold px-2 py-1 rounded mb-3", toneClass)}>{label}</div>
      <ul className="space-y-1 text-sm">{items.map((t) => <li key={t}>• {t}</li>)}</ul>
    </CardContent></Card>
  );
}

function SkillTier({ level, data }: { level: string; data: { soft: string[]; technical: string[] } }) {
  return (
    <Card><CardContent className="p-5">
      <h3 className="font-semibold mb-3">{level}</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <div className="text-xs uppercase text-muted-foreground mb-2">Soft skills</div>
          <ul className="text-sm space-y-1">{data.soft.map((s) => <li key={s}>• {s}</li>)}</ul>
        </div>
        <div>
          <div className="text-xs uppercase text-muted-foreground mb-2">Technical skills</div>
          <ul className="text-sm space-y-1">{data.technical.map((s) => <li key={s}>• {s}</li>)}</ul>
        </div>
      </div>
    </CardContent></Card>
  );
}

function CertColumn({ label, ids }: { label: string; ids: string[] }) {
  return (
    <Card><CardContent className="p-5">
      <h3 className="font-semibold mb-3">{label}</h3>
      {ids.length === 0 && <p className="text-sm text-muted-foreground">— Coming soon</p>}
      <ul className="space-y-3">
        {ids.map((id) => {
          const c = getCertById(id);
          if (!c) return null;
          return (
            <li key={id} className="text-sm">
              <Link to="/certifications" className="font-medium hover:text-primary">{c.name}</Link>
              <div className="text-xs text-muted-foreground">{c.provider} · {c.timeCommitment}</div>
            </li>
          );
        })}
      </ul>
    </CardContent></Card>
  );
}

function Phase({ label, items }: { label: string; items: string[] }) {
  return (
    <Card><CardContent className="p-5">
      <div className="text-xs font-semibold text-primary mb-2">{label}</div>
      <ul className="space-y-1 text-sm">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2"><Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />{it}</li>
        ))}
      </ul>
    </CardContent></Card>
  );
}
