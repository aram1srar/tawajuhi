import React from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import logo from "@/assets/logo.png";
import vision2030 from "@/assets/vision2030.jpg";

const Footer: React.FC = () => {
  const { t, locale } = useLanguage();

  return (
    <footer className="py-12 gradient-hero">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <img src={logo} alt="Tawajohi" className="w-8 h-8 object-contain" />
          <span className="font-display font-bold text-xl text-primary-foreground">
            {locale === "ar" ? "توجُّهي" : "Tawajohi"}
          </span>
        </div>
        <p className="text-primary-foreground/60 text-sm mb-4">{t.footer.tagline}</p>
        <div className="flex items-center justify-center mb-4">
          <img src={vision2030} alt="Saudi Vision 2030" className="h-12 object-contain opacity-80" />
        </div>
        <p className="text-primary-foreground/40 text-xs">
          © 2026 Tawajohi. {t.footer.rights}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
