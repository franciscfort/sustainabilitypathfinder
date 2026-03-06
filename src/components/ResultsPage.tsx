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
}

export function ResultsPage({ results, onRestart, shareId }: ResultsPageProps) {
  const { topCareers, recommendedSkills } = results;
  const [copied, setCopied] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const shareUrl = shareId ? `${window.location.origin}/results/${shareId}` : "";
  const shareText = `Check out my sustainability career matches: ${topCareers.map(m => m.career.title).join(", ")}!`;

  const handleShare = async () => {
    if (!shareId) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Share link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTwitterShare = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, "_blank");
  };

  const handleLinkedInShare = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, "_blank");
  };

  const handleInstagramShare = () => {
    // Instagram doesn't support URL sharing; copy link and notify user
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied! Paste it into your Instagram story or bio.");
  };

  const handleDownloadImage = useCallback(async () => {
    if (!resultsRef.current) return;
    try {
      const dataUrl = await toPng(resultsRef.current, { quality: 0.95, backgroundColor: "#f7f5f0" });
      const link = document.createElement("a");
      link.download = "career-results.png";
      link.href = dataUrl;
      link.click();
      toast.success("Image downloaded!");
    } catch {
      toast.error("Failed to generate image. Please try again.");
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
            {shareId && (
              <>
                <Button variant="default" size="lg" onClick={handleShare} className="group">
                  {copied ? <Check className="w-4 h-4 mr-2" /> : <Share2 className="w-4 h-4 mr-2" />}
                  {copied ? "Link Copied!" : "Copy Link"}
                </Button>
                <Button variant="outline" size="lg" onClick={handleTwitterShare} className="group">
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  Twitter
                </Button>
                <Button variant="outline" size="lg" onClick={handleLinkedInShare} className="group">
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  LinkedIn
                </Button>
                <Button variant="outline" size="lg" onClick={handleInstagramShare} className="group">
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  Instagram
                </Button>
              </>
            )}
            <Button variant="outline" size="lg" onClick={handleDownloadImage} className="group">
              <Download className="w-4 h-4 mr-2" />
              Download Image
            </Button>
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
