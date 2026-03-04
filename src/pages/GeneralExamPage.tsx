import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { getGeneralExamQuestions, Question } from "@/data/questions";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

const GeneralExamPage: React.FC = () => {
  const { locale } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const examQuestions = useMemo(() => getGeneralExamQuestions(40), []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [saving, setSaving] = useState(false);
  const [startTime] = useState(() => Date.now());

  const current = examQuestions[currentIndex];
  const progress = ((currentIndex + (showExplanation ? 1 : 0)) / examQuestions.length) * 100;

  const handleSelect = (optionIndex: number) => {
    if (showExplanation) return;
    setSelectedOption(optionIndex);
    setAnswers((prev) => ({ ...prev, [current.id]: optionIndex }));
    setShowExplanation(true);
  };

  const handleNext = async () => {
    if (currentIndex < examQuestions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      // Calculate scores per path
      const pathScores: Record<string, { correct: number; total: number }> = {};
      examQuestions.forEach((q) => {
        if (!pathScores[q.path]) pathScores[q.path] = { correct: 0, total: 0 };
        pathScores[q.path].total++;
        if (answers[q.id] === q.correctIndex) pathScores[q.path].correct++;
      });

      const totalCorrect = Object.values(pathScores).reduce((s, p) => s + p.correct, 0);
      const totalScore = Math.round((totalCorrect / examQuestions.length) * 100);

      // Find best path
      let bestPath = "";
      let bestPct = 0;
      Object.entries(pathScores).forEach(([path, { correct, total }]) => {
        const pct = total > 0 ? correct / total : 0;
        if (pct > bestPct) { bestPct = pct; bestPath = path; }
      });

      const durationSeconds = Math.round((Date.now() - startTime) / 1000);

      if (user) {
        setSaving(true);
        await supabase.from("test_results").insert({
          user_id: user.id,
          career_path: "general",
          theory_score: totalScore,
          simulation_score: 0,
          total_score: totalScore,
          answers: answers as any,
          recommended_paths: bestPath ? [bestPath] : [],
          duration_seconds: durationSeconds,
          feedback: locale === "ar"
            ? `أفضل مسار لك: ${bestPath}`
            : `Best path for you: ${bestPath}`,
        });
        setSaving(false);
      }

      navigate(`/results/general`, {
        state: {
          totalScore,
          pathScores,
          bestPath,
          answers,
          questions: examQuestions,
        },
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

  const isCorrect = selectedOption === current.correctIndex;

  const pathLabels: Record<string, { ar: string; en: string }> = {
    cs: { ar: "علوم الحاسب", en: "Computer Science" },
    health: { ar: "الصحة والحياة", en: "Health & Life" },
    business: { ar: "إدارة الأعمال", en: "Business" },
    shariah: { ar: "الشريعة", en: "Shari'ah" },
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => navigate("/")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              {locale === "ar" ? "رجوع" : "Back"}
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                {pathLabels[current.path]?.[locale] || current.path}
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                {current.type === "theory"
                  ? (locale === "ar" ? "نظري" : "Theory")
                  : (locale === "ar" ? "ميول" : "Interest")}
              </span>
              <span className="text-sm font-medium text-foreground">
                {currentIndex + 1}/{examQuestions.length}
              </span>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {locale === "ar" ? "الاختبار العام - جميع المسارات" : "General Exam - All Paths"}
          </p>
        </div>
      </div>

      {/* Question */}
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
                if (showExplanation) {
                  if (idx === current.correctIndex) {
                    optionStyle = "border-green-500 bg-green-50 dark:bg-green-900/20";
                  } else if (idx === selectedOption && !isCorrect) {
                    optionStyle = "border-destructive bg-red-50 dark:bg-red-900/20";
                  } else {
                    optionStyle = "border-border bg-card opacity-50";
                  }
                } else if (selectedOption === idx) {
                  optionStyle = "border-primary bg-primary/5";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    disabled={showExplanation}
                    className={`w-full text-start p-4 rounded-xl border-2 transition-all ${optionStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-foreground font-medium">{option[locale]}</span>
                      {showExplanation && idx === current.correctIndex && (
                        <CheckCircle className="w-5 h-5 text-green-500 ms-auto shrink-0" />
                      )}
                      {showExplanation && idx === selectedOption && !isCorrect && (
                        <XCircle className="w-5 h-5 text-destructive ms-auto shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-6 p-5 rounded-xl border ${isCorrect ? "border-green-200 bg-green-50 dark:bg-green-900/10" : "border-red-200 bg-red-50 dark:bg-red-900/10"}`}
              >
                <p className={`text-sm font-medium mb-1 ${isCorrect ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>
                  {isCorrect ? (locale === "ar" ? "✅ إجابة صحيحة!" : "✅ Correct!") : (locale === "ar" ? "❌ إجابة خاطئة" : "❌ Incorrect")}
                </p>
                <p className="text-sm text-muted-foreground">{current.explanation[locale]}</p>
              </motion.div>
            )}

            {showExplanation && (
              <div className="mt-8 flex justify-end">
                <Button onClick={handleNext} className="rounded-full px-8" disabled={saving}>
                  {currentIndex < examQuestions.length - 1
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

export default GeneralExamPage;
