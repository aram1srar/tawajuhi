import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { questions } from "@/data/questions";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const TestPage: React.FC = () => {
  const { path } = useParams<{ path: string }>();
  const { locale } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const pathQuestions = useMemo(() => questions[path || ""] || [], [path]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);
  const [startTime] = useState(() => Date.now());

  const current = pathQuestions[currentIndex];
  const progress = (currentIndex / pathQuestions.length) * 100;

  const pathNames: Record<string, { ar: string; en: string }> = {
    health: { ar: "العلوم الصحية", en: "Health Sciences" },
    cs: { ar: "علوم الحاسب", en: "Computer Science" },
    business: { ar: "إدارة الأعمال", en: "Business Admin" },
    shariah: { ar: "الشريعة", en: "Shari'ah" },
  };

  const handleSelect = (optionIndex: number) => {
    if (answers[current.id] !== undefined) return;
    setAnswers((prev) => ({ ...prev, [current.id]: optionIndex }));
  };

  const handleNext = async () => {
    if (currentIndex < pathQuestions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      let theoryCorrect = 0, interestCorrect = 0, theoryTotal = 0, interestTotal = 0;
      pathQuestions.forEach((q) => {
        if (q.type === "theory") {
          theoryTotal++;
          if (answers[q.id] === q.correctIndex) theoryCorrect++;
        } else {
          interestTotal++;
          if (answers[q.id] === q.correctIndex) interestCorrect++;
        }
      });

      const theoryScore = theoryTotal > 0 ? Math.round((theoryCorrect / theoryTotal) * 100) : 0;
      const simScore = interestTotal > 0 ? Math.round((interestCorrect / interestTotal) * 100) : 0;
      const totalScore = Math.round(((theoryCorrect + interestCorrect) / pathQuestions.length) * 100);
      const durationSeconds = Math.round((Date.now() - startTime) / 1000);

      if (user) {
        setSaving(true);
        await supabase.from("test_results").insert({
          user_id: user.id,
          career_path: path || "",
          theory_score: theoryScore,
          simulation_score: simScore,
          total_score: totalScore,
          answers: answers as any,
          recommended_paths: totalScore >= 60 ? [path || ""] : [],
          duration_seconds: durationSeconds,
        });
        setSaving(false);
      }

      navigate(`/results/${path}`, {
        state: { theoryScore, simScore, totalScore, answers, questions: pathQuestions },
      });
    }
  };

  if (!current) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">{locale === "ar" ? "لا توجد أسئلة" : "No questions found"}</p>
      </div>
    );
  }

  const answered = answers[current.id] !== undefined;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => navigate("/dashboard")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              {locale === "ar" ? "رجوع" : "Back"}
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">
                {currentIndex + 1}/{pathQuestions.length}
              </span>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {pathNames[path || ""]?.[locale] || path}
          </p>
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-8 leading-relaxed">
              {current.question[locale]}
            </h2>

            <div className="space-y-3">
              {current.options.map((option, idx) => {
                let optionStyle = "border-border bg-card hover:border-primary/50";
                if (answered && answers[current.id] === idx) {
                  optionStyle = "border-primary bg-primary/10";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    disabled={answered}
                    className={`w-full text-start p-4 rounded-xl border-2 transition-all ${optionStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-foreground font-medium">{option[locale]}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {answered && (
              <div className="mt-8 flex justify-end">
                <Button onClick={handleNext} className="rounded-full px-8" disabled={saving}>
                  {currentIndex < pathQuestions.length - 1
                    ? (locale === "ar" ? "التالي" : "Next")
                    : (locale === "ar" ? "عرض النتائج" : "View Results")}
                  <ArrowRight className="w-4 h-4 ms-2" />
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TestPage;
