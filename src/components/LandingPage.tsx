import { Leaf, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SocialProof } from "@/components/SocialProof";

interface LandingPageProps {
  onStart: () => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          {/* Logo/Icon */}
          <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-hero shadow-glow">
            <Leaf className="w-10 h-10 text-primary-foreground" />
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-balance">
            Sustainability Career
            <span className="block text-primary">Pathfinder</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-balance leading-relaxed">Discover your ideal career path in the sustainability sector. Take our assessment to find roles that match your personality, passions, and skills plus the high-demand skills to learn next.



          </p>

          {/* CTA Button */}
          <Button
            variant="hero"
            size="xl"
            onClick={onStart}
            className="group">

            Start Assessment
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Button>

          {/* Trust indicators */}
          <p className="mt-8 text-sm text-muted-foreground">
            ✓ Takes 3-5 minutes &nbsp;•&nbsp; ✓ Personalized results &nbsp;•&nbsp; ✓ Free to use
          </p>
        </div>
      </main>

      {/* Features Section */}
      <section className="px-4 py-16 gradient-soft">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon="🎯"
              title="Career Matching"
              description="Get matched with 1-2 sustainability career paths based on your unique profile" />

            <FeatureCard
              icon="📈"
              title="Skill Recommendations"
              description="Discover 2-3 high-demand skills you can learn in 3-6 months" />

            <FeatureCard
              icon="🗺️"
              title="Clear Roadmap"
              description="Understand why each recommendation fits you and what to do next" />

          </div>
        </div>
      </section>

      {/* Social Proof */}
      <SocialProof />

      {/* Footer */}
      <footer className="px-4 py-6 text-center text-sm text-muted-foreground border-t">
        <p>Helping you find your path in the sustainability sector</p>
      </footer>
    </div>);

}

function FeatureCard({
  icon,
  title,
  description




}: {icon: string;title: string;description: string;}) {
  return (
    <div className="bg-card rounded-xl p-6 shadow-card text-center animate-slide-up">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>);

}