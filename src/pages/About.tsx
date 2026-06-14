import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  return (
    <>
      <Helmet>
        <title>About — Sustainability Career Pathfinder</title>
        <meta name="description" content="A free, global platform helping people discover and build careers in sustainability." />
      </Helmet>
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">About Pathfinder</h1>
        <p className="text-lg text-muted-foreground mb-8">
          The Sustainability Career Pathfinder is a free, global platform that helps people
          discover, learn, and build careers in the sustainability sector.
        </p>

        <div className="grid sm:grid-cols-2 gap-5 mb-10">
          <Card><CardContent className="p-5">
            <h2 className="font-semibold mb-2">Discover</h2>
            <p className="text-sm text-muted-foreground">Take a free assessment to find sustainability career paths that fit you.</p>
          </CardContent></Card>
          <Card><CardContent className="p-5">
            <h2 className="font-semibold mb-2">Learn</h2>
            <p className="text-sm text-muted-foreground">Explore detailed roadmaps, skills, certifications, and curated resources.</p>
          </CardContent></Card>
          <Card><CardContent className="p-5">
            <h2 className="font-semibold mb-2">Build</h2>
            <p className="text-sm text-muted-foreground">Follow a 90-day plan with practical portfolio projects.</p>
          </CardContent></Card>
          <Card><CardContent className="p-5">
            <h2 className="font-semibold mb-2">Advance</h2>
            <p className="text-sm text-muted-foreground">Track progress in your dashboard and grow into the role you want.</p>
          </CardContent></Card>
        </div>

        <div className="flex gap-3 flex-wrap">
          <Link to="/assessment"><Button variant="hero">Take the Assessment</Button></Link>
          <Link to="/careers"><Button variant="outline">Explore Career Paths</Button></Link>
        </div>
      </section>
    </>
  );
}
