import { useState, useMemo, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent } from "@/components/ui/card";
import { Bookmark, BookmarkCheck, ExternalLink } from "lucide-react";
import { resources, careerPathsV2, Resource } from "@/data/platform";
import { isSaved, toggleSaved, useSavedListener } from "@/lib/savedItems";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const types: (Resource["type"] | "all")[] = ["all", "course", "article", "guide", "book", "podcast", "community", "fellowship"];

export default function Resources() {
  const [path, setPath] = useState<string>("all");
  const [type, setType] = useState<(typeof types)[number]>("all");
  const [, force] = useState(0);
  useEffect(() => useSavedListener(() => force((n) => n + 1)), []);

  const filtered = useMemo(() => resources.filter((r) => {
    if (path !== "all" && !r.careerPaths.includes(path)) return false;
    if (type !== "all" && r.type !== type) return false;
    return true;
  }), [path, type]);

  return (
    <>
      <Helmet>
        <title>Sustainability Learning Resources Hub</title>
        <meta name="description" content="Courses, books, podcasts, communities, and fellowships for sustainability professionals." />
      </Helmet>
      <section className="max-w-7xl mx-auto px-4 py-12">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Learning Resources</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">Hand-picked courses, books, podcasts, communities, and fellowships.</p>
        </header>

        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {types.map((t) => (
            <button key={t} onClick={() => setType(t)} className={cn("px-3 py-1.5 rounded-full text-sm border capitalize", type === t ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:bg-muted border-border")}>
              {t}
            </button>
          ))}
        </div>
        <div className="max-w-xs mx-auto mb-8">
          <select value={path} onChange={(e) => setPath(e.target.value)} className="w-full px-3 py-2 rounded-md border border-border bg-card text-sm">
            <option value="all">All career paths</option>
            {careerPathsV2.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((r) => {
            const saved = isSaved("resources", r.id);
            return (
              <Card key={r.id} className="h-full hover:shadow-card-hover transition-shadow">
                <CardContent className="p-5 flex flex-col h-full">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-accent/15 text-accent">{r.type}</span>
                    <button onClick={() => { const n = toggleSaved("resources", r.id); toast.success(n ? "Bookmarked" : "Removed"); }} className="text-muted-foreground hover:text-primary" aria-label={saved ? "Remove bookmark" : "Bookmark resource"}>
                      {saved ? <BookmarkCheck className="w-4 h-4 text-primary" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                  </div>
                  <h2 className="font-semibold mb-1">{r.title}</h2>
                  <div className="text-xs text-muted-foreground mb-2">{r.provider}{r.cost ? ` · ${r.cost}` : ""}</div>
                  <p className="text-sm text-muted-foreground flex-1">{r.description}</p>
                  {r.url && (
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                    >
                      Open resource <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </CardContent>
              </Card>

            );
          })}
        </div>
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-12">No resources match.</p>}
      </section>
    </>
  );
}
