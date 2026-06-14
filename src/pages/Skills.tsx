import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { skills, skillCategoryLabels, SkillCategory } from "@/data/platform";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Skills() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<SkillCategory | "all">("all");

  const filtered = useMemo(() => {
    return skills.filter((s) => {
      if (cat !== "all" && s.category !== cat) return false;
      if (q && !s.name.toLowerCase().includes(q.toLowerCase()) && !s.whatItIs.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [q, cat]);

  const cats = Object.entries(skillCategoryLabels) as [SkillCategory, string][];

  return (
    <>
      <Helmet>
        <title>Skills Library — Sustainability Career Pathfinder</title>
        <meta name="description" content="Browse sustainability skills by category — what they are, why they matter, and where to learn them." />
      </Helmet>
      <section className="max-w-7xl mx-auto px-4 py-12">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Skills Library</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The technical and soft skills that power sustainability careers — organized by domain.
          </p>
        </header>

        <div className="max-w-xl mx-auto mb-6 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search skills…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>

        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          <Chip active={cat === "all"} onClick={() => setCat("all")}>All</Chip>
          {cats.map(([id, label]) => (
            <Chip key={id} active={cat === id} onClick={() => setCat(id)}>{label}</Chip>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((s) => (
            <Link key={s.slug} to={`/skills/${s.slug}`}>
              <Card className="h-full hover:shadow-card-hover transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={cn("text-[10px] uppercase tracking-wide px-2 py-0.5 rounded", s.kind === "technical" ? "bg-accent/15 text-accent" : "bg-primary/10 text-primary")}>{s.kind}</span>
                    <span className="text-xs text-muted-foreground">{skillCategoryLabels[s.category]}</span>
                  </div>
                  <h2 className="font-semibold mb-1">{s.name}</h2>
                  <p className="text-sm text-muted-foreground line-clamp-3">{s.whatItIs}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-12">No skills match.</p>}
      </section>
    </>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={cn("px-3 py-1.5 rounded-full text-sm border transition-colors", active ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:bg-muted border-border")}>
      {children}
    </button>
  );
}
