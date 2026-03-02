import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import { Heart, Code, Briefcase, BookOpen, ArrowRight, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const pathData = [
  { key: "health", icon: Heart, color: "health", duration: "~25" },
  { key: "cs", icon: Code, color: "cs", duration: "~30" },
  { key: "business", icon: Briefcase, color: "business", duration: "~20" },
  { key: "shariah", icon: BookOpen, color: "shariah", duration: "~20" },
] as const;

const colorMap = {
  health: { bg: "bg-health/10", text: "text-health", border: "border-health/30", solid: "bg-health" },
  cs: { bg: "bg-cs/10", text: "text-cs", border: "border-cs/30", solid: "bg-cs" },
  business: { bg: "bg-business/10", text: "text-business", border: "border-business/30", solid: "bg-business" },
  shariah: { bg: "bg-shariah/10", text: "text-shariah", border: "border-shariah/30", solid: "bg-shariah" },
};

const Dashboard: React.FC = () => {
  const { t, locale } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {locale === "ar" ? `مرحباً 👋` : `Welcome 👋`}
          </h1>
          <p className="text-muted-foreground text-lg">
            {locale === "ar"
              ? "اختر المسار المهني الذي ترغب في استكشافه وابدأ الاختبار"
              : "Choose a career path to explore and start the assessment"}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          {pathData.map((path, index) => {
            const colors = colorMap[path.color];
            const data = t.paths[path.key];

            return (
              <motion.div
                key={path.key}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`group bg-card rounded-2xl border ${colors.border} p-7 shadow-card hover:shadow-card-hover transition-all cursor-pointer`}
                onClick={() => navigate(`/test/${path.key}`)}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center`}>
                    <path.icon className={`w-6 h-6 ${colors.text}`} />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    {path.duration} {locale === "ar" ? "دقيقة" : "min"}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-card-foreground mb-2">{data.title}</h3>
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{data.description}</p>

                <Button variant="outline" className={`rounded-full ${colors.border} ${colors.text} group-hover:${colors.solid} group-hover:text-primary-foreground transition-colors`}>
                  {locale === "ar" ? "ابدأ الاختبار" : "Start Test"}
                  <ArrowRight className="w-4 h-4 ms-2" />
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
