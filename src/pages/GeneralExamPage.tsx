import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { getGeneralExamQuestions, getOpenEndedQuestions, Question } from "@/data/questions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpen, Clock, Sparkles, Loader2 } from "lucide-react";
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
        <p className="text-muted-foreground mb-6 leading-relaxed">
          {locale === "ar"
            ? "40 سؤال من جميع المسارات المهنية. أجب بصدق لنحدد المسار الأنسب لك."
            : "40 questions across all career paths. Answer honestly so we can find the best path for you."}
        </p>

        {/* Disclaimer note */}
        <div className="bg-muted/50 border border-border rounded-xl p-4 mb-6 text-start">
          <p className="text-sm text-foreground leading-relaxed" dir="rtl">
            تذكر أن نتيجة هذا الاختبار ليست حتمية لمستقبلك، بل هي مجرد محطة لقياس مجهودك؛ لذا استعن بالله، وثق بقدراتك، ونرجو منك الصدق والأمانة في الإجابة، فقيمتك الحقيقية تكمن في نزاهتك قبل درجتك.. فالك التوفيق!
          </p>
        </div>

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
  // Get 38 MCQ questions + we'll add 2 open-ended at the end via AI
  const baseQuestions = useMemo(() => getGeneralExamQuestions(38), []);
  const allOpenEnded = useMemo(() => getOpenEndedQuestions(), []);
  
  const [examQuestions, setExamQuestions] = useState<Question[]>(baseQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [openAnswers, setOpenAnswers] = useState<Record<string, string>>({});
  const [questionTimestamps, setQuestionTimestamps] = useState<Record<string, number>>({});
  const [questionStartTime, setQuestionStartTime] = useState(() => Date.now());
  const [saving, setSaving] = useState(false);
  const [startTime] = useState(() => Date.now());
  const [aiQuestionsLoaded, setAiQuestionsLoaded] = useState(false);
  const [loadingAiQuestions, setLoadingAiQuestions] = useState(false);

  if (!started) return <ExamIntro onStart={() => { setStarted(true); setQuestionStartTime(Date.now()); }} />;

  const current = examQuestions[currentIndex];
  const progress = ((currentIndex) / examQuestions.length) * 100;
  const isOpenEnded = current?.type === "open";

  const handleSelect = (optionIndex: number) => {
    const timeTaken = Math.round((Date.now() - questionStartTime) / 1000);
    setAnswers((prev) => ({ ...prev, [current.id]: optionIndex }));
    setQuestionTimestamps((prev) => ({ ...prev, [current.id]: timeTaken }));
  };

  const handleOpenAnswer = (text: string) => {
    setOpenAnswers((prev) => ({ ...prev, [current.id]: text }));
  };

  // When we reach question 38 (index 37), trigger AI to select the last 2 open-ended questions
  const loadAiQuestions = async () => {
    if (aiQuestionsLoaded || loadingAiQuestions) return;
    setLoadingAiQuestions(true);
    try {
      // Build summary of answers so far
      const pathScores: Record<string, { correct: number; total: number }> = {};
      examQuestions.forEach((q) => {
        if (!pathScores[q.path]) pathScores[q.path] = { correct: 0, total: 0 };
        if (answers[q.id] !== undefined) {
          pathScores[q.path].total++;
          if (answers[q.id] === q.correctIndex) pathScores[q.path].correct++;
        }
      });

      // Find weakest path to give relevant open-ended questions
      let weakestPath = "cs";
      let weakestPct = Infinity;
      let strongestPath = "cs";
      let strongestPct = -1;
      Object.entries(pathScores).forEach(([path, { correct, total }]) => {
        const pct = total > 0 ? correct / total : 0;
        if (pct < weakestPct) { weakestPct = pct; weakestPath = path; }
        if (pct > strongestPct) { strongestPct = pct; strongestPath = path; }
      });

      // Pick one open-ended from weakest path and one from strongest
      const weakOpen = allOpenEnded.filter(q => q.path === weakestPath);
      const strongOpen = allOpenEnded.filter(q => q.path === strongestPath && q.path !== weakestPath);
      const fallbackOpen = allOpenEnded.filter(q => q.path !== weakestPath);

      const selectedOpen: Question[] = [];
      if (weakOpen.length > 0) {
        selectedOpen.push(weakOpen[Math.floor(Math.random() * weakOpen.length)]);
      }
      const pool2 = strongOpen.length > 0 ? strongOpen : fallbackOpen;
      if (pool2.length > 0) {
        const pick = pool2[Math.floor(Math.random() * pool2.length)];
        if (!selectedOpen.find(q => q.id === pick.id)) {
          selectedOpen.push(pick);
        } else if (pool2.length > 1) {
          const other = pool2.find(q => q.id !== pick.id);
          if (other) selectedOpen.push(other);
        }
      }

      // Ensure we have exactly 2
      if (selectedOpen.length < 2) {
        const remaining = allOpenEnded.filter(q => !selectedOpen.find(s => s.id === q.id));
        while (selectedOpen.length < 2 && remaining.length > 0) {
          selectedOpen.push(remaining.pop()!);
        }
      }

      setExamQuestions([...examQuestions, ...selectedOpen.slice(0, 2)]);
      setAiQuestionsLoaded(true);
    } catch (err) {
      console.error("Error loading AI questions:", err);
      // Fallback: pick 2 random open-ended questions
      const fallback = [...allOpenEnded].sort(() => Math.random() - 0.5).slice(0, 2);
      setExamQuestions([...examQuestions, ...fallback]);
      setAiQuestionsLoaded(true);
    } finally {
      setLoadingAiQuestions(false);
    }
  };

  const handleNext = async () => {
    // If we're at question 38 (the last MCQ), load AI open-ended questions
    if (currentIndex === baseQuestions.length - 1 && !aiQuestionsLoaded) {
      await loadAiQuestions();
      setCurrentIndex((i) => i + 1);
      setQuestionStartTime(Date.now());
      return;
    }

    if (currentIndex < examQuestions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setQuestionStartTime(Date.now());
    } else {
      // Calculate scores per path
      const pathScores: Record<string, { correct: number; total: number }> = {};
      examQuestions.forEach((q) => {
        if (q.type === "open") return; // Don't count open-ended in scores
        if (!pathScores[q.path]) pathScores[q.path] = { correct: 0, total: 0 };
        pathScores[q.path].total++;
        if (answers[q.id] === q.correctIndex) pathScores[q.path].correct++;
      });

      const totalCorrect = Object.values(pathScores).reduce((s, p) => s + p.correct, 0);
      const totalQuestions = Object.values(pathScores).reduce((s, p) => s + p.total, 0);
      const totalScore = Math.round((totalCorrect / totalQuestions) * 100);
      const durationSeconds = Math.round((Date.now() - startTime) / 1000);

      let bestPath = "";
      let bestPct = 0;
      Object.entries(pathScores).forEach(([path, { correct, total }]) => {
        const pct = total > 0 ? correct / total : 0;
        if (pct > bestPct) { bestPct = pct; bestPath = path; }
      });

      if (user) {
        setSaving(true);
        await supabase.from("test_results").insert({
          user_id: user.id,
          career_path: "general",
          theory_score: totalScore,
          simulation_score: 0,
          total_score: totalScore,
          answers: { ...answers, openAnswers } as any,
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
          openAnswers,
          questions: examQuestions,
          questionTimestamps,
          durationSeconds,
        },
      });
    }
  };

  if (!current) {
    if (loadingAiQuestions) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>{locale === "ar" ? "جاري تحضير الأسئلة المفتوحة..." : "Preparing open-ended questions..."}</span>
          </div>
        </div>
      );
    }
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

  const typeLabels: Record<string, { ar: string; en: string }> = {
    theory: { ar: "نظري", en: "Theory" },
    interest: { ar: "تفضيل", en: "Preference" },
    practical: { ar: "عملي", en: "Practical" },
    open: { ar: "مفتوح", en: "Open-ended" },
  };

  const answered = isOpenEnded 
    ? (openAnswers[current.id] || "").trim().length > 10
    : answers[current.id] !== undefined;

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
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                {typeLabels[current.type]?.[locale] || current.type}
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
            {/* Job context if available */}
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
              /* Open-ended question - textarea */
              <div className="space-y-3">
                <Textarea
                  value={openAnswers[current.id] || ""}
                  onChange={(e) => handleOpenAnswer(e.target.value)}
                  placeholder={locale === "ar" ? "اكتب إجابتك هنا..." : "Write your answer here..."}
                  className="min-h-[150px] text-base leading-relaxed"
                  dir={locale === "ar" ? "rtl" : "ltr"}
                />
                <p className="text-xs text-muted-foreground">
                  {locale === "ar" ? "اكتب 10 أحرف على الأقل للمتابعة" : "Write at least 10 characters to continue"}
                </p>
              </div>
            ) : (
              /* Multiple choice */
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
                <Button onClick={handleNext} className="rounded-full px-8" disabled={saving || loadingAiQuestions}>
                  {loadingAiQuestions ? (
                    <Loader2 className="w-4 h-4 animate-spin me-2" />
                  ) : null}
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
