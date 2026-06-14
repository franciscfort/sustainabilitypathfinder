import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { careerPathsV2 } from "@/data/platform";

export default function Roadmaps() {
  return (
    <>
      <Helmet>
        <title>Sustainability Career Roadmaps</title>
        <meta name="description" content="90-day learning roadmaps for every sustainability career path." />
      </Helmet>
      <section className="max-w-6xl mx-auto px-4 py-12">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Career Roadmaps</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Pick a path and follow a structured 90-day plan — what to learn, build, and do, week by week.
          </p>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {careerPathsV2.map((c) => (
            <Link key={c.slug} to={`/careers/${c.slug}`}>
              <Card className="h-full hover:shadow-card-hover transition-shadow">
                <CardContent className="p-5">
                  <div className="text-3xl mb-2">{c.icon}</div>
                  <h2 className="font-semibold mb-1">{c.name}</h2>
                  <p className="text-sm text-muted-foreground mb-4">{c.tagline}</p>
                  <div className="text-sm font-semibold text-primary inline-flex items-center gap-1">
                    See 90-day plan <ArrowRight className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
