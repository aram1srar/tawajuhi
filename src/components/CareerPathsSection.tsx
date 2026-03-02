import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { Heart, Code, Briefcase, BookOpen, ArrowUpRight } from "lucide-react";

const icons = {
  health: Heart,
  cs: Code,
  business: Briefcase,
  shariah: BookOpen,
};

const colorClasses = {
  health: { bg: "bg-health/10", text: "text-health", border: "border-health/20", badge: "bg-health/15 text-health" },
  cs: { bg: "bg-cs/10", text: "text-cs", border: "border-cs/20", badge: "bg-cs/15 text-cs" },
  business: { bg: "bg-business/10", text: "text-business", border: "border-business/20", badge: "bg-business/15 text-business" },
  shariah: { bg: "bg-shariah/10", text: "text-shariah", border: "border-shariah/20", badge: "bg-shariah/15 text-shariah" },
};

const CareerPathsSection: React.FC = () => {
  const { t } = useLanguage();
  const paths = ["health", "cs", "business", "shariah"] as const;

  return (
    <section id="paths" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            {t.paths.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.paths.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {paths.map((path, index) => {
            const Icon = icons[path];
            const colors = colorClasses[path];
            const data = t.paths[path];

            return (
              <motion.div
                key={path}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`group relative bg-card rounded-2xl border ${colors.border} p-8 shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer`}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-14 h-14 rounded-xl ${colors.bg} flex items-center justify-center`}>
                    <Icon className={`w-7 h-7 ${colors.text}`} />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <h3 className="text-xl font-bold text-card-foreground mb-3">
                  {data.title}
                </h3>

                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {data.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill) => (
                    <span
                      key={skill}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${colors.badge}`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CareerPathsSection;
