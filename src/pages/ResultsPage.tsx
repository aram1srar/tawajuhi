import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, BookOpen, Monitor, RotateCcw, Home, Sparkles, Loader2, Brain, Target, TrendingUp, Lightbulb, Zap } from "lucide-react";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import type { Question } from "@/data/questions";

interface StructuredAnalysis {
  recommendation: string;
  strengths: { area: string; description: string }[];
  improvements: { area: string; advice: string }[];
  thinkingStyle: string;
  simulationInsight: string;
  careerFit: { path: string; fitScore: number; reason: string }[];
}

interface OpenEndedAnalysis {
  detectedSkills: { skill: string; confidence: number; evidence: string }[];
  careerAffinity: { path: string; score: number; reasoning: string }[];
  writingQuality: { clarity: number; depth: number; creativity: number; problemSolving: number };
  overallInsight: string;
}

const pathNames: Record<string, { ar: string; en: string }> = {
  health: { ar: "العلوم الصحية والحياتية", en: "Health & Life Sciences" },
  cs: { ar: "علوم الحاسب والهندسة", en: "Computer Science & Engineering" },
  business: { ar: "إدارة الأعمال", en: "Business Administration" },
  shariah: { ar: "الشريعة والدراسات الإسلامية", en: "Shari'ah & Islamic Studies" },
  general: { ar: "الاختبار العام", en: "General Exam" },
};

const PATH_COLORS: Record<string, string> = {
  cs: "hsl(220, 70%, 50%)",
  health: "hsl(160, 50%, 40%)",
  business: "hsl(42, 90%, 55%)",
  shariah: "hsl(280, 40%, 45%)",
};

