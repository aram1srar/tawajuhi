import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, BookOpen, Monitor, RotateCcw, Home } from "lucide-react";
import type { Question } from "@/data/questions";

const ResultsPage: React.FC = () => {
  const { path } = useParams<{ path: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { locale } = useLanguage();

  const state = location.state as {
    theoryScore: number;
    simScore: number;
    totalScore: number;
    answers: Record<string, number>;
    questions: Question[];
  } | null;

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">{locale === "ar" ? "لا توجد نتائج" : "No results found"}</p>
          <Button onClick={() => navigate("/dashboard")} variant="outline" className="rounded-full">
            {locale === "ar" ? "العودة للرئيسية" : "Back to Dashboard"}
          </Button>
        </div>
      </div>
    );
  }

  const { theoryScore, simScore, totalScore, answers, questions } = state;

  const pathNames: Record<string, { ar: string; en: string }> = {
    health: { ar: "العلوم الصحية والحياتية", en: "Health & Life Sciences" },
    cs: { ar: "علوم الحاسب والهندسة", en: "Computer Science & Engineering" },
    business: { ar: "إدارة الأعمال", en: "Business Administration" },
    shariah: { ar: "الشريعة والدراسات الإسلامية", en: "Shari'ah & Islamic Studies" },
  };

  const getGrade = (score: number) => {
    if (score >= 80) return { label: locale === "ar" ? "ممتاز" : "Excellent", color: "text-green-600" };
    if (score >= 60) return { label: locale === "ar" ? "جيد" : "Good", color: "text-accent" };
    return { label: locale === "ar" ? "يحتاج تحسين" : "Needs Improvement", color: "text-destructive" };
  };

  const grade = getGrade(totalScore);
  const wrongAnswers = questions.filter((q) => answers[q.id] !== q.correctIndex);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <button onClick={() => navigate("/dashboard")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8">
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
            {pathNames[path || ""]?.[locale]}
          </h1>
          <div className="my-6">
            <div className={`text-6xl md:text-7xl font-bold ${grade.color}`}>
              {totalScore}%
            </div>
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
              <p className="text-xs text-muted-foreground">{locale === "ar" ? "محاكاة" : "Simulation"}</p>
            </div>
          </div>
        </motion.div>

        {/* Feedback */}
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
                ? "أداؤك ممتاز في هذا المسار! يبدو أن لديك مهارات قوية تتوافق مع متطلبات هذا التخصص. ننصحك بالاستمرار في التعمق والتطوير."
                : "Excellent performance! You have strong skills aligned with this field. We recommend continuing to develop and deepen your knowledge.")
              : totalScore >= 60
              ? (locale === "ar"
                ? "أداؤك جيد مع وجود بعض المجالات التي يمكن تحسينها. راجع الأسئلة التي أخطأت فيها أدناه وحاول فهم المفاهيم بشكل أعمق."
                : "Good performance with some areas for improvement. Review the questions you missed below and try to understand the concepts more deeply.")
              : (locale === "ar"
                ? "تحتاج لمزيد من التحضير في هذا المسار. ننصحك بمراجعة المفاهيم الأساسية والتدرب على المزيد من الأسئلة. لا تقلق، كل بداية صعبة!"
                : "You need more preparation in this path. Review the basic concepts and practice more. Don't worry, every beginning is challenging!")}
          </p>
        </motion.div>

        {/* Wrong Answers Review */}
        {wrongAnswers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-2xl border border-border shadow-card p-6 mb-8"
          >
            <h2 className="text-lg font-bold text-foreground mb-4">
              {locale === "ar" ? "📝 مراجعة الأخطاء" : "📝 Mistake Review"}
            </h2>
            <div className="space-y-4">
              {wrongAnswers.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-xl bg-muted/50 border border-border">
                  <p className="text-sm font-medium text-foreground mb-2">
                    {idx + 1}. {q.question[locale]}
                  </p>
                  <p className="text-xs text-destructive mb-1">
                    {locale === "ar" ? "إجابتك:" : "Your answer:"} {q.options[answers[q.id]]?.[locale]}
                  </p>
                  <p className="text-xs text-green-600 mb-2">
                    {locale === "ar" ? "الصحيح:" : "Correct:"} {q.options[q.correctIndex][locale]}
                  </p>
                  <p className="text-xs text-muted-foreground">{q.explanation[locale]}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => navigate(`/test/${path}`)} variant="outline" className="rounded-full">
            <RotateCcw className="w-4 h-4 me-2" />
            {locale === "ar" ? "إعادة الاختبار" : "Retake Test"}
          </Button>
          <Button onClick={() => navigate("/dashboard")} className="rounded-full">
            <Home className="w-4 h-4 me-2" />
            {locale === "ar" ? "اختيار مسار آخر" : "Choose Another Path"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
