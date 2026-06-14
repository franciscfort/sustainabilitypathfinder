import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { personalityLabels, passionLabels, skillLabels } from "@/data/careerPaths";
import {
  AssessmentAnswers,
  Gender,
  CareerStage,
  ExperienceLevel,
  CurrentGoal,
  careerStageLabels,
  experienceLevelLabels,
  currentGoalLabels,
} from "@/lib/careerMatcher";
import { cn } from "@/lib/utils";

interface AssessmentPageProps {
  onComplete: (answers: AssessmentAnswers) => void;
  onBack: () => void;
}

type Section =
  | "gender"
  | "careerStage"
  | "experienceLevel"
  | "currentGoal"
  | "personality"
  | "passions"
  | "skills";

const sections: { id: Section; title: string; subtitle: string }[] = [
  { id: "gender", title: "About You", subtitle: "How do you identify? This helps us tailor your experience." },
  { id: "careerStage", title: "Your Career Stage", subtitle: "Which stage best describes where you are in your sustainability journey?" },
  { id: "experienceLevel", title: "Experience Level", subtitle: "How would you rate your current sustainability knowledge and experience?" },
  { id: "currentGoal", title: "Your Current Goal", subtitle: "What is your primary goal right now?" },
  { id: "personality", title: "Work Style & Personality", subtitle: "Rate how much each statement describes you" },
  { id: "passions", title: "Sustainability Interests", subtitle: "Select all areas that excite you" },
  { id: "skills", title: "Current Skills", subtitle: "Select skills you already have" },
];

const genderOptions: { value: Gender; label: string }[] = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "non-binary", label: "Non-binary" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
];

