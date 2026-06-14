import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { careerPathsV2 } from "@/data/platform";

export default function Careers() {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return careerPathsV2;
    return careerPathsV2.filter(
      (c) =>
        c.name.toLowerCase().includes(s) ||
        c.tagline.toLowerCase().includes(s) ||
        c.overview.what.toLowerCase().includes(s)
    );
  }, [q]);

  return (
    <>
      <Helmet>
        <title>Explore Sustainability Career Paths — Pathfinder</title>
        <meta name="description" content="Browse 12 sustainability career pathways with full roadmaps, skills, certifications and portfolio projects." />
      </Helmet>
      <section className="max-w-7xl mx-auto px-4 py-12">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Explore Sustainability Career Paths</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            12 specialized pathways. Each one has a full roadmap, recommended skills, certifications and portfolio projects.
          </p>
        </header>

        <div className="max-w-xl mx-auto mb-10 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search career paths…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((c) => (
            <Link key={c.slug} to={`/careers/${c.slug}`}>
              <Card className="h-full shadow-card hover:shadow-card-hover transition-shadow group">
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">{c.icon}</div>
                  <h2 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">{c.name}</h2>
                  <p className="text-sm text-muted-foreground mb-4">{c.tagline}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2 py-1 rounded-md bg-primary/10 text-primary capitalize">
                      Demand: {c.overview.demand.replace("-", " ")}
                    </span>
                    <span className="text-primary font-semibold">View roadmap →</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No paths match your search.</p>
        )}
      </section>
    </>
  );
}
