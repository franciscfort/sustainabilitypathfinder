import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { LandingPage } from "@/components/LandingPage";
import { AssessmentPage } from "@/components/AssessmentPage";
import { ResultsPage } from "@/components/ResultsPage";
import { AssessmentAnswers, AssessmentResult, calculateCareerMatches } from "@/lib/careerMatcher";
import { saveAssessment } from "@/lib/assessmentStorage";
import { toast } from "sonner";

type AppState = "landing" | "assessment" | "results";

const Index = () => {
  const [appState, setAppState] = useState<AppState>("landing");
  const [results, setResults] = useState<AssessmentResult | null>(null);
  const [shareId, setShareId] = useState<string | null>(null);
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleStartAssessment = () => {
    setAppState("assessment");
  };

  const handleAssessmentComplete = async (answers: AssessmentAnswers) => {
    const calculatedResults = calculateCareerMatches(answers);
    setResults(calculatedResults);
    setAppState("results");

    // Save to database
    setIsSaving(true);
    const { id, shareId: sid, error } = await saveAssessment(answers, calculatedResults);
    setIsSaving(false);

    if (error) {
      console.error("Failed to save assessment:", error);
      toast.error("Couldn't save your results, but you can still view them!");
    } else {
      setShareId(sid);
      setAssessmentId(id);
      toast.success("Your results have been saved!");
    }
  };

  const handleRestart = () => {
    setResults(null);
    setShareId(null);
    setAssessmentId(null);
    setAppState("landing");
  };

  const handleBackToLanding = () => {
    setAppState("landing");
  };

  const titles: Record<AppState, string> = {
    landing: "Sustainability Career Pathfinder — find your path",
    assessment: "Take the Sustainability Career Assessment",
    results: "Your Sustainability Career Match Results",
  };
  const descriptions: Record<AppState, string> = {
    landing: "Take a free 3–5 minute assessment to discover sustainability career paths that fit your personality, interests, and skills.",
    assessment: "Answer questions about your personality, interests, and skills to get personalized sustainability career recommendations.",
    results: "Your personalized sustainability career paths and high-demand skills to learn next.",
  };

  return (
    <>
      <Helmet>
        <title>{titles[appState]}</title>
        <meta name="description" content={descriptions[appState]} />
        <link rel="canonical" href="https://sustainabilitypathfinder.lovable.app/" />
        <meta property="og:title" content={titles[appState]} />
        <meta property="og:description" content={descriptions[appState]} />
        <meta property="og:url" content="https://sustainabilitypathfinder.lovable.app/" />
      </Helmet>
      {appState === "landing" && (
        <LandingPage onStart={handleStartAssessment} />
      )}
      {appState === "assessment" && (
        <AssessmentPage 
          onComplete={handleAssessmentComplete}
          onBack={handleBackToLanding}
        />
      )}
      {appState === "results" && results && (
        <ResultsPage 
          results={results}
          onRestart={handleRestart}
          shareId={shareId}
          assessmentId={assessmentId}
        />
      )}
    </>
  );
};

export default Index;
