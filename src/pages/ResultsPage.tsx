import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, BookOpen, Monitor, RotateCcw, Home, Sparkles, Loader2 } from "lucide-react";
import type { Question } from "@/data/questions";

const ResultsPage: React.FC = () => {
  const { path } = useParams<{ path: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { locale } = useLanguage();
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const isGeneral = path === "general";

  // General exam state
  const generalState = location.state as {
    totalScore: number;
    pathScores: Record<string, { correct: number; total: number }>;
    bestPath: string;
    answers: Record<string, number>;
    questions: Question[];
    questionTimestamps?: Record<string, number>;
    durationSeconds?: number;
  } | null;

  // Path exam state
  const pathState = location.state as {
    theoryScore: number;
    simScore: number;
    totalScore: number;
    answers: Record<string, number>;
    questions: Question[];
  } | null;

  const state = isGeneral ? generalState : pathState;

  useEffect(() => {
    if (isGeneral && generalState) {
      setAiLoading(true);
      supabase.functions.invoke("analyze-exam", {
        body: {
          pathScores: generalState.pathScores,
          answers: generalState.answers,
          questions: generalState.questions,
          questionTimestamps: generalState.questionTimestamps || {},
          durationSeconds: generalState.durationSeconds || 0,
          locale,
        },
      }).then(({ data, error }) => {
        if (data?.analysis) setAiAnalysis(data.analysis);
        else if (error) console.error("AI analysis error:", error);
        setAiLoading(false);
      });
    }
  }, []);

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">{locale === "ar" ? "لا توجد نتائج" : "No results found"}</p>
          <Button onClick={() => navigate("/")} variant="outline" className="rounded-full">
            {locale === "ar" ? "العودة للرئيسية" : "Back to Home"}
          </Button>
        </div>
      </div>
    );
  }

  const pathNames: Record<string, { ar: string; en: string }> = {
    health: { ar: "العلوم الصحية والحياتية", en: "Health & Life Sciences" },
    cs: { ar: "علوم الحاسب والهندسة", en: "Computer Science & Engineering" },
    business: { ar: "إدارة الأعمال", en: "Business Administration" },
    shariah: { ar: "الشريعة والدراسات الإسلامية", en: "Shari'ah & Islamic Studies" },
    general: { ar: "الاختبار العام", en: "General Exam" },
  };

  if (isGeneral && generalState) {
    const { totalScore, pathScores, bestPath } = generalState;

    const getGrade = (score: number) => {
      if (score >= 80) return { label: locale === "ar" ? "ممتاز" : "Excellent", color: "text-green-600" };
      if (score >= 60) return { label: locale === "ar" ? "جيد" : "Good", color: "text-accent" };
      return { label: locale === "ar" ? "يحتاج تحسين" : "Needs Improvement", color: "text-destructive" };
    };
    const grade = getGrade(totalScore);

    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <button onClick={() => navigate("/")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="w-4 h-4" />
            {locale === "ar" ? "العودة" : "Back"}
          </button>

          {/* Score Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-3xl border border-border shadow-card p-8 md:p-12 text-center mb-8"
          >
            <Trophy className="w-12 h-12 text-accent mx-auto mb-4" />
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              {pathNames.general[locale]}
            </h1>
            <div className="my-6">
              <div className={`text-6xl md:text-7xl font-bold ${grade.color}`}>{totalScore}%</div>
              <p className={`text-lg font-medium mt-2 ${grade.color}`}>{grade.label}</p>
            </div>

            {/* Path Breakdown */}
            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto mt-6">
              {Object.entries(pathScores).map(([p, { correct, total }]) => (
                <div key={p} className={`rounded-xl p-3 ${p === bestPath ? "bg-primary/10 border border-primary/30" : "bg-muted"}`}>
                  <p className="text-sm font-medium text-foreground">{pathNames[p]?.[locale] || p}</p>
                  <p className="text-lg font-bold text-foreground">{Math.round((correct / total) * 100)}%</p>
                  <p className="text-xs text-muted-foreground">{correct}/{total}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Best Path */}
          {bestPath && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-8 text-center"
            >
              <Sparkles className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-1">
                {locale === "ar" ? "المسار الأنسب لك" : "Best Path For You"}
              </p>
              <p className="text-xl font-bold text-foreground">{pathNames[bestPath]?.[locale]}</p>
            </motion.div>
          )}

          {/* AI Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-2xl border border-border shadow-card p-6 mb-8"
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">
                {locale === "ar" ? "تحليل الذكاء الاصطناعي" : "AI Analysis"}
              </h2>
            </div>
            {aiLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground py-4">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">{locale === "ar" ? "جاري التحليل..." : "Analyzing your results..."}</span>
              </div>
            ) : aiAnalysis ? (
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{aiAnalysis}</p>
            ) : (
              <p className="text-muted-foreground text-sm">
                {locale === "ar" ? "لم نتمكن من تحليل النتائج. حاول مرة أخرى." : "Could not analyze results. Please try again."}
              </p>
            )}
          </motion.div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => navigate("/general-exam")} variant="outline" className="rounded-full">
              <RotateCcw className="w-4 h-4 me-2" />
              {locale === "ar" ? "إعادة الاختبار" : "Retake Exam"}
            </Button>
            <Button onClick={() => navigate("/")} className="rounded-full">
              <Home className="w-4 h-4 me-2" />
              {locale === "ar" ? "الصفحة الرئيسية" : "Home"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Path-specific results (no answers shown)
  const { theoryScore, simScore, totalScore } = pathState!;

  const getGrade = (score: number) => {
    if (score >= 80) return { label: locale === "ar" ? "ممتاز" : "Excellent", color: "text-green-600" };
    if (score >= 60) return { label: locale === "ar" ? "جيد" : "Good", color: "text-accent" };
    return { label: locale === "ar" ? "يحتاج تحسين" : "Needs Improvement", color: "text-destructive" };
  };
  const grade = getGrade(totalScore);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <button onClick={() => navigate("/")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4" />
          {locale === "ar" ? "العودة" : "Back"}
        </button>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card rounded-3xl border border-border shadow-card p-8 md:p-12 text-center mb-8"
        >
          <Trophy className="w-12 h-12 text-accent mx-auto mb-4" />
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {pathNames[path || ""]?.[locale]}
          </h1>
          <div className="my-6">
            <div className={`text-6xl md:text-7xl font-bold ${grade.color}`}>{totalScore}%</div>
            <p className={`text-lg font-medium mt-2 ${grade.color}`}>{grade.label}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            <div className="bg-muted rounded-xl p-4">
              <BookOpen className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{theoryScore}%</p>
              <p className="text-xs text-muted-foreground">{locale === "ar" ? "نظري" : "Theory"}</p>
            </div>
            <div className="bg-muted rounded-xl p-4">
              <Monitor className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{simScore}%</p>
              <p className="text-xs text-muted-foreground">{locale === "ar" ? "ميول" : "Interest"}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl border border-border shadow-card p-6 mb-8"
        >
          <h2 className="text-lg font-bold text-foreground mb-3">
            {locale === "ar" ? "💡 التوصيات" : "💡 Recommendations"}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {totalScore >= 80
              ? (locale === "ar"
                ? "أداؤك ممتاز في هذا المسار! يبدو أن لديك مهارات قوية تتوافق مع متطلبات هذا التخصص."
                : "Excellent performance! You have strong skills aligned with this field.")
              : totalScore >= 60
              ? (locale === "ar"
                ? "أداؤك جيد مع وجود بعض المجالات التي يمكن تحسينها."
                : "Good performance with some areas for improvement.")
              : (locale === "ar"
                ? "تحتاج لمزيد من التحضير في هذا المسار. لا تقلق، كل بداية صعبة!"
                : "You need more preparation in this path. Don't worry, every beginning is challenging!")}
          </p>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => navigate(`/test/${path}`)} variant="outline" className="rounded-full">
            <RotateCcw className="w-4 h-4 me-2" />
            {locale === "ar" ? "إعادة الاختبار" : "Retake Test"}
          </Button>
          <Button onClick={() => navigate("/")} className="rounded-full">
            <Home className="w-4 h-4 me-2" />
            {locale === "ar" ? "الصفحة الرئيسية" : "Home"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
