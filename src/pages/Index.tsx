import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight, Compass, BookOpen, Wrench, Award, LayoutDashboard, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SocialProof } from "@/components/SocialProof";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Sustainability Career Pathfinder — Discover, Learn, Build</title>
        <meta name="description" content="Discover the right sustainability career, learn the skills that matter, and build the experience to grow. A free global platform." />
        <link rel="canonical" href="https://sustainabilitypathfinder.lovable.app/" />
      </Helmet>

      {/* Hero */}
      <section className="px-4 py-20 md:py-28">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-4 px-3 py-1 rounded-full bg-primary/10">
            <Sparkles className="w-3.5 h-3.5" /> Pathfinder 2.0
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-balance">
            Build a career that<br /><span className="text-primary">heals the planet.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-balance">
            A free, global platform to discover the right sustainability career, learn the skills that matter, and build a portfolio that gets you hired.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/assessment"><Button variant="hero" size="xl">Take the Assessment <ArrowRight className="w-5 h-5" /></Button></Link>
            <Link to="/careers"><Button variant="outline" size="xl">Explore Career Paths</Button></Link>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">✓ 3–5 minutes  •  ✓ 12 specialized paths  •  ✓ 100% free</p>
        </div>
      </section>

      {/* Journey */}
      <section className="px-4 py-16 gradient-soft">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">Your career journey, in one place</h2>
          <p className="text-center text-muted-foreground mb-10">Discover → Learn → Build Skills → Gain Experience → Advance</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <JourneyStep to="/assessment" icon={<Compass />} title="Discover" desc="Take the free assessment to find paths that fit." />
            <JourneyStep to="/careers" icon={<BookOpen />} title="Learn" desc="Explore 12 career roadmaps with full guidance." />
            <JourneyStep to="/skills" icon={<Wrench />} title="Skills" desc="Build the technical and soft skills you need." />
            <JourneyStep to="/certifications" icon={<Award />} title="Certify" desc="Pick certifications that move your career forward." />
            <JourneyStep to="/dashboard" icon={<LayoutDashboard />} title="Track" desc="Save and track your progress in one dashboard." />
          </div>
        </div>
      </section>

      {/* Featured paths */}
      <section className="px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-baseline justify-between mb-6 flex-wrap gap-2">
            <h2 className="text-3xl font-bold">Featured career paths</h2>
            <Link to="/careers" className="text-primary text-sm font-semibold hover:underline">View all 12 →</Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {["esg-reporting", "carbon-markets", "climate-policy", "renewable-energy", "sustainability-data", "circular-economy"].map((slug) => (
              <FeaturedCard key={slug} slug={slug} />
            ))}
          </div>
        </div>
      </section>

      <SocialProof />
    </>
  );
};

function JourneyStep({ to, icon, title, desc }: { to: string; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Link to={to}>
      <Card className="h-full hover:shadow-card-hover transition-shadow">
        <CardContent className="p-5 text-center">
          <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-primary/10 text-primary flex items-center justify-center">{icon}</div>
          <div className="font-semibold mb-1">{title}</div>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

import { careerPathsV2 } from "@/data/platform";

function FeaturedCard({ slug }: { slug: string }) {
  const c = careerPathsV2.find((x) => x.slug === slug);
  if (!c) return null;
  return (
    <Link to={`/careers/${c.slug}`}>
      <Card className="h-full hover:shadow-card-hover transition-shadow">
        <CardContent className="p-5">
          <div className="text-3xl mb-2">{c.icon}</div>
          <div className="font-semibold mb-1">{c.name}</div>
          <p className="text-sm text-muted-foreground">{c.tagline}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

export default Index;
