import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { AssessmentPage } from "@/components/AssessmentPage";
import { ResultsPage } from "@/components/ResultsPage";
import { AssessmentAnswers, AssessmentResult, calculateCareerMatches } from "@/lib/careerMatcher";
import { saveAssessment } from "@/lib/assessmentStorage";
import { toast } from "sonner";

export default function Assessment() {
  const [results, setResults] = useState<AssessmentResult | null>(null);
  const [shareId, setShareId] = useState<string | null>(null);
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleComplete = async (answers: AssessmentAnswers) => {
    const r = calculateCareerMatches(answers);
    setResults(r);
    const { id, shareId: sid, error } = await saveAssessment(answers, r);
    if (error) {
      toast.error("Couldn't save your results, but you can still view them.");
    } else {
      setShareId(sid);
      setAssessmentId(id);
      toast.success("Your results have been saved!");
    }
  };

  if (!results) {
    return (
      <>
        <Helmet>
          <title>Take the Sustainability Career Assessment</title>
          <meta name="description" content="Discover sustainability career paths that fit your personality, interests, and skills." />
        </Helmet>
        <AssessmentPage onComplete={handleComplete} onBack={() => navigate("/")} />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Your Sustainability Career Match Results</title>
        <meta name="description" content="Your personalized sustainability career paths and skills to learn next." />
      </Helmet>
      <ResultsPage
        results={results}
        onRestart={() => setResults(null)}
        shareId={shareId}
        assessmentId={assessmentId}
      />
    </>
  );
}
