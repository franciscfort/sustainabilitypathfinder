import { useState } from "react";
import { LandingPage } from "@/components/LandingPage";
import { AssessmentPage } from "@/components/AssessmentPage";
import { ResultsPage } from "@/components/ResultsPage";
import { AssessmentAnswers, AssessmentResult, calculateCareerMatches } from "@/lib/careerMatcher";

type AppState = "landing" | "assessment" | "results";

const Index = () => {
  const [appState, setAppState] = useState<AppState>("landing");
  const [results, setResults] = useState<AssessmentResult | null>(null);

  const handleStartAssessment = () => {
    setAppState("assessment");
  };

  const handleAssessmentComplete = (answers: AssessmentAnswers) => {
    const calculatedResults = calculateCareerMatches(answers);
    setResults(calculatedResults);
    setAppState("results");
  };

  const handleRestart = () => {
    setResults(null);
    setAppState("landing");
  };

  const handleBackToLanding = () => {
    setAppState("landing");
  };

  return (
    <>
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
        />
      )}
    </>
  );
};

export default Index;
