import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { motion } from "framer-motion";
import { Trophy, Clock, ArrowRight, TrendingUp, Target, BarChart3 } from "lucide-react";
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
}

const pathNames: Record<string, { ar: string; en: string; color: string }> = {
  health: { ar: "العلوم الصحية والحياتية", en: "Health & Life Sciences", color: "bg-health/10 text-health border-health/30" },
  cs: { ar: "علوم الحاسب والهندسة", en: "Computer Science & Engineering", color: "bg-cs/10 text-cs border-cs/30" },
  business: { ar: "إدارة الأعمال", en: "Business Administration", color: "bg-business/10 text-business border-business/30" },
  shariah: { ar: "الشريعة والدراسات الإسلامية", en: "Shari'ah & Islamic Studies", color: "bg-shariah/10 text-shariah border-shariah/30" },
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

  useEffect(() => {
    if (!user) return;
    const fetchResults = async () => {
      const { data } = await supabase
        .from("test_results")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setResults((data as TestResult[]) || []);
      setLoading(false);
    };
    fetchResults();
  }, [user]);

  // Best pathway: highest average score per path
  const pathAverages = results.reduce<Record<string, { total: number; count: number }>>((acc, r) => {
    if (!acc[r.career_path]) acc[r.career_path] = { total: 0, count: 0 };
    acc[r.career_path].total += r.total_score;
    acc[r.career_path].count += 1;
    return acc;
  }, {});

  const sortedPaths = Object.entries(pathAverages)
    .map(([path, { total, count }]) => ({ path, avg: Math.round(total / count), count }))
    .sort((a, b) => b.avg - a.avg);

  // Strengths analysis
  const theoryAvg = results.length ? Math.round(results.reduce((s, r) => s + r.theory_score, 0) / results.length) : 0;
  const simAvg = results.length ? Math.round(results.reduce((s, r) => s + r.simulation_score, 0) / results.length) : 0;

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
            <Button onClick={() => navigate("/dashboard")} className="rounded-full">
              {locale === "ar" ? "ابدأ اختبارك الأول" : "Take Your First Test"}
            </Button>
          </div>
        ) : (
          <>
            {/* Best Pathway */}
            {sortedPaths.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-card rounded-2xl border border-border shadow-card p-8 mb-8"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Trophy className="w-6 h-6 text-accent" />
                  <h2 className="text-xl font-bold text-foreground">
                    {locale === "ar" ? "المسار الأنسب لك" : "Your Best Fit"}
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
                          {locale === "ar" ? `${sp.count} اختبار` : `${sp.count} test${sp.count > 1 ? "s" : ""}`}
                        </p>
                      </div>
                      <div className="text-end">
                        <span className={`text-2xl font-bold ${idx === 0 ? "text-accent" : "text-foreground"}`}>{sp.avg}%</span>
                        <p className="text-xs text-muted-foreground">{locale === "ar" ? "معدل" : "avg"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Strengths Analysis */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-card rounded-2xl border border-border shadow-card p-8 mb-8"
            >
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-bold text-foreground">
                  {locale === "ar" ? "تحليل نقاط القوة" : "Strengths Analysis"}
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-muted rounded-xl p-6 text-center">
                  <Target className="w-8 h-8 text-primary mx-auto mb-3" />
                  <p className="text-3xl font-bold text-foreground">{theoryAvg}%</p>
                  <p className="text-sm text-muted-foreground mt-1">{locale === "ar" ? "المعرفة النظرية" : "Theory Knowledge"}</p>
                </div>
                <div className="bg-muted rounded-xl p-6 text-center">
                  <TrendingUp className="w-8 h-8 text-accent mx-auto mb-3" />
                  <p className="text-3xl font-bold text-foreground">{simAvg}%</p>
                  <p className="text-sm text-muted-foreground mt-1">{locale === "ar" ? "المهارات العملية" : "Practical Skills"}</p>
                </div>
              </div>
              <p className="mt-6 text-sm text-muted-foreground leading-relaxed">
                {theoryAvg >= simAvg
                  ? (locale === "ar"
                    ? "لديك قوة في الجانب النظري. ننصحك بالتركيز على تطوير مهاراتك العملية من خلال المزيد من تمارين المحاكاة."
                    : "You're stronger in theory. We recommend focusing on developing practical skills through more simulation exercises.")
                  : (locale === "ar"
                    ? "لديك قوة في الجانب العملي. ننصحك بتعزيز معرفتك النظرية لتحقيق توازن أفضل في أدائك."
                    : "You're stronger in practical skills. We recommend strengthening your theoretical knowledge for better balance.")}
              </p>
            </motion.div>

            {/* Test History */}
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
