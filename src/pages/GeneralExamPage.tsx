import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { getGeneralExamQuestions, Question } from "@/data/questions";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpen, Clock, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const ExamIntro: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  const { locale } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg mx-auto px-6 text-center"
      >
        <div className="w-16 h-16 rounded-2xl gradient-hero flex items-center justify-center mx-auto mb-6">
          <BookOpen className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-3">
          {locale === "ar" ? "الاختبار العام" : "General Exam"}
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          {locale === "ar"
            ? "40 سؤال من جميع المسارات المهنية. أجب بصدق لنحدد المسار الأنسب لك."
            : "40 questions across all career paths. Answer honestly so we can find the best path for you."}
        </p>
        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground mb-8">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span>{locale === "ar" ? "40 سؤال" : "40 Questions"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{locale === "ar" ? "~15 دقيقة" : "~15 min"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>{locale === "ar" ? "تحليل ذكي" : "AI Analysis"}</span>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Button size="lg" className="rounded-full px-10 gradient-gold text-accent-foreground border-0" onClick={onStart}>
            {locale === "ar" ? "ابدأ الاختبار" : "Start Exam"}
          </Button>
          <Button variant="ghost" size="sm" className="rounded-full" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 me-1" />
            {locale === "ar" ? "رجوع" : "Back"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

const GeneralExamPage: React.FC = () => {
  const { locale } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [started, setStarted] = useState(false);
  const examQuestions = useMemo(() => getGeneralExamQuestions(40), []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [questionTimestamps, setQuestionTimestamps] = useState<Record<string, number>>({});
  const [questionStartTime, setQuestionStartTime] = useState(() => Date.now());
  const [saving, setSaving] = useState(false);
  const [startTime] = useState(() => Date.now());

  if (!started) return <ExamIntro onStart={() => { setStarted(true); setQuestionStartTime(Date.now()); }} />;

  const current = examQuestions[currentIndex];
  const progress = ((currentIndex) / examQuestions.length) * 100;

  const handleSelect = (optionIndex: number) => {
    if (answers[current.id] !== undefined) return;
    const timeTaken = Math.round((Date.now() - questionStartTime) / 1000);
    setAnswers((prev) => ({ ...prev, [current.id]: optionIndex }));
    setQuestionTimestamps((prev) => ({ ...prev, [current.id]: timeTaken }));
  };

  const handleNext = async () => {
    if (currentIndex < examQuestions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setQuestionStartTime(Date.now());
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
      const durationSeconds = Math.round((Date.now() - startTime) / 1000);

      // Find best path
      let bestPath = "";
      let bestPct = 0;
      Object.entries(pathScores).forEach(([path, { correct, total }]) => {
        const pct = total > 0 ? correct / total : 0;
        if (pct > bestPct) { bestPct = pct; bestPath = path; }
      });

      // Save to DB
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
          questionTimestamps,
          durationSeconds,
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

  const pathLabels: Record<string, { ar: string; en: string }> = {
    cs: { ar: "علوم الحاسب", en: "Computer Science" },
    health: { ar: "الصحة والحياة", en: "Health & Life" },
    business: { ar: "إدارة الأعمال", en: "Business" },
    shariah: { ar: "الشريعة", en: "Shari'ah" },
  };

  const answered = answers[current.id] !== undefined;

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
              <span className="text-sm font-medium text-foreground">
                {currentIndex + 1}/{examQuestions.length}
              </span>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
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
