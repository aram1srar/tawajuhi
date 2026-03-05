import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Heart, Code, Briefcase, BookOpen, GraduationCap, ArrowRight, BookMarked, Brain, Calendar } from "lucide-react";

const splitSubjects = (text: string) => text.split(/، |, /);
import { Button } from "@/components/ui/button";

const icons = {
  general: GraduationCap,
  health: Heart,
  cs: Code,
  business: Briefcase,
  shariah: BookOpen,
};

const colorClasses = {
  general: { bg: "bg-general/10", text: "text-general", border: "border-general/20", solid: "bg-general", badge: "bg-general/15 text-general" },
  health: { bg: "bg-health/10", text: "text-health", border: "border-health/20", solid: "bg-health", badge: "bg-health/15 text-health" },
  cs: { bg: "bg-cs/10", text: "text-cs", border: "border-cs/20", solid: "bg-cs", badge: "bg-cs/15 text-cs" },
  business: { bg: "bg-business/10", text: "text-business", border: "border-business/20", solid: "bg-business", badge: "bg-business/15 text-business" },
  shariah: { bg: "bg-shariah/10", text: "text-shariah", border: "border-shariah/20", solid: "bg-shariah", badge: "bg-shariah/15 text-shariah" },
};

type PathKey = keyof typeof icons;

interface CareerPathDetailSectionProps {
  pathKey: PathKey;
  index: number;
}

const CareerPathDetailSection: React.FC<CareerPathDetailSectionProps> = ({ pathKey, index }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const Icon = icons[pathKey];
  const colors = colorClasses[pathKey];
  const data = t.paths[pathKey];
  const labels = t.pathDetails;
  const isEven = index % 2 === 0;

  return (
    <section
      id={`path-${pathKey}`}
      className={`py-20 ${isEven ? "bg-background" : "bg-muted/30"}`}
    >
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-10"
        >
          <div className={`w-16 h-16 rounded-2xl ${colors.bg} flex items-center justify-center shrink-0`}>
            <Icon className={`w-8 h-8 ${colors.text}`} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            {data.title}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Overview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className={`lg:col-span-2 bg-card rounded-2xl border ${colors.border} p-8 shadow-card`}
          >
            <div className="flex items-center gap-3 mb-5">
              <BookMarked className={`w-5 h-5 ${colors.text}`} />
              <h3 className="text-xl font-bold text-card-foreground">{labels.overview}</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed text-base">
              {data.overview}
            </p>
          </motion.div>

          {/* Skills */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className={`bg-card rounded-2xl border ${colors.border} p-8 shadow-card`}
          >
            <div className="flex items-center gap-3 mb-5">
              <Brain className={`w-5 h-5 ${colors.text}`} />
              <h3 className="text-xl font-bold text-card-foreground">{labels.skills}</h3>
            </div>
            <div className="flex flex-col gap-3">
              {data.skills.map((skill) => (
                <div key={skill} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${colors.solid}`} />
                  <span className="text-muted-foreground text-sm">{skill}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Study Plan */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className={`lg:col-span-2 bg-card rounded-2xl border ${colors.border} p-8 shadow-card`}
          >
            <div className="flex items-center gap-3 mb-6">
              <Calendar className={`w-5 h-5 ${colors.text}`} />
              <h3 className="text-xl font-bold text-card-foreground">{labels.studyPlan}</h3>
            </div>
            <div className="space-y-5">
              <div>
                <h4 className={`text-sm font-semibold ${colors.text} mb-2`}>{labels.year2}</h4>
                <div className="flex flex-wrap gap-2">
                  {splitSubjects(data.studyPlan.year2).map((subject) => (
                    <span
                      key={subject}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium ${colors.badge} border ${colors.border}`}
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className={`text-sm font-semibold ${colors.text} mb-2`}>{labels.year3}</h4>
                <div className="flex flex-wrap gap-2">
                  {splitSubjects(data.studyPlan.year3).map((subject) => (
                    <span
                      key={subject}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium ${colors.badge} border ${colors.border}`}
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Test CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className={`bg-card rounded-2xl border ${colors.border} p-8 shadow-card flex flex-col items-center justify-center text-center`}
          >
            <div className={`w-20 h-20 rounded-2xl ${colors.bg} flex items-center justify-center mb-5`}>
              <Icon className={`w-10 h-10 ${colors.text}`} />
            </div>
            <h3 className="text-lg font-bold text-card-foreground mb-3">{labels.tryTest}</h3>
            <Button
              onClick={() => navigate(pathKey === "general" ? "/general-exam" : `/test/${pathKey}`)}
              className={`rounded-full ${colors.solid} text-primary-foreground hover:opacity-90 transition-opacity`}
            >
              {labels.tryTest}
              <ArrowRight className="w-4 h-4 ms-2" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CareerPathDetailSection;
