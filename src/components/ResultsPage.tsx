import { ArrowRight, RefreshCw, Target, Lightbulb, TrendingUp, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AssessmentResult } from "@/lib/careerMatcher";
import { cn } from "@/lib/utils";
import { useRef, useCallback } from "react";
import { toast } from "sonner";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { RatingDialog } from "@/components/RatingDialog";
import { EmailCaptureDialog } from "@/components/EmailCaptureDialog";

interface ResultsPageProps {
  results: AssessmentResult;
  onRestart: () => void;
  shareId?: string | null;
  assessmentId?: string | null;
}

export function ResultsPage({ results, onRestart, shareId, assessmentId }: ResultsPageProps) {
  const { topCareers, recommendedSkills } = results;
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = useCallback(async () => {
    if (!resultsRef.current) return;
    try {
      const dataUrl = await toPng(resultsRef.current, { quality: 0.95, backgroundColor: "#f7f5f0" });
      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve) => { img.onload = resolve; });

      const pxWidth = img.width;
      const pxHeight = img.height;
      const pdfWidth = 210; // A4 mm
      const pdfHeight = (pxHeight / pxWidth) * pdfWidth;

      const pdf = new jsPDF({ orientation: pdfHeight > pdfWidth ? "portrait" : "landscape", unit: "mm", format: [pdfWidth, pdfHeight] });
      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("career-results.pdf");
      toast.success("PDF downloaded!");
    } catch {
      toast.error("Failed to generate PDF. Please try again.");
    }
  }, []);

  return (
    <div ref={resultsRef} className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="gradient-hero text-primary-foreground py-12 px-4">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-foreground/20 mb-6">
            <Target className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Your Career Pathfinder Results
          </h1>
          <p className="text-primary-foreground/90 text-lg max-w-xl mx-auto">
            Based on your personality, interests, and skills, here are your best-fit sustainability career paths.
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        {/* Career Paths Section */}
        <section className="animate-slide-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Your Best-Fit Career Paths</h2>
          </div>

          <div className="grid gap-6">
            {topCareers.map((match, index) => (
              <CareerCard 
                key={match.career.id} 
                match={match} 
                rank={index + 1}
              />
            ))}
          </div>
        </section>

        {/* Skills Section */}
        <section className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-accent/20">
              <Lightbulb className="w-5 h-5 text-accent" />
            </div>
            <h2 className="text-2xl font-bold">High-Demand Skills to Learn Next</h2>
          </div>

          <div className="grid gap-4">
            {recommendedSkills.map((skill, index) => (
              <SkillCard 
                key={skill.skill} 
                skill={skill} 
                priority={index + 1}
              />
            ))}
          </div>
        </section>

        {/* Next Steps Section */}
        <section className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <Card className="gradient-soft border-0 shadow-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <CardTitle>Your Next Steps</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <NextStep
                number={1}
                title="Explore your top career path"
                description="Research job postings, connect with professionals in these roles, and understand day-to-day responsibilities."
              />
              <NextStep
                number={2}
                title="Start learning your first skill"
                description={`Begin with "${recommendedSkills[0]?.skillLabel || "your recommended skill"}" – look for online courses, workshops, or certification programs.`}
              />
              <NextStep
                number={3}
                title="Build your network"
                description="Join sustainability communities, attend events, and connect with professionals in your target career area."
              />
              <div className="pt-4 text-center text-sm text-muted-foreground">
                <p>🚀 Coming soon: Personalized learning roadmaps and course recommendations</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="text-center pt-8 pb-12 space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <EmailCaptureDialog
              onEmailSubmitted={handleDownloadPdf}
              assessmentId={assessmentId}
            />
            <RatingDialog />
          </div>
          <div>
            <Button variant="outline" size="lg" onClick={onRestart} className="group">
              <RefreshCw className="w-4 h-4 mr-2 transition-transform group-hover:rotate-180" />
              Retake Assessment
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}

function CareerCard({ 
  match, 
  rank 
}: { 
  match: { 
    career: { 
      id: string;
      title: string;
      description: string;
      typicalRoles: string[];
      icon: string;
    };
    score: number;
    matchReasons: string[];
  };
  rank: number;
}) {
  const { career, matchReasons } = match;
  
  return (
    <Card className={cn(
      "overflow-hidden shadow-card hover:shadow-card-hover transition-shadow",
      rank === 1 && "ring-2 ring-primary"
    )}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={cn(
            "text-4xl p-3 rounded-xl shrink-0",
            rank === 1 ? "bg-primary/10" : "bg-muted"
          )}>
            {career.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {rank === 1 && (
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary text-primary-foreground">
                  Best Match
                </span>
              )}
              {rank === 2 && (
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                  Strong Match
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold mb-2">{career.title}</h3>
            <p className="text-muted-foreground text-sm mb-4">{career.description}</p>
            
            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-2">Typical Roles:</h4>
              <div className="flex flex-wrap gap-2">
                {career.typicalRoles.slice(0, 4).map((role) => (
                  <span 
                    key={role}
                    className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>

            {matchReasons.length > 0 && (
              <div className="bg-muted/50 rounded-lg p-3">
                <h4 className="text-sm font-semibold mb-2 text-primary">Why this matches you:</h4>
                <ul className="space-y-1">
                  {matchReasons.map((reason, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <ArrowRight className="w-3 h-3 mt-1 text-primary shrink-0" />
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SkillCard({ 
  skill, 
  priority 
}: { 
  skill: { 
    skillLabel: string;
    reason: string;
  };
  priority: number;
}) {
  const priorityColors = {
    1: "bg-primary text-primary-foreground",
    2: "bg-accent text-accent-foreground",
    3: "bg-secondary text-secondary-foreground",
  };

  return (
    <Card className="shadow-card hover:shadow-card-hover transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-sm",
            priorityColors[priority as keyof typeof priorityColors] || "bg-muted"
          )}>
            {priority}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{skill.skillLabel}</h3>
            <p className="text-muted-foreground text-sm">{skill.reason}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function NextStep({ 
  number, 
  title, 
  description 
}: { 
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 font-semibold text-primary text-sm">
        {number}
      </div>
      <div>
        <h4 className="font-semibold mb-1">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
