import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { ArrowDown, Sparkles } from "lucide-react";
import heroPattern from "@/assets/hero-pattern.jpg";

const HeroSection: React.FC = () => {
  const { t, locale } = useLanguage();
  const navigate = useNavigate();

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroPattern}
          alt=""
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 gradient-hero opacity-90" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 mb-8"
          >
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm text-primary-foreground/90">
              {locale === "ar" ? "مدعوم بالذكاء الاصطناعي" : "AI-Powered"}
            </span>
          </motion.div>

          <h1 className="text-4xl md:text-7xl font-bold text-primary-foreground mb-4 leading-snug md:leading-tight">
            {t.hero.title}
            <br />
            <span className="text-accent">{t.hero.subtitle}</span>
          </h1>

          <p className="text-lg md:text-xl text-primary-foreground/70 mb-10 max-w-2xl mx-auto text-balance leading-relaxed">
            {t.hero.description}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="rounded-full px-8 text-base gradient-gold text-accent-foreground hover:opacity-90 border-0"
              onClick={() => navigate("/general-exam")}
            >
              {t.hero.cta}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-8 text-base border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
              onClick={() => document.getElementById("paths")?.scrollIntoView({ behavior: "smooth" })}
            >
              {t.hero.secondary}
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <a href="#paths">
            <ArrowDown className="w-6 h-6 text-primary-foreground/50 animate-bounce" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
