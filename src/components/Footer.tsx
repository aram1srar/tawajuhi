import React from "react";
import { useLanguage } from "@/i18n/LanguageContext";

const Footer: React.FC = () => {
  const { t, locale } = useLanguage();

  return (
    <footer className="py-12 gradient-hero">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary-foreground/10 flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">ت</span>
          </div>
          <span className="font-display font-bold text-xl text-primary-foreground">
            {locale === "ar" ? "توجيهي" : "Tawajohi"}
          </span>
        </div>
        <p className="text-primary-foreground/60 text-sm mb-4">{t.footer.tagline}</p>
        <p className="text-primary-foreground/40 text-xs">
          © 2026 Tawajohi. {t.footer.rights}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
