import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Bookmark, BookmarkCheck, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getSkillBySlug, careerPathsV2, getResourceById, getCertById, skillCategoryLabels } from "@/data/platform";
import { isSaved, toggleSaved, useSavedListener } from "@/lib/savedItems";
import { toast } from "sonner";

export default function SkillDetail() {
  const { slug = "" } = useParams();
  const skill = getSkillBySlug(slug);
  const [, force] = useState(0);
  useEffect(() => useSavedListener(() => force((n) => n + 1)), []);

  if (!skill) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-2">Skill not found</h1>
        <Link to="/skills" className="text-primary underline">Back to skills library</Link>
      </div>
    );
  }

  const saved = isSaved("skills", skill.slug);
  const tracked = isSaved("trackedSkills", skill.slug);

  return (
    <>
      <Helmet>
        <title>{skill.name} — Skill</title>
        <meta name="description" content={skill.whatItIs} />
      </Helmet>
      <section className="max-w-4xl mx-auto px-4 py-12">
        <Link to="/skills" className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-4 hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Skills Library
        </Link>
        <div className="flex justify-between items-start flex-wrap gap-4 mb-2">
          <h1 className="text-3xl md:text-4xl font-bold">{skill.name}</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { const n = toggleSaved("trackedSkills", skill.slug); toast.success(n ? "Tracking this skill" : "Stopped tracking"); }}>
              <Target className="w-4 h-4 mr-2" />{tracked ? "Tracking" : "Track this skill"}
            </Button>
            <Button variant="secondary" onClick={() => { const n = toggleSaved("skills", skill.slug); toast.success(n ? "Saved" : "Removed"); }}>
              {saved ? <BookmarkCheck className="w-4 h-4 mr-2" /> : <Bookmark className="w-4 h-4 mr-2" />}{saved ? "Saved" : "Save"}
            </Button>
          </div>
        </div>
        <div className="flex gap-2 mb-8 text-xs">
          <span className="px-2 py-1 rounded bg-muted">{skillCategoryLabels[skill.category]}</span>
          <span className="px-2 py-1 rounded bg-muted capitalize">{skill.kind}</span>
        </div>

        <div className="space-y-5">
          <Card><CardContent className="p-5"><h2 className="font-semibold mb-2">What it is</h2><p className="text-muted-foreground">{skill.whatItIs}</p></CardContent></Card>
          <Card><CardContent className="p-5"><h2 className="font-semibold mb-2">Why it matters</h2><p className="text-muted-foreground">{skill.whyItMatters}</p></CardContent></Card>

          <Card><CardContent className="p-5">
            <h2 className="font-semibold mb-3">Career paths that use this skill</h2>
            <div className="flex flex-wrap gap-2">
              {skill.careerPaths.map((s) => {
                const c = careerPathsV2.find((x) => x.slug === s);
                if (!c) return null;
                return <Link key={s} to={`/careers/${s}`} className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm hover:bg-primary/20">{c.icon} {c.name}</Link>;
              })}
            </div>
          </CardContent></Card>

          <Card><CardContent className="p-5">
            <h2 className="font-semibold mb-3">Beginner learning resources</h2>
            <ul className="space-y-3">
              {skill.beginnerResources.map((id) => {
                const r = getResourceById(id);
                if (r) return (
                  <li key={id} className="text-sm">
                    <span className="font-medium">{r.title}</span>
                    <span className="text-muted-foreground"> · {r.provider} · {r.type}</span>
                  </li>
                );
                const c = getCertById(id);
                if (c) return (
                  <li key={id} className="text-sm">
                    <span className="font-medium">{c.name}</span>
                    <span className="text-muted-foreground"> · {c.provider} · {c.timeCommitment}</span>
                  </li>
                );
                return null;
              })}
            </ul>
          </CardContent></Card>
        </div>
      </section>
    </>
  );
}