const ResultsPage: React.FC = () => {
  const { path } = useParams<{ path: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { locale } = useLanguage();
  const [aiAnalysis, setAiAnalysis] = useState<StructuredAnalysis | null>(null);
  const [aiText, setAiText] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const isGeneral = path === "general";

  const generalState = location.state as {
    totalScore: number;
    pathScores: Record<string, { correct: number; total: number }>;
    bestPath: string;
    answers: Record<string, number>;
    openAnswers?: Record<string, string>;
    questions: Question[];
    questionTimestamps?: Record<string, number>;
    durationSeconds?: number;
    openEndedAnalysis?: OpenEndedAnalysis;
  } | null;

  const pathState = location.state as {
    theoryScore: number;
    simScore: number;
    totalScore: number;
    answers: Record<string, number>;
    openAnswers?: Record<string, string>;
    questions: Question[];
    openEndedAnalysis?: OpenEndedAnalysis;
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
          openAnswers: generalState.openAnswers || {},
          openEndedAnalysis: generalState.openEndedAnalysis || null,
        },
      }).then(({ data, error }) => {
        if (data?.structured && data?.analysis) {
          setAiAnalysis(data.analysis);
        } else if (data?.analysis) {
          setAiText(typeof data.analysis === "string" ? data.analysis : JSON.stringify(data.analysis));
        }
        if (error) console.error("AI analysis error:", error);
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

  const getGrade = (score: number) => {
    if (score >= 80) return { label: locale === "ar" ? "ممتاز" : "Excellent", color: "text-green-600" };
    if (score >= 60) return { label: locale === "ar" ? "جيد" : "Good", color: "text-accent" };
    return { label: locale === "ar" ? "يحتاج تحسين" : "Needs Improvement", color: "text-destructive" };
  };

  // Open-ended analysis from submit-exam
  const openEndedAnalysis = (isGeneral ? generalState : pathState)?.openEndedAnalysis;

  // Render writing quality radar
  const writingRadarData = openEndedAnalysis?.writingQuality
    ? [
        { skill: locale === "ar" ? "الوضوح" : "Clarity", score: openEndedAnalysis.writingQuality.clarity, fullMark: 100 },
        { skill: locale === "ar" ? "العمق" : "Depth", score: openEndedAnalysis.writingQuality.depth, fullMark: 100 },
        { skill: locale === "ar" ? "الإبداع" : "Creativity", score: openEndedAnalysis.writingQuality.creativity, fullMark: 100 },
        { skill: locale === "ar" ? "حل المشكلات" : "Problem Solving", score: openEndedAnalysis.writingQuality.problemSolving, fullMark: 100 },
      ]
    : [];

  // Career fit bar data
  const careerFitData = aiAnalysis?.careerFit?.map(cf => ({
    name: pathNames[cf.path]?.[locale] || cf.path,
    score: cf.fitScore,
    path: cf.path,
  })) || [];

  if (isGeneral && generalState) {
    const { totalScore, pathScores, bestPath } = generalState;
    const grade = getGrade(totalScore);

    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <button onClick={() => navigate("/")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="w-4 h-4" />
            {locale === "ar" ? "العودة" : "Back"}
          </button>

          {/* Score Card */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-3xl border border-border shadow-card p-8 md:p-12 text-center mb-8"
          >
            <Trophy className="w-12 h-12 text-accent mx-auto mb-4" />
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{pathNames.general[locale]}</h1>
            <div className="my-6">
              <div className={`text-6xl md:text-7xl font-bold ${grade.color}`}>{totalScore}%</div>
              <p className={`text-lg font-medium mt-2 ${grade.color}`}>{grade.label}</p>
            </div>

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
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-8 text-center"
            >
              <Sparkles className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-1">{locale === "ar" ? "المسار الأنسب لك" : "Best Path For You"}</p>
              <p className="text-xl font-bold text-foreground">{pathNames[bestPath]?.[locale]}</p>
            </motion.div>
          )}

          {/* AI Structured Analysis */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-card rounded-2xl border border-border shadow-card p-6 mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">
                {locale === "ar" ? "التحليل الذكي الشامل" : "Comprehensive AI Analysis"}
              </h2>
            </div>

            {aiLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground py-8 justify-center">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{locale === "ar" ? "جاري التحليل الشامل..." : "Running comprehensive analysis..."}</span>
              </div>
            ) : aiAnalysis ? (
              <div className="space-y-6">
                {/* Recommendation */}
                <div className="bg-primary/5 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    {locale === "ar" ? "التوصية" : "Recommendation"}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{aiAnalysis.recommendation}</p>
                </div>

                {/* Career Fit Chart */}
                {careerFitData.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      {locale === "ar" ? "توافق المسارات المهنية" : "Career Path Compatibility"}
                    </h3>
                    <div className="w-full h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={careerFitData} layout="vertical" margin={{ left: 10, right: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                          <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11 }} />
                          <Tooltip formatter={(value: number) => [`${value}%`, locale === "ar" ? "التوافق" : "Fit"]} />
                          <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={20}>
                            {careerFitData.map((d, i) => (
                              <Cell key={i} fill={PATH_COLORS[d.path] || "hsl(var(--primary))"} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-2 mt-3">
                      {aiAnalysis.careerFit.map((cf, i) => (
                        <p key={i} className="text-xs text-muted-foreground">
                          <span className="font-medium text-foreground">{pathNames[cf.path]?.[locale]}:</span> {cf.reason}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Strengths */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    {locale === "ar" ? "نقاط القوة" : "Strengths"}
                  </h3>
                  <div className="grid gap-2">
                    {aiAnalysis.strengths.map((s, i) => (
                      <div key={i} className="flex gap-3 bg-muted/50 rounded-lg p-3">
                        <Zap className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{s.area}</p>
                          <p className="text-xs text-muted-foreground">{s.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Areas for Improvement */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-accent" />
                    {locale === "ar" ? "مجالات التطوير" : "Areas for Improvement"}
                  </h3>
                  <div className="grid gap-2">
                    {aiAnalysis.improvements.map((imp, i) => (
                      <div key={i} className="flex gap-3 bg-accent/5 rounded-lg p-3">
                        <Lightbulb className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{imp.area}</p>
                          <p className="text-xs text-muted-foreground">{imp.advice}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Thinking Style & Simulation Insight */}
                <div className="grid md:grid-cols-2 gap-4 pt-2">
                  <div className="bg-muted/50 rounded-xl p-4">
                    <h4 className="text-xs font-semibold text-muted-foreground mb-2">
                      {locale === "ar" ? "🧠 نمط التفكير" : "🧠 Thinking Style"}
                    </h4>
                    <p className="text-sm text-foreground leading-relaxed">{aiAnalysis.thinkingStyle}</p>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-4">
                    <h4 className="text-xs font-semibold text-muted-foreground mb-2">
                      {locale === "ar" ? "⚙️ أداء المحاكاة" : "⚙️ Simulation Performance"}
                    </h4>
                    <p className="text-sm text-foreground leading-relaxed">{aiAnalysis.simulationInsight}</p>
                  </div>
                </div>
              </div>
            ) : aiText ? (
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{aiText}</p>
            ) : (
              <p className="text-muted-foreground text-sm">
                {locale === "ar" ? "لم نتمكن من تحليل النتائج. حاول مرة أخرى." : "Could not analyze results. Please try again."}
              </p>
            )}
          </motion.div>

          {/* Open-Ended Answer Analysis */}
          {openEndedAnalysis && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="bg-card rounded-2xl border border-border shadow-card p-6 mb-8"
            >
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">
                  {locale === "ar" ? "تحليل الإجابات المفتوحة" : "Open-Ended Answer Analysis"}
                </h2>
              </div>

              <div className="space-y-6">
                {/* Writing Quality Radar */}
                {writingRadarData.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                      {locale === "ar" ? "جودة الكتابة والتفكير" : "Writing & Thinking Quality"}
                    </h3>
                    <div className="w-full h-[260px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={writingRadarData} cx="50%" cy="50%" outerRadius="70%">
                          <PolarGrid stroke="hsl(var(--border))" />
                          <PolarAngleAxis dataKey="skill" tick={{ fontSize: 12 }} />
                          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                          <Radar name="Score" dataKey="score" stroke="hsl(220, 70%, 50%)" fill="hsl(220, 70%, 50%)" fillOpacity={0.25} strokeWidth={2} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* Detected Skills */}
                {openEndedAnalysis.detectedSkills?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                      {locale === "ar" ? "المهارات المكتشفة" : "Detected Skills"}
                    </h3>
                    <div className="space-y-2">
                      {openEndedAnalysis.detectedSkills.map((s, i) => (
                        <div key={i}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-foreground">{s.skill}</span>
                            <span className="text-xs text-muted-foreground">{s.confidence}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${s.confidence}%` }}
                              transition={{ duration: 0.6, delay: i * 0.1 }}
                              className="h-full rounded-full bg-primary"
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{s.evidence}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Overall Insight */}
                {openEndedAnalysis.overallInsight && (
                  <div className="bg-primary/5 rounded-xl p-4">
                    <p className="text-sm text-foreground leading-relaxed">{openEndedAnalysis.overallInsight}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

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

  // Path-specific results
  const { theoryScore, simScore, totalScore } = pathState!;
  const grade = getGrade(totalScore);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <button onClick={() => navigate("/")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4" />
          {locale === "ar" ? "العودة" : "Back"}
        </button>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-card rounded-3xl border border-border shadow-card p-8 md:p-12 text-center mb-8"
        >
          <Trophy className="w-12 h-12 text-accent mx-auto mb-4" />
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{pathNames[path || ""]?.[locale]}</h1>
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

        {/* Open-ended analysis for path exams too */}
        {openEndedAnalysis && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-card rounded-2xl border border-border shadow-card p-6 mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">
                {locale === "ar" ? "تحليل الإجابات المفتوحة" : "Open-Ended Analysis"}
              </h2>
            </div>
            <div className="space-y-6">
              {writingRadarData.length > 0 && (
                <div className="w-full h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={writingRadarData} cx="50%" cy="50%" outerRadius="70%">
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis dataKey="skill" tick={{ fontSize: 12 }} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                      <Radar name="Score" dataKey="score" stroke="hsl(220, 70%, 50%)" fill="hsl(220, 70%, 50%)" fillOpacity={0.25} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {openEndedAnalysis.detectedSkills?.length > 0 && (
                <div className="space-y-2">
                  {openEndedAnalysis.detectedSkills.map((s, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-foreground">{s.skill}</span>
                        <span className="text-xs text-muted-foreground">{s.confidence}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${s.confidence}%` }}
                          transition={{ duration: 0.6, delay: i * 0.1 }}
                          className="h-full rounded-full bg-primary" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{s.evidence}</p>
                    </div>
                  ))}
                </div>
              )}

              {openEndedAnalysis.overallInsight && (
                <div className="bg-primary/5 rounded-xl p-4">
                  <p className="text-sm text-foreground leading-relaxed">{openEndedAnalysis.overallInsight}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-card rounded-2xl border border-border shadow-card p-6 mb-8"
        >
          <h2 className="text-lg font-bold text-foreground mb-3">
            {locale === "ar" ? "💡 التوصيات" : "💡 Recommendations"}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {totalScore >= 80
              ? (locale === "ar" ? "أداؤك ممتاز في هذا المسار! يبدو أن لديك مهارات قوية تتوافق مع متطلبات هذا التخصص." : "Excellent performance! You have strong skills aligned with this field.")
              : totalScore >= 60
              ? (locale === "ar" ? "أداؤك جيد مع وجود بعض المجالات التي يمكن تحسينها." : "Good performance with some areas for improvement.")
              : (locale === "ar" ? "تحتاج لمزيد من التحضير في هذا المسار. لا تقلق، كل بداية صعبة!" : "You need more preparation in this path. Don't worry, every beginning is challenging!")}
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
