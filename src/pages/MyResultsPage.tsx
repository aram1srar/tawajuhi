import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { motion } from "framer-motion";
import { Trophy, Clock, TrendingUp, Target, BarChart3, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TestResult {
  id: string;
  career_path: string;
  theory_score: number;
  simulation_score: number;
  total_score: number;
  duration_seconds: number | null;
  feedback: string | null;
  created_at: string;
  recommended_paths: string[] | null;
}

const pathNames: Record<string, { ar: string; en: string; color: string }> = {
  health: { ar: "العلوم الصحية والحياتية", en: "Health & Life Sciences", color: "bg-health/10 text-health border-health/30" },
  cs: { ar: "علوم الحاسب والهندسة", en: "Computer Science & Engineering", color: "bg-cs/10 text-cs border-cs/30" },
  business: { ar: "إدارة الأعمال", en: "Business Administration", color: "bg-business/10 text-business border-business/30" },
  shariah: { ar: "الشريعة والدراسات الإسلامية", en: "Shari'ah & Islamic Studies", color: "bg-shariah/10 text-shariah border-shariah/30" },
  general: { ar: "الاختبار العام", en: "General Exam", color: "bg-primary/10 text-primary border-primary/30" },
};

const formatDuration = (seconds: number | null, locale: string) => {
  if (!seconds) return locale === "ar" ? "غير محدد" : "N/A";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}${locale === "ar" ? " ثانية" : "s"}`;
  return `${mins}${locale === "ar" ? " د " : "m "}${secs}${locale === "ar" ? " ث" : "s"}`;
};

const MyResultsPage: React.FC = () => {
  const { locale } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [aiReportLoading, setAiReportLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchResults = async () => {
      const { data } = await supabase
        .from("test_results")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      const results = (data as TestResult[]) || [];
      setResults(results);
      setLoading(false);

      // Generate AI report if we have results
      if (results.length > 0) {
        setAiReportLoading(true);
        try {
          const { data: reportData } = await supabase.functions.invoke("analyze-strengths", {
            body: {
              results: results.map(r => ({
                career_path: r.career_path,
                theory_score: r.theory_score,
                simulation_score: r.simulation_score,
                total_score: r.total_score,
                duration_seconds: r.duration_seconds,
                recommended_paths: r.recommended_paths,
                created_at: r.created_at,
              })),
              locale,
            },
          });
          if (reportData?.report) setAiReport(reportData.report);
        } catch (err) {
          console.error("Strengths report error:", err);
        } finally {
          setAiReportLoading(false);
        }
      }
    };
    fetchResults();
  }, [user]);

  // Calculate top 2 pathways based on all exam results
  const pathAverages = results.reduce<Record<string, { total: number; count: number }>>((acc, r) => {
    // For general exams, use recommended_paths
    if (r.career_path === "general" && r.recommended_paths?.length) {
      r.recommended_paths.forEach(p => {
        if (!acc[p]) acc[p] = { total: 0, count: 0 };
        acc[p].total += r.total_score;
        acc[p].count += 1;
      });
    } else if (r.career_path !== "general") {
      if (!acc[r.career_path]) acc[r.career_path] = { total: 0, count: 0 };
      acc[r.career_path].total += r.total_score;
      acc[r.career_path].count += 1;
    }
    return acc;
  }, {});

  const sortedPaths = Object.entries(pathAverages)
    .map(([path, { total, count }]) => ({ path, avg: Math.round(total / count), count }))
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 2); // Top 2 only

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center pt-32">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 pt-24 pb-16 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {locale === "ar" ? "نتائجي" : "My Results"}
          </h1>
          <p className="text-muted-foreground mb-10">
            {locale === "ar" ? "تحليل شامل لأدائك ومسارك المهني الأنسب" : "Comprehensive analysis of your performance and best career fit"}
          </p>
        </motion.div>

        {results.length === 0 ? (
          <div className="text-center py-20">
            <BarChart3 className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">{locale === "ar" ? "لم تجرِ أي اختبار بعد" : "You haven't taken any tests yet"}</p>
            <Button onClick={() => navigate("/general-exam")} className="rounded-full">
              {locale === "ar" ? "ابدأ اختبارك الأول" : "Take Your First Test"}
            </Button>
          </div>
        ) : (
          <>
            {/* Best Fit - Top 2 Pathways */}
            {sortedPaths.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-card rounded-2xl border border-border shadow-card p-8 mb-8"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Trophy className="w-6 h-6 text-accent" />
                  <h2 className="text-xl font-bold text-foreground">
                    {locale === "ar" ? "المسارات الأنسب لك" : "Your Best Fit Pathways"}
                  </h2>
                </div>
                <div className="space-y-4">
                  {sortedPaths.map((sp, idx) => (
                    <div key={sp.path} className="flex items-center gap-4">
                      <span className={`text-2xl font-bold ${idx === 0 ? "text-accent" : "text-muted-foreground"}`}>
                        #{idx + 1}
                      </span>
                      <div className="flex-1">
                        <p className={`font-semibold ${idx === 0 ? "text-foreground text-lg" : "text-muted-foreground"}`}>
                          {pathNames[sp.path]?.[locale] || sp.path}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {locale === "ar"
                            ? `بناءً على ${sp.count} اختبار`
                            : `Based on ${sp.count} test${sp.count > 1 ? "s" : ""}`}
                        </p>
                      </div>
                      <div className="text-end">
                        <span className={`text-2xl font-bold ${idx === 0 ? "text-accent" : "text-foreground"}`}>{sp.avg}%</span>
                        <p className="text-xs text-muted-foreground">{locale === "ar" ? "ملاءمة" : "match"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* AI Strengths Analysis */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-card rounded-2xl border border-border shadow-card p-8 mb-8"
            >
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-bold text-foreground">
                  {locale === "ar" ? "تحليل نقاط القوة" : "Strengths Analysis"}
                </h2>
              </div>
              {aiReportLoading ? (
                <div className="flex items-center gap-2 text-muted-foreground py-4">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">{locale === "ar" ? "جاري تحليل نقاط قوتك..." : "Analyzing your strengths..."}</span>
                </div>
              ) : aiReport ? (
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{aiReport}</p>
              ) : (
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-muted rounded-xl p-6 text-center">
                    <Target className="w-8 h-8 text-primary mx-auto mb-3" />
                    <p className="text-3xl font-bold text-foreground">
                      {results.length ? Math.round(results.reduce((s, r) => s + r.theory_score, 0) / results.length) : 0}%
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">{locale === "ar" ? "المعرفة النظرية" : "Theory Knowledge"}</p>
                  </div>
                  <div className="bg-muted rounded-xl p-6 text-center">
                    <TrendingUp className="w-8 h-8 text-accent mx-auto mb-3" />
                    <p className="text-3xl font-bold text-foreground">
                      {results.length ? Math.round(results.reduce((s, r) => s + r.simulation_score, 0) / results.length) : 0}%
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">{locale === "ar" ? "المهارات العملية" : "Practical Skills"}</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Test History - show scores not exam names */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="bg-card rounded-2xl border border-border shadow-card p-8"
            >
              <div className="flex items-center gap-2 mb-6">
                <Clock className="w-6 h-6 text-muted-foreground" />
                <h2 className="text-xl font-bold text-foreground">
                  {locale === "ar" ? "سجل الاختبارات" : "Test History"}
                </h2>
              </div>
              <div className="space-y-3">
                {results.map((r) => (
                  <div key={r.id} className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-border">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${pathNames[r.career_path]?.color || "bg-muted text-muted-foreground"}`}>
                      {pathNames[r.career_path]?.[locale] || r.career_path}
                    </div>
                    <div className="flex-1 min-w-0" />
                    <div className="flex items-center gap-4 text-sm shrink-0">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDuration(r.duration_seconds, locale)}
                      </div>
                      <span className={`font-bold text-lg ${r.total_score >= 80 ? "text-green-600" : r.total_score >= 60 ? "text-accent" : "text-destructive"}`}>
                        {r.total_score}%
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(r.created_at).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyResultsPage;
