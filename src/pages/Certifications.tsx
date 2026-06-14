import { useState, useMemo, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { certifications, careerPathsV2 } from "@/data/platform";
import { isSaved, toggleSaved, useSavedListener } from "@/lib/savedItems";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const levels = ["all", "beginner", "intermediate", "advanced"] as const;
const costs = ["all", "free", "freemium", "paid"] as const;

export default function Certifications() {
  const [path, setPath] = useState<string>("all");
  const [level, setLevel] = useState<(typeof levels)[number]>("all");
  const [cost, setCost] = useState<(typeof costs)[number]>("all");
  const [, force] = useState(0);
  useEffect(() => useSavedListener(() => force((n) => n + 1)), []);

  const filtered = useMemo(() => certifications.filter((c) => {
    if (path !== "all" && !c.careerPaths.includes(path)) return false;
    if (level !== "all" && c.level !== level) return false;
    if (cost !== "all" && c.cost !== cost) return false;
    return true;
  }), [path, level, cost]);

  return (
    <>
      <Helmet>
        <title>Sustainability Certifications Hub</title>
        <meta name="description" content="Filter sustainability certifications by career path, level, and cost." />
      </Helmet>
      <section className="max-w-7xl mx-auto px-4 py-12">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Certifications Hub</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">Curated certifications for sustainability professionals at every stage.</p>
        </header>

        <div className="grid sm:grid-cols-3 gap-3 mb-8">
          <Select label="Career path" value={path} onChange={setPath} options={[{ value: "all", label: "All paths" }, ...careerPathsV2.map((c) => ({ value: c.slug, label: c.name }))]} />
          <Select label="Level" value={level} onChange={(v) => setLevel(v as any)} options={levels.map((l) => ({ value: l, label: l[0].toUpperCase() + l.slice(1) }))} />
          <Select label="Cost" value={cost} onChange={(v) => setCost(v as any)} options={costs.map((c) => ({ value: c, label: c[0].toUpperCase() + c.slice(1) }))} />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((c) => {
            const saved = isSaved("certifications", c.id);
            return (
              <Card key={c.id} className="h-full shadow-card hover:shadow-card-hover transition-shadow">
                <CardContent className="p-5 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <h2 className="font-semibold">{c.name}</h2>
                    <button onClick={() => { const n = toggleSaved("certifications", c.id); toast.success(n ? "Bookmarked" : "Removed"); }} className="shrink-0 text-muted-foreground hover:text-primary">
                      {saved ? <BookmarkCheck className="w-4 h-4 text-primary" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="text-xs text-muted-foreground mb-3">{c.provider}</div>
                  <p className="text-sm text-muted-foreground mb-4 flex-1">{c.description}</p>
                  <div className="flex flex-wrap gap-1.5 text-[11px]">
                    <span className={cn("px-2 py-0.5 rounded capitalize", c.level === "beginner" ? "bg-muted" : c.level === "intermediate" ? "bg-accent/15 text-accent" : "bg-primary/10 text-primary")}>{c.level}</span>
                    <span className="px-2 py-0.5 rounded bg-muted capitalize">{c.cost}{c.costNote ? ` · ${c.costNote}` : ""}</span>
                    <span className="px-2 py-0.5 rounded bg-muted">{c.timeCommitment}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-12">No certifications match these filters.</p>}
      </section>
    </>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <label className="block">
      <span className="text-xs uppercase text-muted-foreground">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-md border border-border bg-card text-sm">
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}