export function AssessmentPage({ onComplete, onBack }: AssessmentPageProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [gender, setGender] = useState<Gender | undefined>(undefined);
  const [careerStage, setCareerStage] = useState<CareerStage | undefined>(undefined);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel | undefined>(undefined);
  const [currentGoal, setCurrentGoal] = useState<CurrentGoal | undefined>(undefined);
  const [personality, setPersonality] = useState<Record<string, number>>({});
  const [passions, setPassions] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);

  const section = sections[currentSection];
  const progress = ((currentSection + 1) / sections.length) * 100;

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection((prev) => prev + 1);
    } else {
      onComplete({
        gender,
        careerStage,
        experienceLevel,
        currentGoal,
        personality,
        passions,
        skills,
      });
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection((prev) => prev - 1);
    } else {
      onBack();
    }
  };

  const canProceed = () => {
    switch (section.id) {
      case "gender":
        return !!gender;
      case "careerStage":
        return !!careerStage;
      case "experienceLevel":
        return !!experienceLevel;
      case "currentGoal":
        return !!currentGoal;
      case "personality":
        return Object.keys(personality).length >= 3;
      case "passions":
        return passions.length >= 1;
      case "skills":
        return skills.length >= 1;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="sm" onClick={handlePrevious}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <span className="text-sm text-muted-foreground">
              Step {currentSection + 1} of {sections.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </header>

      <main className="flex-1 py-8 px-4">
        <div className="max-w-2xl mx-auto animate-fade-in" key={section.id}>
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{section.title}</h1>
            <p className="text-muted-foreground">{section.subtitle}</p>
          </div>

          {section.id === "gender" && (
            <SingleSelectSection
              options={genderOptions.map((o) => ({ value: o.value, label: o.label }))}
              value={gender}
              onChange={(v) => setGender(v as Gender)}
              ariaLabel="Gender"
            />
          )}

          {section.id === "careerStage" && (
            <SingleSelectSection
              options={Object.entries(careerStageLabels).map(([value, label]) => ({ value, label }))}
              value={careerStage}
              onChange={(v) => setCareerStage(v as CareerStage)}
              ariaLabel="Career stage"
            />
          )}

          {section.id === "experienceLevel" && (
            <SingleSelectSection
              options={Object.entries(experienceLevelLabels).map(([value, label]) => ({ value, label }))}
              value={experienceLevel}
              onChange={(v) => setExperienceLevel(v as ExperienceLevel)}
              ariaLabel="Experience level"
            />
          )}

          {section.id === "currentGoal" && (
            <SingleSelectSection
              options={Object.entries(currentGoalLabels).map(([value, label]) => ({ value, label }))}
              value={currentGoal}
              onChange={(v) => setCurrentGoal(v as CurrentGoal)}
              ariaLabel="Current goal"
            />
          )}

          {section.id === "personality" && (
            <PersonalitySection values={personality} onChange={setPersonality} />
          )}

          {section.id === "passions" && (
            <MultiSelectSection options={passionLabels} selected={passions} onChange={setPassions} />
          )}

          {section.id === "skills" && (
            <MultiSelectSection options={skillLabels} selected={skills} onChange={setSkills} />
          )}
        </div>
      </main>

      <footer className="border-t bg-card/80 backdrop-blur-sm sticky bottom-0">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Button
            variant="hero"
            size="lg"
            className="w-full"
            onClick={handleNext}
            disabled={!canProceed()}
          >
            {currentSection === sections.length - 1 ? (
              <>
                See My Results
                <Check className="w-5 h-5 ml-2" />
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>
      </footer>
    </div>
  );
}

function SingleSelectSection({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: { value: string; label: string }[];
  value: string | undefined;
  onChange: (value: string) => void;
  ariaLabel: string;
}) {
  return (
    <div className="grid gap-3" role="radiogroup" aria-label={ariaLabel}>
      {options.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(opt.value)}
            className={cn(
              "p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-center gap-3",
              isSelected
                ? "border-primary bg-primary/5 shadow-card"
                : "border-border hover:border-primary/30 hover:bg-muted/50"
            )}
          >
            <div
              className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                isSelected ? "bg-primary border-primary" : "border-muted-foreground/30"
              )}
            >
              {isSelected && <Check className="w-4 h-4 text-primary-foreground" />}
            </div>
            <span className={cn("font-medium", isSelected && "text-primary")}>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function PersonalitySection({
  values,
  onChange,
}: {
  values: Record<string, number>;
  onChange: (values: Record<string, number>) => void;
}) {
  const traits = Object.entries(personalityLabels);
  const handleChange = (trait: string, value: number) => {
    onChange({ ...values, [trait]: value });
  };

  return (
    <div className="space-y-6">
      {traits.map(([key, label]) => (
        <Card key={key} className="p-5 shadow-card">
          <p className="font-medium mb-4">{label}</p>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground w-16 text-center">Not at all</span>
            <div className="flex gap-2 flex-1 justify-center">
              {[1, 2, 3, 4, 5].map((score) => (
                <button
                  key={score}
                  onClick={() => handleChange(key, score)}
                  className={cn(
                    "w-10 h-10 md:w-12 md:h-12 rounded-full border-2 font-semibold transition-all duration-200",
                    values[key] === score
                      ? "bg-primary text-primary-foreground border-primary scale-110"
                      : "border-border hover:border-primary/50 hover:bg-muted text-muted-foreground"
                  )}
                >
                  {score}
                </button>
              ))}
            </div>
            <span className="text-xs text-muted-foreground w-16 text-center">Very much</span>
          </div>
        </Card>
      ))}
    </div>
  );
}

function MultiSelectSection({
  options,
  selected,
  onChange,
}: {
  options: Record<string, string>;
  selected: string[];
  onChange: (selected: string[]) => void;
}) {
  const toggleOption = (key: string) => {
    if (selected.includes(key)) {
      onChange(selected.filter((s) => s !== key));
    } else {
      onChange([...selected, key]);
    }
  };

  return (
    <div className="grid gap-3">
      {Object.entries(options).map(([key, label]) => {
        const isSelected = selected.includes(key);
        return (
          <button
            key={key}
            onClick={() => toggleOption(key)}
            className={cn(
              "p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-center gap-3",
              isSelected
                ? "border-primary bg-primary/5 shadow-card"
                : "border-border hover:border-primary/30 hover:bg-muted/50"
            )}
          >
            <div
              className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                isSelected ? "bg-primary border-primary" : "border-muted-foreground/30"
              )}
            >
              {isSelected && <Check className="w-4 h-4 text-primary-foreground" />}
            </div>
            <span className={cn("font-medium", isSelected && "text-primary")}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
