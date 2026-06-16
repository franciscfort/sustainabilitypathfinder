import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, BookmarkCheck, Trash2 } from "lucide-react";
import { getSaved, useSavedListener, toggleSaved } from "@/lib/savedItems";
import { careerPathsV2, getCertById, getResourceById, getSkillBySlug } from "@/data/platform";
import { getRecentAssessments, SavedAssessment } from "@/lib/assessmentStorage";

export default function Dashboard() {
  const [saved, setSaved] = useState(getSaved());
  const [assessment, setAssessment] = useState<SavedAssessment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => useSavedListener(() => setSaved(getSaved())), []);
  useEffect(() => {
    getRecentAssessments(1).then((rows) => {
      setAssessment(rows[0] ?? null);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <Helmet>
        <title>Your Dashboard — Sustainability Pathfinder</title>
        <meta name="description" content="Your saved sustainability career paths, skills, certifications, and resources." />
      </Helmet>
      <section className="max-w-6xl mx-auto px-4 py-12 space-y-10">
        <header>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Your Dashboard</h1>
          <p className="text-muted-foreground">Everything you've saved and the path that matched your assessment.</p>
        </header>

        {/* Assessment match */}
        <Card>
          <CardContent className="p-6">
            <h2 className="font-semibold mb-3">Your latest assessment match</h2>
            {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
            {!loading && !assessment && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">You haven't taken the assessment yet on this device.</p>
                <Link to="/assessment"><Button variant="hero">Take the Assessment</Button></Link>
              </div>
            )}
            {!loading && assessment && (
              <div className="space-y-3">
                {assessment.career_matches.slice(0, 2).map((m: any, i) => {
                  const slug = m.career?.id ?? m.career?.slug;
                  const v2 = careerPathsV2.find((c) => c.slug === slug);
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <div className="text-2xl">{v2?.icon ?? m.career?.icon ?? "🌱"}</div>
                      <div className="flex-1">
                        <div className="font-medium">{m.career?.title ?? v2?.name}</div>
                        <div className="text-xs text-muted-foreground">Match score: {Math.round(m.score)}</div>
                      </div>
                      {v2 && <Link to={`/careers/${v2.slug}`}><Button size="sm" variant="outline">View roadmap</Button></Link>}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tracked skills */}
        <SavedSection title="Skills you're tracking" emptyMessage="Pick a skill from the Skills Library to start tracking it." icon={<Target className="w-5 h-5" />}>
          {saved.trackedSkills.map((slug) => {
            const s = getSkillBySlug(slug);
            if (!s) return null;
            return (
              <Row key={slug} title={s.name} subtitle={s.whatItIs} actionLabel="Open" actionHref={`/skills/${slug}`} onRemove={() => toggleSaved("trackedSkills", slug)} />
            );
          })}
        </SavedSection>

        {/* Saved careers */}
        <SavedSection title="Saved career paths" emptyMessage="Bookmark a career to keep it here." icon={<BookmarkCheck className="w-5 h-5" />}>
          {saved.careers.map((slug) => {
            const c = careerPathsV2.find((x) => x.slug === slug);
            if (!c) return null;
            return <Row key={slug} title={`${c.icon} ${c.name}`} subtitle={c.tagline} actionLabel="Open" actionHref={`/careers/${slug}`} onRemove={() => toggleSaved("careers", slug)} />;
          })}
        </SavedSection>

        {/* Saved skills */}
        <SavedSection title="Saved skills" emptyMessage="No saved skills yet.">
          {saved.skills.map((slug) => {
            const s = getSkillBySlug(slug);
            if (!s) return null;
            return <Row key={slug} title={s.name} subtitle={s.whatItIs} actionLabel="Open" actionHref={`/skills/${slug}`} onRemove={() => toggleSaved("skills", slug)} />;
          })}
        </SavedSection>

        {/* Saved certifications */}
        <SavedSection title="Saved certifications" emptyMessage="Bookmark certifications from the hub.">
          {saved.certifications.map((id) => {
            const c = getCertById(id);
            if (!c) return null;
            return <Row key={id} title={c.name} subtitle={`${c.provider} · ${c.timeCommitment}`} actionLabel="Browse" actionHref="/certifications" onRemove={() => toggleSaved("certifications", id)} />;
          })}
        </SavedSection>

        {/* Saved resources */}
        <SavedSection title="Saved resources" emptyMessage="Bookmark courses, books or podcasts from Resources.">
          {saved.resources.map((id) => {
            const r = getResourceById(id);
            if (!r) return null;
            return <Row key={id} title={r.title} subtitle={`${r.provider} · ${r.type}`} actionLabel="Browse" actionHref="/resources" onRemove={() => toggleSaved("resources", id)} />;
          })}
        </SavedSection>
      </section>
    </>
  );
}

function SavedSection({ title, emptyMessage, children, icon }: { title: string; emptyMessage: string; children: React.ReactNode; icon?: React.ReactNode }) {
  const hasChildren = Array.isArray(children) ? children.some(Boolean) : Boolean(children);
  return (
    <div>
      <h2 className="font-semibold mb-3 flex items-center gap-2">{icon}{title}</h2>
      <Card><CardContent className="p-4">
        {hasChildren ? <div className="divide-y divide-border">{children}</div> : <p className="text-sm text-muted-foreground">{emptyMessage}</p>}
      </CardContent></Card>
    </div>
  );
}

function Row({ title, subtitle, actionLabel, actionHref, onRemove }: { title: string; subtitle: string; actionLabel: string; actionHref: string; onRemove: () => void }) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{title}</div>
        <div className="text-sm text-muted-foreground line-clamp-2">{subtitle}</div>
      </div>
      <Link to={actionHref}><Button size="sm" variant="outline">{actionLabel}</Button></Link>
      <button onClick={onRemove} className="p-2 text-muted-foreground hover:text-destructive" aria-label="Remove"><Trash2 className="w-4 h-4" /></button>
    </div>
  );
}
