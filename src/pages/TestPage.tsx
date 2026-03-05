import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { getPathwayExamQuestions, getOpenEndedQuestions, Question } from "@/data/questions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const TestPage: React.FC = () => {
  const { path } = useParams<{ path: string }>();
  const { locale } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Get 18 MCQ + 2 open-ended from this path
  const mcqQuestions = useMemo(() => getPathwayExamQuestions(path || "", 18), [path]);
  const openQuestions = useMemo(() => {
    const pool = getOpenEndedQuestions(path || "");
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 2);
  }, [path]);
  const pathQuestions = useMemo(() => [...mcqQuestions, ...openQuestions], [mcqQuestions, openQuestions]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [openAnswers, setOpenAnswers] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [startTime] = useState(() => Date.now());

  const current = pathQuestions[currentIndex];
  const progress = (currentIndex / pathQuestions.length) * 100;
  const isOpenEnded = current?.type === "open";

  const pathNames: Record<string, { ar: string; en: string }> = {
    health: { ar: "العلوم الصحية", en: "Health Sciences" },
    cs: { ar: "علوم الحاسب", en: "Computer Science" },
    business: { ar: "إدارة الأعمال", en: "Business Admin" },
    shariah: { ar: "الشريعة", en: "Shari'ah" },
  };

  const typeLabels: Record<string, { ar: string; en: string }> = {
    theory: { ar: "نظري", en: "Theory" },
    interest: { ar: "تفضيل", en: "Preference" },
    practical: { ar: "عملي", en: "Practical" },
    open: { ar: "مفتوح", en: "Open-ended" },
  };

  const handleSelect = (optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [current.id]: optionIndex }));
  };

  const handleNext = async () => {
    if (currentIndex < pathQuestions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      let theoryCorrect = 0, interestCorrect = 0, theoryTotal = 0, interestTotal = 0;
      pathQuestions.forEach((q) => {
        if (q.type === "open") return;
        if (q.type === "theory" || q.type === "practical") {
          theoryTotal++;
          if (answers[q.id] === q.correctIndex) theoryCorrect++;
        } else {
          interestTotal++;
          if (answers[q.id] === q.correctIndex) interestCorrect++;
        }
      });

      const theoryScore = theoryTotal > 0 ? Math.round((theoryCorrect / theoryTotal) * 100) : 0;
      const simScore = interestTotal > 0 ? Math.round((interestCorrect / interestTotal) * 100) : 0;
      const totalScore = Math.round(((theoryCorrect + interestCorrect) / (theoryTotal + interestTotal)) * 100);
      const durationSeconds = Math.round((Date.now() - startTime) / 1000);

      if (user) {
        setSaving(true);
        await supabase.from("test_results").insert({
          user_id: user.id,
          career_path: path || "",
          theory_score: theoryScore,
          simulation_score: simScore,
          total_score: totalScore,
          answers: { ...answers, openAnswers } as any,
          recommended_paths: totalScore >= 60 ? [path || ""] : [],
          duration_seconds: durationSeconds,
        });
        setSaving(false);
      }

      navigate(`/results/${path}`, {
        state: { theoryScore, simScore, totalScore, answers, openAnswers, questions: pathQuestions },
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

  const answered = isOpenEnded
    ? (openAnswers[current.id] || "").trim().length > 10
    : answers[current.id] !== undefined;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => navigate("/")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
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
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-2">
            <span>{pathNames[path || ""]?.[locale] || path}</span>
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
              {typeLabels[current?.type]?.[locale] || current?.type}
            </span>
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
            {/* Job context */}
            {current.jobContext && (
              <div className="bg-muted/50 border border-border rounded-xl p-4 mb-6">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {current.jobContext[locale]}
                </p>
              </div>
            )}

            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-8 leading-relaxed">
              {current.question[locale]}
            </h2>

            {isOpenEnded ? (
              <div className="space-y-3">
                <Textarea
                  value={openAnswers[current.id] || ""}
                  onChange={(e) => setOpenAnswers(prev => ({ ...prev, [current.id]: e.target.value }))}
                  placeholder={locale === "ar" ? "اكتب إجابتك هنا..." : "Write your answer here..."}
                  className="min-h-[150px] text-base leading-relaxed"
                  dir={locale === "ar" ? "rtl" : "ltr"}
                />
                <p className="text-xs text-muted-foreground">
                  {locale === "ar" ? "اكتب 10 أحرف على الأقل للمتابعة" : "Write at least 10 characters to continue"}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {current.options.map((option, idx) => {
                  let optionStyle = "border-border bg-card hover:border-primary/50";
                  if (answers[current.id] === idx) {
                    optionStyle = "border-primary bg-primary/10";
                  }
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(idx)}
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
            )}

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
